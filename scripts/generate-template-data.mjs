import fs from 'node:fs';
import path from 'node:path';

const workspaceRoot = path.resolve(process.cwd());
const templateRoot = path.join(workspaceRoot, '模板库');
const outputPath = path.join(workspaceRoot, 'web', 'data', 'template-data.js');
const aiMetadataPath = path.join(workspaceRoot, 'data', 'template-metadata.ai.json');

const ignoredExtensions = new Set(['.exe']);
const ignoredFiles = new Set(['gmon.out']);

const rules = [
  {
    test: relativePath => relativePath === '模板库/模板.cpp',
    layers: ['总览', '通用入口'],
    note: '适合作为快速开始的通用代码骨架。',
  },
  {
    test: relativePath => relativePath === '模板库/test.cpp',
    layers: ['总览', '调试与试验'],
    note: '用于临时测试或验证片段代码。',
  },
  {
    test: relativePath => relativePath.startsWith('模板库/基础/工具与技巧/'),
    layers: ['基础能力', '工具与技巧'],
    note: '偏向语法技巧、调试方法和通用工具。',
  },
  {
    test: relativePath => relativePath.startsWith('模板库/基础/数学与精度/'),
    layers: ['基础能力', '数学与精度'],
    note: '适合处理精度、数论、数值计算等基础问题。',
  },
  {
    test: relativePath => relativePath.startsWith('模板库/基础/字符串/'),
    layers: ['基础能力', '字符串'],
    note: '归档字符串处理与编码变换相关模板。',
  },
  {
    test: relativePath => relativePath.startsWith('模板库/二分/'),
    layers: ['基础算法', '二分'],
    note: '集中管理整数二分、实数二分与二分答案模板。',
  },
  {
    test: relativePath => relativePath.startsWith('模板库/搜索/'),
    layers: ['基础算法', '搜索'],
    note: '包含 DFS、BFS 等基础搜索策略。',
  },
  {
    test: relativePath => relativePath.startsWith('模板库/树状数组/'),
    layers: ['数据结构', '树状数组'],
    note: '按修改与查询的组合方式分类。',
  },
  {
    test: relativePath => relativePath.includes('线段树'),
    layers: ['数据结构', '线段树'],
    note: '虽然原文件位于图论目录，但展示层统一归到线段树专题。',
  },
  {
    test: relativePath => relativePath.includes('并查集'),
    layers: ['数据结构', '并查集'],
    note: '并查集既可用于图论，也适合作为独立数据结构查看。',
  },
  {
    test: relativePath => relativePath.startsWith('模板库/数据结构/'),
    layers: ['数据结构', '其他结构'],
    note: '放置不便细分到其他专题的数据结构模板。',
  },
  {
    test: relativePath => relativePath.startsWith('模板库/图论/') && relativePath.includes('dijkstra'),
    layers: ['图论', '最短路'],
    note: '适用于非负权单源最短路场景。',
  },
  {
    test: relativePath => relativePath.startsWith('模板库/图论/') && relativePath.includes('floyd'),
    layers: ['图论', '最短路'],
    note: '适用于多源最短路或点数较小的场景。',
  },
  {
    test: relativePath => relativePath.startsWith('模板库/图论/') && (relativePath.includes('kruskal') || relativePath.includes('prim')),
    layers: ['图论', '最小生成树'],
    note: '面向最小生成树专题整理。',
  },
  {
    test: relativePath => relativePath.startsWith('模板库/图论/') && relativePath.includes('拓扑排序'),
    layers: ['图论', '拓扑排序'],
    note: '用于 DAG 依赖关系处理。',
  },
  {
    test: relativePath => relativePath.startsWith('模板库/图论/') && relativePath.includes('LCA'),
    layers: ['图论', '树上算法'],
    note: '用于树上最近公共祖先等问题。',
  },
  {
    test: relativePath => relativePath.startsWith('模板库/图论/') && relativePath.includes('链式前向星'),
    layers: ['图论', '存图与遍历'],
    note: '适合高效存储稀疏图。',
  },
  {
    test: relativePath => relativePath.startsWith('模板库/dp/背包问题/'),
    layers: ['动态规划', '背包问题'],
    note: '按 0/1、完全、多重、分组、依赖等典型模型分类。',
  },
  {
    test: relativePath => relativePath.startsWith('模板库/dp/进阶/'),
    layers: ['动态规划', '进阶专题'],
    note: '包含数位 DP、状压 DP、树形 DP 等进阶模型。',
  },
  {
    test: relativePath => relativePath.startsWith('模板库/dp/'),
    layers: ['动态规划', '基础专题'],
    note: '存放 LIS、线性 DP、区间覆盖等基础 DP 模板。',
  },
  {
    test: relativePath => relativePath.includes('差分'),
    layers: ['其他专题', '差分与技巧'],
    note: '适合记录差分、压维等组合技巧。',
  },
];

