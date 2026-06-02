import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

const workspaceRoot = path.resolve(process.cwd());
const generateScriptPath = path.join(workspaceRoot, 'scripts', 'generate-template-data.mjs');
const generatedDataPath = path.join(workspaceRoot, 'web', 'data', 'template-data.js');
const aiMetadataPath = path.join(workspaceRoot, 'data', 'template-metadata.ai.json');

const DEFAULT_AI_ENDPOINT = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const DEFAULT_AI_MODEL = 'qwen3-vl-flash';

function parseArgs(argv) {
  const options = {
    match: '',
    limit: 3,
    force: false,
    dryRun: false,
    endpoint: process.env.TEMPLATE_AI_ENDPOINT || DEFAULT_AI_ENDPOINT,
    model: process.env.TEMPLATE_AI_MODEL || DEFAULT_AI_MODEL,
    apiKey: process.env.TEMPLATE_AI_API_KEY || process.env.DASHSCOPE_API_KEY || process.env.OPENAI_API_KEY || '',
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    if (current === '--help' || current === '-h') {
      options.help = true;
      continue;
    }

    if (current === '--force') {
      options.force = true;
      continue;
    }

    if (current === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (current === '--match' && next) {
      options.match = next;
      index += 1;
      continue;
    }

    if (current.startsWith('--match=')) {
      options.match = current.slice('--match='.length);
      continue;
    }

    if (current === '--limit' && next) {
      options.limit = Number(next) || options.limit;
      index += 1;
      continue;
    }

    if (current.startsWith('--limit=')) {
      options.limit = Number(current.slice('--limit='.length)) || options.limit;
      continue;
    }

    if (current === '--endpoint' && next) {
      options.endpoint = next;
      index += 1;
      continue;
    }

    if (current.startsWith('--endpoint=')) {
      options.endpoint = current.slice('--endpoint='.length);
      continue;
    }

    if (current === '--model' && next) {
      options.model = next;
      index += 1;
      continue;
    }

    if (current.startsWith('--model=')) {
      options.model = current.slice('--model='.length);
      continue;
    }

    if (current === '--api-key' && next) {
      options.apiKey = next;
      index += 1;
      continue;
    }

    if (current.startsWith('--api-key=')) {
      options.apiKey = current.slice('--api-key='.length);
    }
  }

  options.limit = Math.max(1, Math.floor(options.limit || 1));
  options.match = String(options.match || '').trim();
  options.endpoint = String(options.endpoint || '').trim();
  options.model = String(options.model || '').trim();
  options.apiKey = String(options.apiKey || '').trim();
  return options;
}

function printUsage() {
  console.log([
    '用法：',
    '  node scripts/ai-maintain-template-metadata.mjs [options]',
    '',
    '常用参数：',
    '  --match <关键词>     只处理标题、路径或 id 中包含该关键词的模板',
    '  --limit <数量>       最多处理多少个模板，默认 3',
    '  --force              即使已有 AI 元数据也重新生成',
    '  --dry-run            只列出将要处理的模板，不调用模型',
    '  --endpoint <地址>    指定 OpenAI 兼容接口地址',
    '  --model <名称>       指定模型名称',
    '  --api-key <密钥>     指定 API Key；也可用环境变量 TEMPLATE_AI_API_KEY',
  ].join('\n'));
}

function runGenerator() {
  execFileSync(process.execPath, [generateScriptPath], {
    cwd: workspaceRoot,
    stdio: 'inherit',
  });
}

function loadGeneratedLibrary() {
  const source = fs.readFileSync(generatedDataPath, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return sandbox.window.TEMPLATE_LIBRARY || { templates: [], summary: {} };
}

function readAiMetadataStore() {
  if (!fs.existsSync(aiMetadataPath)) {
    return {
      version: 1,
      updatedAt: '',
      templates: {},
    };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(aiMetadataPath, 'utf8'));
    if (!parsed || typeof parsed !== 'object' || !parsed.templates || typeof parsed.templates !== 'object') {
      throw new Error('AI 元数据文件结构无效');
    }

    return {
      version: 1,
      updatedAt: String(parsed.updatedAt || ''),
      templates: parsed.templates,
    };
  } catch (error) {
    throw new Error(`读取 AI 元数据文件失败：${error instanceof Error ? error.message : '未知错误'}`);
  }
}

function writeAiMetadataStore(store) {
  const sortedEntries = Object.entries(store.templates).sort((left, right) => {
    const leftPath = String(left[1]?.relativePath || left[0]);
    const rightPath = String(right[1]?.relativePath || right[0]);
    return leftPath.localeCompare(rightPath, 'zh-Hans-CN');
  });

  const normalizedStore = {
    version: 1,
    updatedAt: new Date().toISOString(),
    templates: Object.fromEntries(sortedEntries),
  };

  fs.mkdirSync(path.dirname(aiMetadataPath), { recursive: true });
  fs.writeFileSync(aiMetadataPath, `${JSON.stringify(normalizedStore, null, 2)}\n`, 'utf8');
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeStringArray(value, fallback = []) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const normalized = Array.from(new Set(value.map(item => normalizeString(item)).filter(Boolean)));
  return normalized.length > 0 ? normalized : fallback;
}

function extractJsonFromResponse(text) {
  const raw = Array.isArray(text) ? text.map(item => item.text || '').join('\n') : String(text || '').trim();
  if (!raw) {
    throw new Error('模型没有返回可解析内容');
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
      throw error;
    }

    return JSON.parse(raw.slice(start, end + 1));
  }
}

