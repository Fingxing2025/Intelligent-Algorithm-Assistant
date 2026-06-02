import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';

import dns from 'node:dns';

function aiFetch(urlString, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(urlString);
    const transport = urlObj.protocol === 'https:' ? https : http;
    const defaultPort = urlObj.protocol === 'https:' ? 443 : 80;

    dns.resolve4(urlObj.hostname, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        reject(new Error(`无法解析域名 ${urlObj.hostname} 的 IPv4 地址：${err?.message || '未找到 A 记录'}`));
        return;
      }

      const ip = addresses[0];
      const headers = { ...(options.headers || {}), Host: urlObj.hostname };

      const requestOptions = {
        hostname: ip,
        port: urlObj.port || defaultPort,
        path: urlObj.pathname + urlObj.search,
        method: (options.method || 'GET').toUpperCase(),
        headers,
        timeout: 30000,
      };

      const req = transport.request(requestOptions, (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const rawBody = Buffer.concat(chunks).toString('utf8');
          const response = {
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            _body: rawBody,
            json() {
              return JSON.parse(this._body);
            },
            text() {
              return Promise.resolve(this._body);
            },
          };
          resolve(response);
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`连接超时：${urlString}`));
      });

      if (options.body) {
        req.write(options.body);
      }
      req.end();
    });
  });
}

const workspaceRoot = path.resolve(process.cwd());
const webRoot = path.join(workspaceRoot, 'web');
const templateRoot = path.join(workspaceRoot, '模板库');
const generateScriptPath = path.join(workspaceRoot, 'scripts', 'generate-template-data.mjs');
const generatedDataPath = path.join(webRoot, 'data', 'template-data.js');
const aiMetadataPath = path.join(workspaceRoot, 'data', 'template-metadata.ai.json');
const DEFAULT_AI_ENDPOINT = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const DEFAULT_AI_MODEL = 'qwen3-vl-flash';

function parsePort(argv) {
  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    if (current === '--port' && next) {
      return Number(next) || 8123;
    }

    if (current.startsWith('--port=')) {
      return Number(current.slice('--port='.length)) || 8123;
    }
  }

  return 8123;
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });
  response.end(JSON.stringify(payload));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on('data', chunk => chunks.push(chunk));
    request.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    request.on('error', reject);
  });
}