function walk(currentPath) {
  const entries = fs.readdirSync(currentPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(currentPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    const extension = path.extname(entry.name);
    if (ignoredExtensions.has(extension) || ignoredFiles.has(entry.name)) {
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(new Set(value.map(item => normalizeString(item)).filter(Boolean)));
}

function readAiMetadataMap() {
  if (!fs.existsSync(aiMetadataPath)) {
    return {};
  }

  try {
    const raw = fs.readFileSync(aiMetadataPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.templates || typeof parsed.templates !== 'object') {
      return {};
    }

    return parsed.templates;
  } catch (error) {
    console.warn(`Failed to read AI metadata file: ${path.relative(workspaceRoot, aiMetadataPath)}`);
    return {};
  }
}

function mergeTemplateMetadata(baseTemplate, aiOverride) {
  if (!aiOverride || typeof aiOverride !== 'object') {
    return {
      ...baseTemplate,
      metadataSource: 'rule-based',
      metadataUpdatedAt: null,
    };
  }

  const merged = {
    ...baseTemplate,
    metadataSource: normalizeString(aiOverride.source) || 'ai-maintained',
    metadataUpdatedAt: normalizeString(aiOverride.updatedAt) || null,
  };

  const overrideLayers = normalizeStringArray(aiOverride.layers);
  if (overrideLayers.length >= 2) {
    merged.layers = overrideLayers;
  }

  const overrideNote = normalizeString(aiOverride.note);
  if (overrideNote) {
    merged.note = overrideNote;
  }

  const overrideDifficulty = normalizeString(aiOverride.difficulty);
  if (overrideDifficulty) {
    merged.difficulty = overrideDifficulty;
  }

  const overrideScenarios = normalizeStringArray(aiOverride.scenarios);
  if (overrideScenarios.length > 0) {
    merged.scenarios = overrideScenarios;
  }

  const overrideSignals = normalizeStringArray(aiOverride.signals);
  if (overrideSignals.length > 0) {
    merged.signals = overrideSignals;
  }

  const overrideRisks = normalizeStringArray(aiOverride.risks);
  if (overrideRisks.length > 0) {
    merged.risks = overrideRisks;
  }

  const overrideKeywords = normalizeStringArray(aiOverride.keywords);
  if (overrideKeywords.length > 0) {
    merged.keywords = overrideKeywords;
  }

  return merged;
}

function classify(relativePath) {
  for (const rule of rules) {
    if (rule.test(relativePath)) {
      return { layers: rule.layers, note: rule.note };
    }
  }

  return {
    layers: ['其他专题', '待整理'],
    note: '暂未细分，后续可继续人工归类。',
  };
}

function createId(relativePath) {
  return relativePath
    .replace(/^模板库\//, '')
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function createTitle(fileName) {
  return fileName.replace(path.extname(fileName), '');
}

function containsAny(text, keywords) {
  return keywords.some(keyword => text.includes(keyword));
}

function inferDifficulty(relativePath, title, layers) {
  const text = `${relativePath} ${title} ${layers.join(' ')}`;

  if (containsAny(text, ['进阶', '数位dp', '状压dp', '轮廓线dp', '斜率优化dp', 'ntt', 'LCA', '线段树'])) {
    return '进阶';
  }

  if (containsAny(text, ['dp', '图论', '树状数组', '背包', '并查集', '二分', '搜索'])) {
    return '中级';
  }

  return '基础';
}

function inferScenarios(relativePath, title, layers) {
  const text = `${relativePath} ${title} ${layers.join(' ')}`;

  const scenarioRules = [
    { keywords: ['dijkstra'], values: ['非负权单源最短路', '稀疏图路径计算'] },
    { keywords: ['floyd'], values: ['多源最短路', '点数较小的全点对距离'] },
    { keywords: ['kruskal', 'prim'], values: ['最小生成树', '连通图最小代价连边'] },
    { keywords: ['拓扑排序'], values: ['依赖关系排序', 'DAG 处理'] },
    { keywords: ['LCA'], values: ['树上路径查询', '祖先关系判断'] },
    { keywords: ['链式前向星'], values: ['稀疏图存图', '图遍历建模'] },
    { keywords: ['线段树'], values: ['区间修改与查询', '需要对数级维护区间信息'] },
    { keywords: ['树状数组'], values: ['前缀信息维护', '单点与区间统计'] },
    { keywords: ['并查集'], values: ['连通块维护', '集合合并判定'] },
    { keywords: ['二分'], values: ['答案具有单调性', '边界定位问题'] },
    { keywords: ['背包'], values: ['容量限制选择', '价值最大化或方案计数'] },
    { keywords: ['LIS'], values: ['最长上升子序列', '序列优化问题'] },
    { keywords: ['数位dp'], values: ['数位限制统计', '按位构造计数'] },
    { keywords: ['树形dp', '树上背包', '换根dp'], values: ['树上状态转移', '以节点关系定义状态'] },
    { keywords: ['状压dp'], values: ['子集状态枚举', '位掩码状态转移'] },
    { keywords: ['轮廓线dp'], values: ['棋盘覆盖', '二维压缩状态转移'] },
    { keywords: ['区间dp'], values: ['区间合并', '子区间递推'] },
    { keywords: ['搜索', 'dfs', 'bfs'], values: ['状态遍历', '搜索最短步数或枚举方案'] },
    { keywords: ['差分'], values: ['批量区间增减', '降维后快速还原'] },
    { keywords: ['字符串', 'BWT', 'string'], values: ['字符串处理', '字符序列变换'] },
    { keywords: ['高精度', 'int128', '数学', '三分', 'ntt'], values: ['数值计算', '精度或数学优化'] },
  ];

  for (const rule of scenarioRules) {
    if (containsAny(text, rule.keywords)) {
      return rule.values;
    }
  }

  return ['通用代码骨架', '需要按题意手动改造'];
}

function inferSignals(relativePath, title, layers) {
  const text = `${relativePath} ${title} ${layers.join(' ')}`;

  const signalRules = [
    { keywords: ['dijkstra', 'floyd'], values: ['题目出现最短路', '带权图距离关系'] },
    { keywords: ['kruskal', 'prim'], values: ['要求最小连通代价', '边权排序或贪心选边'] },
    { keywords: ['拓扑排序'], values: ['存在先后依赖', '图中应无环'] },
    { keywords: ['LCA', '树形dp', '换根dp', '树上背包'], values: ['输入是一棵树', '答案依赖父子关系'] },
    { keywords: ['线段树', '树状数组'], values: ['多次修改与查询', '需要快速维护区间或前缀信息'] },
    { keywords: ['二分'], values: ['答案范围可枚举', '满足性随答案单调变化'] },
    { keywords: ['背包'], values: ['有限资源约束', '每个物品有体积与价值'] },
    { keywords: ['LIS'], values: ['关注上升关系', '需要优化序列状态'] },
    { keywords: ['数位dp'], values: ['统计某范围内数字', '条件落在每一位上'] },
    { keywords: ['状压dp'], values: ['状态总数较小但可用位表示', '需要枚举子集'] },
    { keywords: ['区间dp'], values: ['答案由子区间合并', '区间长度递增转移'] },
    { keywords: ['搜索', 'dfs', 'bfs'], values: ['需要枚举可达状态', '图或网格逐层扩展'] },
    { keywords: ['差分'], values: ['大量区间更新', '离线处理更方便'] },
    { keywords: ['高精度', 'int128', '数学', '三分', 'ntt'], values: ['数值范围大', '普通整型或暴力不够用'] },
  ];

  for (const rule of signalRules) {
    if (containsAny(text, rule.keywords)) {
      return rule.values;
    }
  }

  return ['先识别题型特征', '再决定是否调用此模板'];
}

function inferRisks(relativePath, title, layers) {
  const text = `${relativePath} ${title} ${layers.join(' ')}`;

  const riskRules = [
    { keywords: ['dijkstra'], values: ['含负权边时不能直接使用', '堆中旧状态若不丢弃会影响效率'] },
    { keywords: ['floyd'], values: ['点数过大时复杂度过高', '初始化无穷大和自环要谨慎'] },
    { keywords: ['kruskal', '并查集'], values: ['并查集合并和路径压缩容易漏写', '边数与节点编号边界容易出错'] },
    { keywords: ['prim'], values: ['稠密图与稀疏图实现差异要分清', '重边和不连通图要单独判断'] },
    { keywords: ['拓扑排序'], values: ['有环时结果无效', '入度初始化容易漏点'] },
    { keywords: ['LCA'], values: ['深度和父节点初始化容易错', '倍增边界要和节点数对应'] },
    { keywords: ['线段树'], values: ['懒标记下传遗漏', '区间边界和 pushup 易写错'] },
    { keywords: ['树状数组'], values: ['下标通常从 1 开始', 'lowbit 循环边界容易死循环'] },
    { keywords: ['二分'], values: ['边界更新不当会死循环', '要分清找左边界还是右边界'] },
    { keywords: ['背包'], values: ['循环方向错会导致模型变化', '状态定义不清会让转移失真'] },
    { keywords: ['LIS'], values: ['贪心版和 DP 版含义不同', '二分数组维护的不是实际答案序列'] },
    { keywords: ['数位dp'], values: ['前导零与上界限制容易漏掉', '记忆化状态设计复杂'] },
    { keywords: ['状压dp', '轮廓线dp'], values: ['状态压缩编码复杂', '位运算细节和状态合法性容易出错'] },
    { keywords: ['树形dp', '换根dp', '树上背包'], values: ['递归顺序影响转移正确性', '子树合并复杂度容易爆炸'] },
    { keywords: ['dfs', '搜索'], values: ['回溯恢复容易遗漏', '去重不完整会导致重复搜索'] },
    { keywords: ['bfs'], values: ['visited 标记时机决定是否重复入队', '网格边界判断容易漏写'] },
    { keywords: ['差分'], values: ['差分数组还原步骤容易漏掉', '压维后下标映射更容易错位'] },
    { keywords: ['高精度', 'int128', '数学', '三分', 'ntt'], values: ['精度与溢出要优先检查', '公式推导错比实现错更隐蔽'] },
  ];

  for (const rule of riskRules) {
    if (containsAny(text, rule.keywords)) {
      return rule.values;
    }
  }

  return ['需要根据题目手动补全边界条件', '使用前先确认输入规模和适用范围'];
}

function inferKeywords(relativePath, title, layers) {
  const rawKeywords = new Set([...layers, title]);
  const text = `${relativePath} ${title}`;

  const keywordRules = [
    { keywords: ['dijkstra'], values: ['最短路', '堆优化', '非负边权'] },
    { keywords: ['floyd'], values: ['邻接矩阵', '多源最短路'] },
    { keywords: ['kruskal'], values: ['排序边', '最小生成树'] },
    { keywords: ['prim'], values: ['生成树', '贪心扩展'] },
    { keywords: ['拓扑排序'], values: ['入度', 'DAG'] },
    { keywords: ['LCA'], values: ['倍增', '祖先'] },
    { keywords: ['线段树'], values: ['区间', '懒标记'] },
    { keywords: ['树状数组'], values: ['前缀和', 'lowbit'] },
    { keywords: ['并查集'], values: ['连通块', '合并查询'] },
    { keywords: ['二分'], values: ['单调性', '边界'] },
    { keywords: ['背包'], values: ['容量', '状态转移'] },
    { keywords: ['LIS'], values: ['上升子序列', '贪心'] },
    { keywords: ['数位dp'], values: ['记忆化', '按位统计'] },
    { keywords: ['状压dp'], values: ['位压缩', '子集枚举'] },
    { keywords: ['轮廓线dp'], values: ['轮廓线', '插头'] },
    { keywords: ['dfs'], values: ['递归', '回溯'] },
    { keywords: ['bfs'], values: ['队列', '最短步数'] },
    { keywords: ['差分'], values: ['前缀还原', '批量更新'] },
  ];

  for (const rule of keywordRules) {
    if (containsAny(text, rule.keywords)) {
      rule.values.forEach(value => rawKeywords.add(value));
    }
  }

  return Array.from(rawKeywords);
}

const files = walk(templateRoot)
  .filter(fullPath => path.extname(fullPath) === '.cpp')
  .sort((left, right) => left.localeCompare(right, 'zh-Hans-CN'));

const aiMetadataMap = readAiMetadataMap();

const templates = files.map(fullPath => {
  const relativePath = path.relative(workspaceRoot, fullPath).split(path.sep).join('/');
  const fileName = path.basename(fullPath);
  const content = fs.readFileSync(fullPath, 'utf8');
  const classification = classify(relativePath);

  const template = {
    id: createId(relativePath),
    title: createTitle(fileName),
    fileName,
    relativePath,
    originalFolders: relativePath.split('/').slice(0, -1),
    layers: classification.layers,
    note: classification.note,
    difficulty: inferDifficulty(relativePath, createTitle(fileName), classification.layers),
    scenarios: inferScenarios(relativePath, createTitle(fileName), classification.layers),
    signals: inferSignals(relativePath, createTitle(fileName), classification.layers),
    risks: inferRisks(relativePath, createTitle(fileName), classification.layers),
    keywords: inferKeywords(relativePath, createTitle(fileName), classification.layers),
    code: content,
  };

  return mergeTemplateMetadata(template, aiMetadataMap[template.id]);
});

const summary = templates.reduce((accumulator, template) => {
  const topLayer = template.layers[0];
  accumulator[topLayer] = (accumulator[topLayer] || 0) + 1;
  return accumulator;
}, {});

const output = `window.TEMPLATE_LIBRARY = ${JSON.stringify({
  generatedAt: new Date().toISOString(),
  total: templates.length,
  summary,
  templates,
}, null, 2)};\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output, 'utf8');

console.log(`Generated ${templates.length} templates into ${path.relative(workspaceRoot, outputPath)}`);