function sanitizeAiMetadata(template, parsed, model) {
  const fallbackLayers = Array.isArray(template.layers) ? template.layers : ['其他专题', '待整理'];
  const layers = normalizeStringArray(parsed.layers, fallbackLayers);
  const note = normalizeString(parsed.note) || template.note || 'AI 未给出补充说明';
  const difficulty = normalizeString(parsed.difficulty) || template.difficulty || '中级';
  const scenarios = normalizeStringArray(parsed.scenarios, template.scenarios || []);
  const signals = normalizeStringArray(parsed.signals, template.signals || []);
  const risks = normalizeStringArray(parsed.risks, template.risks || []);
  const keywords = normalizeStringArray(parsed.keywords, template.keywords || []);

  return {
    relativePath: template.relativePath,
    title: template.title,
    source: 'ai-maintained',
    model,
    updatedAt: new Date().toISOString(),
    layers,
    note,
    difficulty,
    scenarios,
    signals,
    risks,
    keywords,
  };
}

function buildMessages(template) {
  const systemPrompt = [
    '你是算法模板库维护助手。',
    '你的任务不是讲题，而是为个人模板库补全可维护的元数据。',
    '你必须结合模板标题、路径、当前已有元数据和源码内容判断它的算法主题。',
    '请尽量沿用现有分类体系，不要创造风格飘忽的新类别。',
    '返回严格 JSON，不要使用 Markdown 代码块。',
    'JSON 格式如下：',
    '{',
    '  "layers": ["一级专题", "二级专题"],',
    '  "note": "一句话说明该模板在库中的定位",',
    '  "difficulty": "基础或中级或进阶",',
    '  "scenarios": ["适用题型1", "适用题型2"],',
    '  "signals": ["识别信号1", "识别信号2"],',
    '  "risks": ["常见风险1", "常见风险2"],',
    '  "keywords": ["关键词1", "关键词2", "关键词3", "关键词4"]',
    '}',
    '所有字段都必须返回；数组至少 2 项，keywords 推荐 4 到 8 项。',
  ].join('\n');

  const userPrompt = [
    `模板 id：${template.id}`,
    `模板标题：${template.title}`,
    `原始路径：${template.relativePath}`,
    `当前分类：${template.layers.join(' / ')}`,
    `当前说明：${template.note}`,
    `当前难度：${template.difficulty}`,
    `当前适用题型：${(template.scenarios || []).join('、') || '无'}`,
    `当前识别信号：${(template.signals || []).join('、') || '无'}`,
    `当前常见风险：${(template.risks || []).join('、') || '无'}`,
    `当前关键词：${(template.keywords || []).join('、') || '无'}`,
    '下面是模板源码，请结合代码结构进行维护：',
    template.code,
  ].join('\n\n');

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}

async function requestAiMetadata(template, options) {
  const response = await fetch(options.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${options.apiKey}`,
      'X-Title': 'Template Library Maintainer',
    },
    body: JSON.stringify({
      model: options.model,
      temperature: 0.2,
      messages: buildMessages(template),
    }),
  });

  if (!response.ok) {
    throw new Error(`接口调用失败：${response.status}`);
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  return sanitizeAiMetadata(template, extractJsonFromResponse(content), options.model);
}

function matchesTemplate(template, matchText) {
  if (!matchText) {
    return true;
  }

  const haystack = [template.id, template.title, template.relativePath].join(' ').toLowerCase();
  return haystack.includes(matchText.toLowerCase());
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printUsage();
    return;
  }

  runGenerator();
  const library = loadGeneratedLibrary();
  const store = readAiMetadataStore();

  const candidates = library.templates
    .filter(template => matchesTemplate(template, options.match))
    .filter(template => options.force || !store.templates[template.id])
    .slice(0, options.limit);

  if (candidates.length === 0) {
    console.log('没有需要处理的模板。若想重跑已有条目，请增加 --force。');
    return;
  }

  console.log(`本次选中 ${candidates.length} 个模板：`);
  candidates.forEach(template => {
    console.log(`- ${template.title} (${template.relativePath})`);
  });

  if (options.dryRun) {
    console.log('dry-run 模式：未调用模型，也未写入文件。');
    return;
  }

  if (!options.apiKey || !options.endpoint || !options.model) {
    throw new Error('缺少接口配置。请提供 API Key，必要时补充 --endpoint 和 --model。');
  }

  let successCount = 0;
  let failureCount = 0;

  for (const template of candidates) {
    try {
      console.log(`\n[AI 维护] 开始处理：${template.title}`);
      const result = await requestAiMetadata(template, options);
      store.templates[template.id] = result;
      successCount += 1;
      console.log(`[AI 维护] 已完成：${template.title}`);
    } catch (error) {
      failureCount += 1;
      console.error(`[AI 维护] 失败：${template.title} -> ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  writeAiMetadataStore(store);
  runGenerator();

  console.log(`\n维护完成：成功 ${successCount} 个，失败 ${failureCount} 个。`);
  console.log(`AI 元数据文件：${path.relative(workspaceRoot, aiMetadataPath)}`);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});