function runGenerator() {
  execFileSync(process.execPath, [generateScriptPath], {
    cwd: workspaceRoot,
    stdio: 'pipe',
  });
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

function loadGeneratedLibrary() {
  const source = fs.readFileSync(generatedDataPath, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return sandbox.window.TEMPLATE_LIBRARY || { templates: [], summary: {}, total: 0 };
}

function readAiMetadataStore() {
  if (!fs.existsSync(aiMetadataPath)) {
    return {
      version: 1,
      updatedAt: '',
      templates: {},
    };
  }

  const parsed = JSON.parse(fs.readFileSync(aiMetadataPath, 'utf8'));
  if (!parsed || typeof parsed !== 'object' || !parsed.templates || typeof parsed.templates !== 'object') {
    throw new Error('AI 元数据文件结构无效');
  }

  return {
    version: 1,
    updatedAt: String(parsed.updatedAt || ''),
    templates: parsed.templates,
  };
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

function buildAiMetadataMessages(template) {
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
  const response = await aiFetch(options.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${options.apiKey}`,
      'X-Title': 'Template Library Maintainer',
    },
    body: JSON.stringify({
      model: options.model,
      temperature: 0.2,
      messages: buildAiMetadataMessages(template),
    }),
  });

  if (!response.ok) {
    throw new Error(`接口调用失败：${response.status}`);
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  return sanitizeAiMetadata(template, extractJsonFromResponse(content), options.model);
}

function normalizeRelativeDirectory(relativeDirectory) {
  const normalized = String(relativeDirectory || '')
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '');

  if (!normalized) {
    return '模板库';
  }

  return normalized.startsWith('模板库') ? normalized : `模板库/${normalized}`;
}

function sanitizeFileName(fileName) {
  const normalized = String(fileName || '').trim().replace(/[\\/:*?"<>|]+/g, '-');
  if (!normalized) {
    return '';
  }

  return /\.(cpp|cc|cxx)$/i.test(normalized) ? normalized : `${normalized}.cpp`;
}

function ensurePathInsideTemplateRoot(relativeDirectory, fileName) {
  const normalizedDirectory = normalizeRelativeDirectory(relativeDirectory);
  const normalizedFileName = sanitizeFileName(fileName);
  if (!normalizedFileName) {
    throw new Error('文件名不能为空');
  }

  const targetDirectory = path.resolve(workspaceRoot, normalizedDirectory);
  const targetPath = path.resolve(targetDirectory, normalizedFileName);

  if (!targetPath.startsWith(templateRoot)) {
    throw new Error('目标路径不在模板库目录内');
  }

  return {
    normalizedDirectory,
    normalizedFileName,
    targetDirectory,
    targetPath,
  };
}

function ensureRelativePathInsideTemplateRoot(relativePathValue) {
  const normalizedRelativePath = String(relativePathValue || '')
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '');

  if (!normalizedRelativePath.startsWith('模板库/')) {
    throw new Error('目标模板路径无效');
  }

  const targetPath = path.resolve(workspaceRoot, normalizedRelativePath);
  if (!targetPath.startsWith(templateRoot)) {
    throw new Error('目标路径不在模板库目录内');
  }

  return {
    normalizedRelativePath,
    targetPath,
  };
}

function removeAiMetadataEntries(templateId, relativePathValue) {
  if (!fs.existsSync(aiMetadataPath)) {
    return false;
  }

  const store = readAiMetadataStore();
  let changed = false;

  Object.entries(store.templates).forEach(([key, value]) => {
    const currentRelativePath = String(value?.relativePath || '');
    if ((templateId && key === templateId) || currentRelativePath === relativePathValue) {
      delete store.templates[key];
      changed = true;
    }
  });

  if (changed) {
    writeAiMetadataStore(store);
  }

  return changed;
}

function removeEmptyTemplateDirectories(startDirectory) {
  let currentDirectory = startDirectory;

  while (currentDirectory.startsWith(templateRoot) && currentDirectory !== templateRoot) {
    if (!fs.existsSync(currentDirectory)) {
      currentDirectory = path.dirname(currentDirectory);
      continue;
    }

    if (fs.readdirSync(currentDirectory).length > 0) {
      break;
    }

    fs.rmdirSync(currentDirectory);
    currentDirectory = path.dirname(currentDirectory);
  }
}

async function handleSaveTemplate(request, response) {
  try {
    const rawBody = await readRequestBody(request);
    const parsed = JSON.parse(rawBody || '{}');
    const code = String(parsed.code || '').trim();
    if (!code) {
      sendJson(response, 400, { error: '模板代码不能为空' });
      return;
    }

    const { normalizedDirectory, normalizedFileName, targetDirectory, targetPath } = ensurePathInsideTemplateRoot(
      parsed.relativeDirectory,
      parsed.fileName,
    );

    fs.mkdirSync(targetDirectory, { recursive: true });
    fs.writeFileSync(targetPath, code.endsWith('\n') ? code : `${code}\n`, 'utf8');

    runGenerator();
    let library = loadGeneratedLibrary();
    const relativePath = path.relative(workspaceRoot, targetPath).split(path.sep).join('/');
    let savedTemplate = library.templates.find(template => template.relativePath === relativePath) || null;
    let aiMetadataMessage = '';

    if (parsed.enrichWithAiMetadata && savedTemplate) {
      const apiKey = normalizeString(parsed.aiApiKey);
      if (!apiKey) {
        aiMetadataMessage = '已跳过 AI 元数据：未提供 API Key';
      } else {
        try {
          const aiMetadata = await requestAiMetadata(savedTemplate, {
            endpoint: normalizeString(parsed.aiEndpoint) || DEFAULT_AI_ENDPOINT,
            model: normalizeString(parsed.aiModel) || DEFAULT_AI_MODEL,
            apiKey,
          });
          const store = readAiMetadataStore();
          store.templates[savedTemplate.id] = aiMetadata;
          writeAiMetadataStore(store);
          runGenerator();
          library = loadGeneratedLibrary();
          savedTemplate = library.templates.find(template => template.relativePath === relativePath) || savedTemplate;
          aiMetadataMessage = '已补充 AI 元数据';
        } catch (error) {
          aiMetadataMessage = `AI 元数据补充失败：${error instanceof Error ? error.message : '未知错误'}`;
        }
      }
    }

    sendJson(response, 200, {
      ok: true,
      message: `已保存到 ${normalizedDirectory}/${normalizedFileName}`,
      aiMetadataMessage,
      savedRelativePath: relativePath,
      savedTemplate,
      library,
    });
  } catch (error) {
    sendJson(response, 500, {
      error: error instanceof Error ? error.message : '保存模板失败',
    });
  }
}

async function handleAiChatProxy(request, response) {
  try {
    const rawBody = await readRequestBody(request);
    const parsed = JSON.parse(rawBody || '{}');
    const apiKey = normalizeString(parsed.apiKey);
    if (!apiKey) {
      sendJson(response, 400, { error: 'API Key 不能为空' });
      return;
    }

    const endpoint = normalizeString(parsed.endpoint) || DEFAULT_AI_ENDPOINT;
    const model = normalizeString(parsed.model) || DEFAULT_AI_MODEL;
    const messages = Array.isArray(parsed.messages) ? parsed.messages : [];
    const temperature = typeof parsed.temperature === 'number' ? parsed.temperature : 0.2;

    if (messages.length === 0) {
      sendJson(response, 400, { error: '消息列表不能为空' });
      return;
    }

    const requestBody = {
      model,
      temperature,
      messages,
    };

    let aiResponse;
    try {
      aiResponse = await aiFetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'X-Title': 'Template Learning Assistant',
        },
        body: JSON.stringify(requestBody),
      });
    } catch (fetchError) {
      const detail = `${endpoint} - ${fetchError.message || fetchError}`;
      sendJson(response, 502, {
        error: `连接 AI 接口失败：${detail}`,
        endpoint,
        model,
      });
      return;
    }

    let payload;
    try {
      const rawText = await aiResponse.text();
      try {
        payload = JSON.parse(rawText);
      } catch (parseError) {
        sendJson(response, 502, {
          error: `AI 接口返回非 JSON 内容（${aiResponse.status}）：${rawText.slice(0, 500)}`,
          endpoint,
          model,
        });
        return;
      }
    } catch (bodyError) {
      sendJson(response, 502, {
        error: `读取 AI 响应失败：${bodyError.message || bodyError}`,
        endpoint,
        model,
      });
      return;
    }

    if (!aiResponse.ok) {
      sendJson(response, 502, {
        error: payload.error?.message || payload.error?.code || payload.message || `接口返回 ${aiResponse.status}`,
        endpoint,
        model,
        detail: payload.error ? JSON.stringify(payload.error).slice(0, 500) : '',
      });
      return;
    }

    if (!payload.choices || !Array.isArray(payload.choices) || payload.choices.length === 0) {
      sendJson(response, 502, {
        error: 'AI 接口未返回有效 choices 数组',
        endpoint,
        model,
        rawPreview: JSON.stringify(payload).slice(0, 500),
      });
      return;
    }

    sendJson(response, 200, payload);
  } catch (error) {
    sendJson(response, 502, {
      error: error instanceof Error ? error.message : 'AI 接口调用失败',
    });
  }
}

async function handleDeleteTemplate(request, response) {
  try {
    const rawBody = await readRequestBody(request);
    const parsed = JSON.parse(rawBody || '{}');
    const templateId = normalizeString(parsed.templateId);
    const { normalizedRelativePath, targetPath } = ensureRelativePathInsideTemplateRoot(parsed.relativePath);

    if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) {
      sendJson(response, 404, { error: '目标模板文件不存在' });
      return;
    }

    fs.unlinkSync(targetPath);
    removeEmptyTemplateDirectories(path.dirname(targetPath));
    removeAiMetadataEntries(templateId, normalizedRelativePath);

    runGenerator();
    const library = loadGeneratedLibrary();

    sendJson(response, 200, {
      ok: true,
      message: `已删除 ${normalizedRelativePath}`,
      deletedTemplateId: templateId,
      library,
    });
  } catch (error) {
    sendJson(response, 500, {
      error: error instanceof Error ? error.message : '删除模板失败',
    });
  }
}

function getContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  switch (extension) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.js':
      return 'application/javascript; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'text/plain; charset=utf-8';
  }
}

function serveStatic(requestPath, response) {
  const cleanPath = requestPath === '/' ? '/index.html' : requestPath;
  const filePath = path.resolve(webRoot, `.${cleanPath}`);

  if (!filePath.startsWith(webRoot)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    response.writeHead(404);
    response.end('Not Found');
    return;
  }

  response.writeHead(200, {
    'Content-Type': getContentType(filePath),
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });
  fs.createReadStream(filePath).pipe(response);
}

runGenerator();

const port = parsePort(process.argv.slice(2));
const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || `127.0.0.1:${port}`}`);

  if (request.method === 'POST' && url.pathname === '/api/save-template') {
    await handleSaveTemplate(request, response);
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/delete-template') {
    await handleDeleteTemplate(request, response);
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/ai-chat') {
    await handleAiChatProxy(request, response);
    return;
  }

  serveStatic(url.pathname, response);
});

server.listen(port, () => {
  console.log(`Template Learning Assistant server running at http://127.0.0.1:${port}`);
});