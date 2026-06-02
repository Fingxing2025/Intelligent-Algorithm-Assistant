const library = window.TEMPLATE_LIBRARY || { templates: [], summary: {} };
const pageType = document.body?.dataset?.page || 'library';
const hasAiPage = pageType === 'ai-analysis';

const DEFAULT_AI_ENDPOINT = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const DEFAULT_AI_MODEL = 'qwen3-vl-flash';
const DEFAULT_AI_EXTRA_PROMPT = '先提取题型和关键信号，再从本地模板库中选最相关的 3 个候选模板，说明依据并补 1 条误判风险；不要输出题解，严格返回 JSON。';
const AI_API_KEY_SESSION_KEY = 'template-ai-api-key';
const RECENT_TEMPLATES_STORAGE_KEY = 'template-recent-views';
const FAVORITE_TEMPLATES_STORAGE_KEY = 'template-favorite-views';
const MAX_RECENT_TEMPLATES = 6;
const MAX_FAVORITE_TEMPLATES = 12;
const TEMPLATE_EXPLAIN_SYSTEM_PROMPT = [
  '你是算法模板讲解助手。',
  '你必须结合当前模板的标题、分类、标签和源码，自动识别它对应的算法或数据结构主题。',
  '如果模板标题过于泛化，不能只复述标题，必须结合代码和标签判断算法。',
  '请返回严格 JSON，不要输出 Markdown 代码块。',
  'JSON 格式如下：',
  '{',
  '  "algorithm_name": "识别出的算法名称",',
  '  "algorithm_summary": "一句话解释这个算法在做什么",',
  '  "core_ideas": ["核心思路1", "核心思路2"],',
  '  "when_to_use": ["适用场景1", "适用场景2"],',
  '  "identify_signals": ["识别信号1", "识别信号2"],',
  '  "pitfalls": ["误区1", "误区2"],',
  '  "reading_steps": ["阅读源码建议1", "阅读源码建议2"]',
  '}',
  '所有字段都必须返回；数组至少返回 2 项。',
].join('\n');
const LEGACY_AI_ENDPOINTS = new Set([
  'https://openrouter.ai/api/v1/chat/completions',
]);
const LEGACY_AI_MODELS = new Set([
  'qwen/qwen2.5-vl-72b-instruct',
]);

const state = {
  keyword: '',
  activeCategory: '',
  selectedId: null,
  expandedKeys: new Set(),
  wrapCode: false,
  collapseCode: true,
  recommendationResult: null,
  analysisImageDataUrl: '',
  analysisBusy: false,
  explanationVisible: false,
  explanationBusy: false,
  explanationResult: null,
  explanationTemplateId: null,
  codeClassificationBusy: false,
  codeClassificationResult: null,
  templateActionStatusMessage: '',
  saveTemplateNameTouched: false,
  saveTemplateDirectory: '',
  saveTemplateDirectoryTouched: false,
  recentTemplateIds: [],
  favoriteTemplateIds: [],
};

const COLLAPSE_LINE_THRESHOLD = 32;

const CPP_KEYWORDS = new Set([
  'alignas', 'alignof', 'asm', 'auto', 'break', 'case', 'catch', 'class', 'const', 'constexpr', 'consteval',
  'constinit', 'continue', 'default', 'delete', 'do', 'else', 'enum', 'explicit', 'export', 'extern', 'for',
  'friend', 'goto', 'if', 'inline', 'mutable', 'namespace', 'new', 'noexcept', 'operator', 'private', 'protected',
  'public', 'register', 'reinterpret_cast', 'requires', 'return', 'sizeof', 'static', 'static_assert',
  'struct', 'switch', 'template', 'this', 'throw', 'try', 'typedef', 'typeid', 'typename', 'union', 'using',
  'virtual', 'volatile', 'while'
]);

const CPP_TYPES = new Set([
  'bool', 'char', 'char8_t', 'char16_t', 'char32_t', 'double', 'float', 'int', 'int8_t', 'int16_t', 'int32_t',
  'int64_t', 'll', 'long', 'short', 'signed', 'size_t', 'string', 'uint8_t', 'uint16_t', 'uint32_t', 'uint64_t',
  'unsigned', 'void', 'wchar_t'
]);

let actionToastTimer = 0;

const elements = {
  keyword: document.querySelector('#keyword'),
  clearSearch: document.querySelector('#clear-search'),
  clearCategoryFilter: document.querySelector('#clear-category-filter'),
  clearRecent: document.querySelector('#clear-recent'),
  clearFavorites: document.querySelector('#clear-favorites'),
  resultCount: document.querySelector('#result-count'),
  quickFilterRoot: document.querySelector('#quick-filter-root'),
  recentRoot: document.querySelector('#recent-root'),
  favoriteRoot: document.querySelector('#favorite-root'),
  summaryCards: document.querySelector('#summary-cards'),
  treeRoot: document.querySelector('#tree-root'),
  heroTotal: document.querySelector('#hero-total'),
  heroCategories: document.querySelector('#hero-categories'),
  aiEndpoint: document.querySelector('#ai-endpoint'),
  aiModel: document.querySelector('#ai-model'),
  aiApiKey: document.querySelector('#ai-api-key'),
  aiExtraPrompt: document.querySelector('#ai-extra-prompt'),
  problemImage: document.querySelector('#problem-image'),
  pasteTarget: document.querySelector('#paste-target'),
  imagePreviewShell: document.querySelector('#image-preview-shell'),
  imagePreview: document.querySelector('#image-preview'),
  runRecommendation: document.querySelector('#run-recommendation'),
  clearRecommendation: document.querySelector('#clear-recommendation'),
  recommendResults: document.querySelector('#recommend-results'),
  recommendCount: document.querySelector('#recommend-count'),
  recommendStatus: document.querySelector('#recommend-status'),
  analysisSummary: document.querySelector('#analysis-summary'),
  analysisSummaryText: document.querySelector('#analysis-summary-text'),
  analysisSignals: document.querySelector('#analysis-signals'),
  analysisCautionText: document.querySelector('#analysis-caution-text'),
  classifyApiKey: document.querySelector('#classify-api-key'),
  classifyCodeInput: document.querySelector('#classify-code-input'),
  classifyCodeFile: document.querySelector('#classify-code-file'),
  runCodeClassify: document.querySelector('#run-code-classify'),
  clearCodeClassify: document.querySelector('#clear-code-classify'),
  saveCurrentTemplate: document.querySelector('#save-current-template'),
  deleteCurrentTemplate: document.querySelector('#delete-current-template'),
  saveTemplateName: document.querySelector('#save-template-name'),
  saveTemplatePath: document.querySelector('#save-template-path'),
  saveTemplatePathOptions: document.querySelector('#save-template-path-options'),
  saveTemplateAiMetadata: document.querySelector('#save-template-ai-metadata'),
  saveTemplateHint: document.querySelector('#save-template-hint'),
  templateActionStatus: document.querySelector('#template-action-status'),
  classifyStatus: document.querySelector('#classify-status'),
  classifyCount: document.querySelector('#classify-count'),
  classifySummary: document.querySelector('#classify-summary'),
  classifyCategoryText: document.querySelector('#classify-category-text'),
  classifySignals: document.querySelector('#classify-signals'),
  classifyCautionText: document.querySelector('#classify-caution-text'),
  classifyResults: document.querySelector('#classify-results'),
  emptyState: document.querySelector('#empty-state'),
  detailPanel: document.querySelector('#detail-panel'),
  detailBreadcrumb: document.querySelector('#detail-breadcrumb'),
  detailTitle: document.querySelector('#detail-title'),
  detailTag: document.querySelector('#detail-tag'),
  toggleFavorite: document.querySelector('#toggle-favorite'),
  detailDifficulty: document.querySelector('#detail-difficulty'),
  detailKeywords: document.querySelector('#detail-keywords'),
  detailLayers: document.querySelector('#detail-layers'),
  detailPath: document.querySelector('#detail-path'),
  detailNote: document.querySelector('#detail-note'),
  detailScenarios: document.querySelector('#detail-scenarios'),
  detailSignals: document.querySelector('#detail-signals'),
  detailRisks: document.querySelector('#detail-risks'),
  toggleExplanation: document.querySelector('#toggle-explanation'),
  explainBody: document.querySelector('#explain-body'),
  explainApiKey: document.querySelector('#explain-api-key'),
  runExplanation: document.querySelector('#run-explanation'),
  explainStatus: document.querySelector('#explain-status'),
  explainResult: document.querySelector('#explain-result'),
  explainAlgorithmName: document.querySelector('#explain-algorithm-name'),
  explainSummary: document.querySelector('#explain-summary'),
  explainCoreIdeas: document.querySelector('#explain-core-ideas'),
  explainWhenToUse: document.querySelector('#explain-when-to-use'),
  explainIdentifySignals: document.querySelector('#explain-identify-signals'),
  explainPitfalls: document.querySelector('#explain-pitfalls'),
  explainReadingSteps: document.querySelector('#explain-reading-steps'),
  codeBlock: document.querySelector('#code-block'),
  detailCode: document.querySelector('#detail-code'),
  codeMeta: document.querySelector('#code-meta'),
  codeStatus: document.querySelector('#code-status'),
  resetView: document.querySelector('#reset-view'),
  expandAll: document.querySelector('#expand-all'),
  toggleWrap: document.querySelector('#toggle-wrap'),
  toggleCollapse: document.querySelector('#toggle-collapse'),
  copyCode: document.querySelector('#copy-code'),
};

function buildTree(templates) {
  const root = [];

  for (const template of templates) {
    let currentLevel = root;
    let currentPath = '';

    template.layers.forEach((segment, index) => {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      let node = currentLevel.find(item => item.type === 'branch' && item.name === segment);

      if (!node) {
        node = {
          type: 'branch',
          name: segment,
          key: currentPath,
          children: [],
        };
        currentLevel.push(node);
      }

      if (index === template.layers.length - 1) {
        node.children.push({
          type: 'leaf',
          key: template.id,
          template,
        });
      }

      currentLevel = node.children;
    });
  }

  return root;
}

function getFilteredTemplates() {
  const keyword = state.keyword.trim().toLowerCase();
  return library.templates.filter(template => {
    if (state.activeCategory && template.layers[0] !== state.activeCategory) {
      return false;
    }

    if (!keyword) {
      return true;
    }

    const haystack = [
      template.title,
      template.relativePath,
      ...template.layers,
      template.note,
      template.difficulty,
      ...(template.scenarios || []),
      ...(template.signals || []),
      ...(template.risks || []),
      ...(template.keywords || []),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(keyword);
  });
}

function renderQuickFilters() {
  if (!elements.quickFilterRoot) {
    return;
  }

  elements.quickFilterRoot.innerHTML = '';
  Object.entries(library.summary || {}).forEach(([name, count]) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'quick-filter-chip';
    if (state.activeCategory === name) {
      chip.classList.add('is-active');
    }
    chip.textContent = `${name} ${count}`;
    chip.addEventListener('click', () => {
      state.activeCategory = state.activeCategory === name ? '' : name;
      expandAllBranches();
      render();
    });
    elements.quickFilterRoot.appendChild(chip);
  });
}

function renderSummary() {
  elements.heroTotal.textContent = String(library.total || library.templates.length);
  elements.heroCategories.textContent = String(Object.keys(library.summary || {}).length);
  elements.summaryCards.innerHTML = '';

  Object.entries(library.summary || {}).forEach(([name, count]) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'summary-card';
    card.innerHTML = `<span>${name}</span><strong>${count}</strong>`;
    card.addEventListener('click', () => {
      state.keyword = name;
      elements.keyword.value = name;
      expandAllBranches();
      render();
    });
    elements.summaryCards.appendChild(card);
  });
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/最短路径/g, '最短路')
    .replace(/单源最短路径/g, '单源最短路')
    .replace(/有向无环图/g, 'dag')
    .replace(/最近公共祖先/g, 'lca')
    .replace(/并查集/g, '连通块 合并查询')
    .replace(/树状数组/g, '前缀和 lowbit')
    .replace(/线段树/g, '区间 懒标记')
    .replace(/最小生成树/g, '最小生成树 连通图最小代价连边')
    .replace(/0\/1背包/g, '01背包');
}

function createTemplateCatalog() {
  return library.templates.map(template => {
    const keywords = (template.keywords || []).slice(0, 4).join('、');
    const scenarios = (template.scenarios || []).slice(0, 2).join('、');
    return `${template.id} | ${template.title} | ${template.layers.join('/')} | 关键词:${keywords} | 适用:${scenarios}`;
  }).join('\n');
}

function escapeForHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function findTemplateByCandidate(candidate) {
  if (!candidate) {
    return null;
  }

  if (candidate.id) {
    const exact = library.templates.find(template => template.id === candidate.id);
    if (exact) {
      return exact;
    }
  }

  const normalizedTitle = normalizeText(candidate.title || '');
  if (!normalizedTitle) {
    return null;
  }

  return library.templates.find(template => {
    const current = normalizeText(template.title);
    return current === normalizedTitle || current.includes(normalizedTitle) || normalizedTitle.includes(current);
  }) || null;
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

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('读取图片失败'));
    reader.readAsDataURL(file);
  });
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('读取代码文件失败'));
    reader.readAsText(file, 'utf8');
  });
}

function clearAnalysisImage() {
  state.analysisImageDataUrl = '';
  if (elements.problemImage) {
    elements.problemImage.value = '';
  }
  if (elements.imagePreview) {
    elements.imagePreview.src = '';
  }
  if (elements.imagePreviewShell) {
    elements.imagePreviewShell.classList.add('hidden');
  }
}

async function applyAnalysisImageFile(file, sourceLabel) {
  if (!file) {
    clearAnalysisImage();
    return;
  }

  try {
    state.analysisImageDataUrl = await readFileAsDataUrl(file);
    elements.imagePreview.src = state.analysisImageDataUrl;
    elements.imagePreviewShell.classList.remove('hidden');
    elements.recommendStatus.textContent = `${sourceLabel}已就绪，等待调用模型`;
  } catch (error) {
    clearAnalysisImage();
    elements.recommendStatus.textContent = '图片读取失败';
  }
}

function getImageFileFromClipboard(event) {
  const items = Array.from(event.clipboardData?.items || []);
  for (const item of items) {
    if (item.kind === 'file' && item.type.startsWith('image/')) {
      return item.getAsFile();
    }
  }
  return null;
}

function isEditableTarget(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  const tagName = target.tagName;
  return tagName === 'INPUT' || tagName === 'TEXTAREA';
}

async function handleImagePaste(event, sourceLabel) {
  const imageFile = getImageFileFromClipboard(event);
  if (!imageFile) {
    return false;
  }

  event.preventDefault();
  await applyAnalysisImageFile(imageFile, sourceLabel);
  return true;
}

function isValidAiEndpoint(value) {
  if (!value) {
    return false;
  }

  if (LEGACY_AI_ENDPOINTS.has(value)) {
    return false;
  }

  try {
    const parsed = new URL(value);
    if (!['https:', 'http:'].includes(parsed.protocol)) {
      return false;
    }

    const hostname = parsed.hostname || '';
    if (!hostname.includes('.')) {
      return false;
    }

    // 检测常见的 DashScope 域名拼写错误：dashscope.aliyun 而非 dashscope.aliyuncs.com
    if (hostname.includes('aliyun') && !hostname.includes('aliyuncs')) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

function getStoredAiSettings() {
  const storedEndpoint = localStorage.getItem('template-ai-endpoint') || '';
  const storedModel = localStorage.getItem('template-ai-model') || '';
  const storedExtraPrompt = localStorage.getItem('template-ai-extra-prompt') || '';

  const endpoint = isValidAiEndpoint(storedEndpoint)
    ? storedEndpoint
    : DEFAULT_AI_ENDPOINT;
  const model = !storedModel || LEGACY_AI_MODELS.has(storedModel)
    ? DEFAULT_AI_MODEL
    : storedModel;
  const extraPrompt = storedExtraPrompt || DEFAULT_AI_EXTRA_PROMPT;

  // 如果 localStorage 中存了无效端点，自动纠正
  if (storedEndpoint && endpoint === DEFAULT_AI_ENDPOINT && elements.aiEndpoint) {
    elements.aiEndpoint.value = DEFAULT_AI_ENDPOINT;
    localStorage.setItem('template-ai-endpoint', DEFAULT_AI_ENDPOINT);
  }

  return {
    endpoint,
    model,
    extraPrompt,
  };
}

function persistAiSettings() {
  localStorage.setItem('template-ai-endpoint', elements.aiEndpoint.value.trim());
  localStorage.setItem('template-ai-model', elements.aiModel.value.trim());
  localStorage.setItem('template-ai-extra-prompt', elements.aiExtraPrompt.value.trim());
}

function getStoredRecentTemplateIds() {
  try {
    const raw = localStorage.getItem(RECENT_TEMPLATES_STORAGE_KEY);
    const parsed = JSON.parse(raw || '[]');
    if (!Array.isArray(parsed)) {
      return [];
    }

    const validIds = new Set(library.templates.map(template => template.id));
    return parsed.filter(id => typeof id === 'string' && validIds.has(id)).slice(0, MAX_RECENT_TEMPLATES);
  } catch (error) {
    return [];
  }
}

function getStoredFavoriteTemplateIds() {
  try {
    const raw = localStorage.getItem(FAVORITE_TEMPLATES_STORAGE_KEY);
    const parsed = JSON.parse(raw || '[]');
    if (!Array.isArray(parsed)) {
      return [];
    }

    const validIds = new Set(library.templates.map(template => template.id));
    return parsed.filter(id => typeof id === 'string' && validIds.has(id)).slice(0, MAX_FAVORITE_TEMPLATES);
  } catch (error) {
    return [];
  }
}

function persistRecentTemplateIds() {
  localStorage.setItem(RECENT_TEMPLATES_STORAGE_KEY, JSON.stringify(state.recentTemplateIds));
}

function persistFavoriteTemplateIds() {
  localStorage.setItem(FAVORITE_TEMPLATES_STORAGE_KEY, JSON.stringify(state.favoriteTemplateIds));
}

function pushRecentTemplate(templateId) {
  if (!templateId) {
    return;
  }

  state.recentTemplateIds = [templateId, ...state.recentTemplateIds.filter(id => id !== templateId)]
    .slice(0, MAX_RECENT_TEMPLATES);
  persistRecentTemplateIds();
}

function isFavoriteTemplate(templateId) {
  return state.favoriteTemplateIds.includes(templateId);
}

function toggleFavoriteTemplate(templateId) {
  if (!templateId) {
    return;
  }

  if (isFavoriteTemplate(templateId)) {
    state.favoriteTemplateIds = state.favoriteTemplateIds.filter(id => id !== templateId);
  } else {
    state.favoriteTemplateIds = [templateId, ...state.favoriteTemplateIds.filter(id => id !== templateId)]
      .slice(0, MAX_FAVORITE_TEMPLATES);
  }

  persistFavoriteTemplateIds();
}

function removeTemplateFromCollections(templateId) {
  if (!templateId) {
    return;
  }

  state.recentTemplateIds = state.recentTemplateIds.filter(id => id !== templateId);
  state.favoriteTemplateIds = state.favoriteTemplateIds.filter(id => id !== templateId);
  persistRecentTemplateIds();
  persistFavoriteTemplateIds();
}

function getTemplateDeleteStatusElement() {
  return elements.templateActionStatus || elements.classifyStatus || null;
}

function setTemplateDeleteStatus(message) {
  const target = getTemplateDeleteStatusElement();
  if (!target) {
    return;
  }

  target.textContent = message;
  target.classList.remove('hidden');
}

function clearTemplateDeleteStatus() {
  if (!elements.templateActionStatus) {
    return;
  }

  elements.templateActionStatus.textContent = '';
  elements.templateActionStatus.classList.add('hidden');
}

function ensureActionToastElement() {
  let toast = document.querySelector('#action-toast');
  if (toast) {
    return toast;
  }

  toast = document.createElement('div');
  toast.id = 'action-toast';
  toast.className = 'action-toast hidden';
  document.body.appendChild(toast);
  return toast;
}

function showActionToast(message) {
  const normalizedMessage = String(message || '').trim();
  if (!normalizedMessage) {
    return;
  }

  const toast = ensureActionToastElement();
  toast.textContent = normalizedMessage;
  toast.classList.remove('hidden');
  toast.classList.add('is-visible');

  if (actionToastTimer) {
    window.clearTimeout(actionToastTimer);
  }

  actionToastTimer = window.setTimeout(() => {
    toast.classList.remove('is-visible');
    toast.classList.add('hidden');
  }, 2400);
}

function renderRecentTemplates() {
  if (!elements.recentRoot) {
    return;
  }

  elements.recentRoot.innerHTML = '';
  const recentTemplates = state.recentTemplateIds
    .map(id => library.templates.find(template => template.id === id))
    .filter(Boolean);

  if (recentTemplates.length === 0) {
    elements.recentRoot.innerHTML = `
      <div class="recent-empty">
        <p>选中过的模板会出现在这里，方便快速回看。</p>
      </div>
    `;
    return;
  }

  recentTemplates.forEach(template => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'recent-item';
    if (template.id === state.selectedId) {
      button.classList.add('active');
    }
    button.innerHTML = `
      <strong>${escapeForHtml(template.title)}</strong>
      <span>${escapeForHtml(template.layers.join(' / '))}</span>
      <small>${escapeForHtml(template.fileName)}</small>
    `;
    button.addEventListener('click', () => {
      state.selectedId = template.id;
      expandPathForTemplate(template);
      render();
    });
    elements.recentRoot.appendChild(button);
  });
}

function renderFavoriteTemplates() {
  if (!elements.favoriteRoot) {
    return;
  }

  elements.favoriteRoot.innerHTML = '';
  const favoriteTemplates = state.favoriteTemplateIds
    .map(id => library.templates.find(template => template.id === id))
    .filter(Boolean);

  if (favoriteTemplates.length === 0) {
    elements.favoriteRoot.innerHTML = `
      <div class="recent-empty">
        <p>收藏常用模板后，可以从这里快速进入。</p>
      </div>
    `;
    return;
  }

  favoriteTemplates.forEach(template => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'recent-item';
    if (template.id === state.selectedId) {
      button.classList.add('active');
    }
    button.innerHTML = `
      <strong>${escapeForHtml(template.title)}</strong>
      <span>${escapeForHtml(template.layers.join(' / '))}</span>
      <small>${escapeForHtml(template.fileName)}</small>
    `;
    button.addEventListener('click', () => {
      state.selectedId = template.id;
      expandPathForTemplate(template);
      render();
    });
    elements.favoriteRoot.appendChild(button);
  });
}

function getSessionAiApiKey() {
  return sessionStorage.getItem(AI_API_KEY_SESSION_KEY) || '';
}

function persistSessionAiApiKey(value) {
  const normalized = String(value || '').trim();
  if (normalized) {
    sessionStorage.setItem(AI_API_KEY_SESSION_KEY, normalized);
    return;
  }

  sessionStorage.removeItem(AI_API_KEY_SESSION_KEY);
}

function getExplainApiKey() {
  return elements.explainApiKey?.value.trim() || getSessionAiApiKey();
}

function getSharedAiApiKey() {
  return elements.classifyApiKey?.value.trim() || getExplainApiKey();
}

function getTopMatchedTemplateForCodeClassification() {
  return state.codeClassificationResult?.matches?.[0]?.template || null;
}

function getSuggestedTemplateDirectory() {
  const matchedTemplate = getTopMatchedTemplateForCodeClassification();
  if (matchedTemplate?.relativePath) {
    const segments = matchedTemplate.relativePath.split('/');
    return segments.slice(0, -1).join('/');
  }

  const topCategory = state.codeClassificationResult?.matches?.[0]?.template?.layers?.[0]
    || state.codeClassificationResult?.categoryText?.split(' / ')[0]
    || '';

  if (topCategory === '图论') {
    return '模板库/图论';
  }
  if (topCategory === '动态规划') {
    return '模板库/dp';
  }
  if (topCategory === '数据结构') {
    return '模板库/数据结构';
  }
  if (topCategory === '基础能力') {
    return '模板库/基础';
  }
  if (topCategory === '基础算法') {
    return '模板库/二分';
  }

  return '模板库';
}

function sanitizeTemplateFileName(name) {
  const normalized = String(name || '').trim().replace(/[\\/:*?"<>|]+/g, '-');
  if (!normalized) {
    return '';
  }

  return /\.(cpp|cc|cxx)$/i.test(normalized) ? normalized : `${normalized}.cpp`;
}

function sanitizeTemplateDirectory(directory) {
  const normalized = String(directory || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/[?*:"<>|]+/g, '-')
    .replace(/\/+/g, '/')
    .replace(/^\/+|\/+$/g, '');

  if (!normalized) {
    return '模板库';
  }

  return normalized.startsWith('模板库') ? normalized : `模板库/${normalized}`;
}

function slugifySuggestionSegment(value) {
  return String(value || '')
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function slugifyDirectorySegment(value) {
  return String(value || '')
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getCategorySegmentsForSuggestion() {
  const matchedTemplate = getTopMatchedTemplateForCodeClassification();
  if (Array.isArray(matchedTemplate?.layers) && matchedTemplate.layers.length > 0) {
    return matchedTemplate.layers.filter(Boolean);
  }

  return String(state.codeClassificationResult?.categoryText || '')
    .split(' / ')
    .map(segment => segment.trim())
    .filter(Boolean);
}

function getAiSuggestedDirectory() {
  const suggestedDirectory = state.codeClassificationResult?.suggestedDirectory || '';
  return suggestedDirectory ? sanitizeTemplateDirectory(suggestedDirectory) : '';
}

function buildDirectoryFromCategorySegments(categorySegments) {
  if (!Array.isArray(categorySegments) || categorySegments.length === 0) {
    return '模板库';
  }

  const topCategory = categorySegments[0] || '';
  const tailSegments = categorySegments.slice(1).map(slugifyDirectorySegment).filter(Boolean);

  if (topCategory === '图论') {
    return sanitizeTemplateDirectory(['模板库', '图论', ...tailSegments].join('/'));
  }
  if (topCategory === '动态规划') {
    return sanitizeTemplateDirectory(['模板库', 'dp', ...tailSegments].join('/'));
  }
  if (topCategory === '数据结构') {
    return sanitizeTemplateDirectory(['模板库', '数据结构', ...tailSegments].join('/'));
  }
  if (topCategory === '基础能力') {
    return sanitizeTemplateDirectory(['模板库', '基础', ...tailSegments].join('/'));
  }
  if (topCategory === '基础算法') {
    return sanitizeTemplateDirectory(['模板库', ...tailSegments].join('/'));
  }

  return sanitizeTemplateDirectory(['模板库', ...categorySegments.map(slugifyDirectorySegment).filter(Boolean)].join('/'));
}

function getBestDirectoryByCategorySegments(categorySegments) {
  if (!Array.isArray(categorySegments) || categorySegments.length === 0) {
    return '';
  }

  let bestMatch = '';
  let bestScore = 0;

  library.templates.forEach(template => {
    const templateLayers = Array.isArray(template.layers) ? template.layers : [];
    let score = 0;
    const comparableLength = Math.min(categorySegments.length, templateLayers.length);

    for (let index = 0; index < comparableLength; index += 1) {
      if (categorySegments[index] !== templateLayers[index]) {
        break;
      }
      score += 1;
    }

    if (score === 0) {
      return;
    }

    const parts = String(template.relativePath || '').split('/');
    if (parts.length < 2) {
      return;
    }

    const directory = parts.slice(0, -1).join('/');
    if (score > bestScore || (score === bestScore && directory.length > bestMatch.length)) {
      bestScore = score;
      bestMatch = directory;
    }
  });

  return bestMatch;
}

function buildUniqueTemplateFileName(baseName, preferredDirectory) {
  const normalizedBase = slugifySuggestionSegment(baseName) || '新模板';
  const existingPaths = new Set(library.templates.map(template => String(template.relativePath || '').toLowerCase()));
  let attempt = 0;

  while (attempt < 50) {
    const suffix = attempt === 0 ? '' : `-${attempt + 1}`;
    const fileName = sanitizeTemplateFileName(`${normalizedBase}${suffix}`);
    const relativePath = `${preferredDirectory || '模板库'}/${fileName}`.toLowerCase();
    if (!existingPaths.has(relativePath)) {
      return fileName;
    }
    attempt += 1;
  }

  return sanitizeTemplateFileName(`${normalizedBase}-${Date.now()}`);
}

function getSuggestedTemplateFileName(preferredDirectory = getSuggestedTemplateDirectory()) {
  const aiSuggestedFileName = sanitizeTemplateFileName(state.codeClassificationResult?.suggestedFileName || '');
  if (aiSuggestedFileName) {
    return buildUniqueTemplateFileName(aiSuggestedFileName.replace(/\.(cpp|cc|cxx)$/i, ''), preferredDirectory);
  }

  const matchedTemplate = getTopMatchedTemplateForCodeClassification();
  if (matchedTemplate?.title) {
    return buildUniqueTemplateFileName(matchedTemplate.title, preferredDirectory);
  }

  const categorySegments = getCategorySegmentsForSuggestion();
  const primarySignal = state.codeClassificationResult?.signals?.[0] || '';
  const categoryTail = categorySegments[categorySegments.length - 1] || categorySegments[0] || '';
  const suggestionParts = [categoryTail, primarySignal]
    .map(slugifySuggestionSegment)
    .filter(Boolean)
    .slice(0, 2);

  if (suggestionParts.length > 0) {
    return buildUniqueTemplateFileName(suggestionParts.join('-'), preferredDirectory);
  }

  return buildUniqueTemplateFileName('新模板', preferredDirectory);
}

function getTemplateDirectoryOptions() {
  const directories = new Set(['模板库']);
  library.templates.forEach(template => {
    const parts = template.relativePath.split('/');
    if (parts.length > 1) {
      directories.add(sanitizeTemplateDirectory(parts.slice(0, -1).join('/')));
    }
  });

  return Array.from(directories).sort((left, right) => left.localeCompare(right, 'zh-Hans-CN'));
}

function applyLibraryDataUpdate(nextLibrary) {
  if (!nextLibrary || !Array.isArray(nextLibrary.templates) || typeof nextLibrary.summary !== 'object') {
    return;
  }

  library.templates = nextLibrary.templates;
  library.summary = nextLibrary.summary;
  library.total = nextLibrary.total || nextLibrary.templates.length;
  library.generatedAt = nextLibrary.generatedAt || library.generatedAt;
  window.TEMPLATE_LIBRARY = library;
}

function renderTemplateSaveSuggestion() {
  const matchedTemplate = getTopMatchedTemplateForCodeClassification();
  const categorySegments = getCategorySegmentsForSuggestion();
  const suggestedDirectory = getAiSuggestedDirectory()
    || (matchedTemplate?.relativePath ? getSuggestedTemplateDirectory() : '')
    || getBestDirectoryByCategorySegments(categorySegments)
    || buildDirectoryFromCategorySegments(categorySegments)
    || getSuggestedTemplateDirectory();
  const suggestedFileName = getSuggestedTemplateFileName(suggestedDirectory);

  if (elements.saveTemplatePath) {
    const options = getTemplateDirectoryOptions();
    const nextDirectory = state.saveTemplateDirectoryTouched
      ? sanitizeTemplateDirectory(state.saveTemplateDirectory || suggestedDirectory)
      : suggestedDirectory;

    if (elements.saveTemplatePathOptions) {
      elements.saveTemplatePathOptions.innerHTML = '';
      options.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        elements.saveTemplatePathOptions.appendChild(option);
      });

      if (!options.includes(nextDirectory)) {
        const extraOption = document.createElement('option');
        extraOption.value = nextDirectory;
        elements.saveTemplatePathOptions.appendChild(extraOption);
      }
    }

    elements.saveTemplatePath.value = nextDirectory;
    state.saveTemplateDirectory = nextDirectory;
  }

  if (elements.saveTemplateName && !state.saveTemplateNameTouched) {
    elements.saveTemplateName.value = suggestedFileName;
  }

  if (elements.saveTemplateHint) {
    const aiHint = elements.saveTemplateAiMetadata?.checked
      ? '并尝试补一份 AI 元数据'
      : '并直接刷新查询列表';
    const currentFileName = sanitizeTemplateFileName(elements.saveTemplateName?.value) || suggestedFileName;
    const currentDirectory = state.saveTemplateDirectory || suggestedDirectory;
    const fileNameMessage = currentFileName === suggestedFileName
      ? `建议文件名：${suggestedFileName}`
      : `建议文件名：${suggestedFileName}；当前文件名：${currentFileName}`;
    const directoryMessage = currentDirectory === suggestedDirectory
      ? `建议目录：${suggestedDirectory}`
      : `建议目录：${suggestedDirectory}；当前目录：${currentDirectory}`;
    elements.saveTemplateHint.textContent = `${fileNameMessage}。${directoryMessage}。点击“加入模板库”后会自动同步本地文件、${aiHint}。`;
  }
}

async function saveCurrentTemplateToLibrary() {
  if (!elements.classifyCodeInput || !elements.classifyStatus) {
    return;
  }

  const code = elements.classifyCodeInput.value.trim();
  if (!code) {
    elements.classifyStatus.textContent = '请先提供要保存的模板代码';
    return;
  }

  const fileName = sanitizeTemplateFileName(elements.saveTemplateName?.value) || getSuggestedTemplateFileName();
  const suggestedDirectory = sanitizeTemplateDirectory(
    elements.saveTemplatePath?.value || state.saveTemplateDirectory || getSuggestedTemplateDirectory(),
  );
  if (elements.saveTemplateName) {
    elements.saveTemplateName.value = fileName;
  }
  if (elements.saveTemplatePath) {
    elements.saveTemplatePath.value = suggestedDirectory;
  }

  const content = code.endsWith('\n') ? code : `${code}\n`;

  try {
    elements.classifyStatus.textContent = '正在写入模板库并同步列表';
    const response = await fetch('/api/save-template', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        relativeDirectory: suggestedDirectory,
        code: content,
        enrichWithAiMetadata: Boolean(elements.saveTemplateAiMetadata?.checked),
        aiEndpoint: getStoredAiSettings().endpoint,
        aiModel: getStoredAiSettings().model,
        aiApiKey: getSharedAiApiKey(),
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || `保存模板失败：${response.status}`);
    }

    applyLibraryDataUpdate(payload.library);

    if (payload.savedTemplate?.id) {
      state.selectedId = payload.savedTemplate.id;
      state.activeCategory = payload.savedTemplate.layers?.[0] || '';
      expandPathForTemplate(payload.savedTemplate);
    }

    const messageParts = [payload.message || `已保存 ${fileName}`];
    if (payload.aiMetadataMessage) {
      messageParts.push(payload.aiMetadataMessage);
    }
    elements.classifyStatus.textContent = messageParts.join('；');
    showActionToast(payload.message || `已保存 ${fileName}`);
    state.saveTemplateDirectoryTouched = false;
    renderTemplateSaveSuggestion();
    render();
  } catch (error) {
    elements.classifyStatus.textContent = error instanceof Error
      ? `${error.message}。如果你是从旧的静态服务打开页面，请重新双击 启动网页.command 打开。`
      : '保存模板失败';
  }
}

async function deleteCurrentTemplateFromLibrary() {
  const selected = getSelectedTemplate();
  const statusElement = getTemplateDeleteStatusElement();
  if (!selected || !statusElement) {
    return;
  }

  const confirmed = window.confirm(`确认删除 ${selected.relativePath} 吗？系统会同时清理它的 AI 元数据。`);
  if (!confirmed) {
    return;
  }

  try {
    setTemplateDeleteStatus('正在删除当前模板');
    const response = await fetch('/api/delete-template', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId: selected.id,
        relativePath: selected.relativePath,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || `删除模板失败：${response.status}`);
    }

    removeTemplateFromCollections(selected.id);
    applyLibraryDataUpdate(payload.library);

    if (state.codeClassificationResult) {
      state.codeClassificationResult = {
        ...state.codeClassificationResult,
        matches: (state.codeClassificationResult.matches || [])
          .filter(item => item?.template?.id !== selected.id),
      };
    }

    state.selectedId = state.codeClassificationResult?.matches?.[0]?.template?.id || null;
    state.explanationTemplateId = null;
    state.explanationResult = null;
    state.templateActionStatusMessage = `${payload.message || '已删除当前模板'}，你可以修改代码后重新加入。`;
    showActionToast(payload.message || '已删除当前模板');
    render();
  } catch (error) {
    setTemplateDeleteStatus(error instanceof Error
      ? `${error.message}。如果你是从旧的静态服务打开页面，请重新双击 启动网页.command 打开。`
      : '删除模板失败');
  }
}

function setCodeClassificationIdleState(message = '等待输入代码') {
  state.codeClassificationBusy = false;
  state.codeClassificationResult = null;
  if (elements.classifyStatus) {
    elements.classifyStatus.textContent = message;
  }
  renderCodeClassificationResult();
}

function buildTemplateExplainUserPrompt(template) {
  return [
    `当前模板标题：${template.title}`,
    `人工分类路径：${template.layers.join(' / ')}`,
    `原始文件位置：${template.relativePath}`,
    `学习难度：${template.difficulty || '未标注'}`,
    `分类说明：${template.note || '无'}`,
    `适用题型：${(template.scenarios || []).join('、') || '无'}`,
    `识别信号：${(template.signals || []).join('、') || '无'}`,
    `常见风险：${(template.risks || []).join('、') || '无'}`,
    `关键词：${(template.keywords || []).join('、') || '无'}`,
    '下面是模板源码，请结合代码结构自动识别当前算法并生成讲解：',
    template.code,
  ].join('\n\n');
}

function resetTemplateExplanation(templateId = null) {
  state.explanationResult = null;
  state.explanationTemplateId = templateId;
  if (elements.explainStatus) {
    elements.explainStatus.textContent = '打开后可按需调用 AI。系统会结合当前模板标题、分类、标签和源码，自动识别算法并生成讲解。';
  }
  if (elements.explainResult) {
    elements.explainResult.classList.add('hidden');
  }
}

function renderTemplateExplanation() {
  if (!elements.toggleExplanation || !elements.explainBody || !elements.explainStatus || !elements.explainResult) {
    return;
  }

  elements.explainBody.classList.toggle('hidden', !state.explanationVisible);
  elements.toggleExplanation.textContent = state.explanationVisible ? '收起 AI 讲解' : '需要 AI 讲解';
  elements.toggleExplanation.classList.toggle('is-active', state.explanationVisible);

  const result = state.explanationResult;
  if (!result) {
    elements.explainResult.classList.add('hidden');
    if (state.explanationBusy) {
      elements.explainStatus.textContent = 'AI 正在讲解当前模板，请稍等。';
    }
    return;
  }

  elements.explainResult.classList.remove('hidden');
  elements.explainAlgorithmName.textContent = result.algorithmName || '未识别';
  elements.explainSummary.textContent = result.algorithmSummary || '模型未返回摘要';
  renderTagList(elements.explainCoreIdeas, result.coreIdeas || []);
  renderTagList(elements.explainWhenToUse, result.whenToUse || []);
  renderTagList(elements.explainIdentifySignals, result.identifySignals || []);
  renderTagList(elements.explainPitfalls, result.pitfalls || []);
  renderTagList(elements.explainReadingSteps, result.readingSteps || []);
}

function renderCodeClassificationResult() {
  if (!elements.classifyResults || !elements.classifyCount || !elements.classifySummary) {
    return;
  }

  const result = state.codeClassificationResult;
  if (!result) {
    elements.classifyCount.textContent = state.codeClassificationBusy ? '分类中' : '等待代码';
    elements.classifySummary.classList.add('hidden');
    elements.classifyResults.innerHTML = `
      <div class="recommend-empty">
        <h4>${state.codeClassificationBusy ? '模型正在读取代码' : '先提供模板代码'}</h4>
        <p>${state.codeClassificationBusy ? '系统正在结合模板库目录与代码结构进行分类，请稍等。' : '你可以直接粘贴代码，或上传一个 cpp 文件。系统会自动定位最接近的模板类别，并联动查询界面。'}</p>
      </div>
    `;
    return;
  }

  const matches = result.matches || [];
  elements.classifyCount.textContent = `${matches.length} 个候选`;
  elements.classifySummary.classList.remove('hidden');
  elements.classifyCategoryText.textContent = result.categoryText || '模型未返回分类';
  renderTagList(elements.classifySignals, result.signals || []);
  elements.classifyCautionText.textContent = result.caution || '无额外备注';
  elements.classifyResults.innerHTML = '';
  renderTemplateSaveSuggestion();

  if (matches.length === 0) {
    elements.classifyResults.innerHTML = `
      <div class="recommend-empty">
        <h4>没有匹配到明确模板</h4>
        <p>可以尝试提供更完整的模板代码，或改用更强的模型重新识别。</p>
      </div>
    `;
    return;
  }

  matches.forEach((item, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'recommend-item';
    card.innerHTML = `
      <div class="recommend-rank">TOP ${index + 1}</div>
      <div class="classify-result-main">
        <strong>${escapeForHtml(item.template.title)}</strong>
        <span>${escapeForHtml(item.template.layers.join(' / '))}</span>
        <small>${escapeForHtml(item.reason)}</small>
      </div>
    `;
    card.addEventListener('click', () => {
      state.activeCategory = item.template.layers[0] || '';
      state.selectedId = item.template.id;
      expandPathForTemplate(item.template);
      render();
    });
    elements.classifyResults.appendChild(card);
  });
}

async function analyzeTemplateCodeInput() {
  if (!elements.classifyCodeInput || !elements.classifyStatus) {
    return;
  }

  const code = elements.classifyCodeInput.value.trim();
  if (!code) {
    elements.classifyStatus.textContent = '请先粘贴代码或上传 cpp 文件';
    return;
  }

  const apiKey = getSharedAiApiKey();
  if (!apiKey) {
    elements.classifyStatus.textContent = '请先填写临时 API Key';
    return;
  }

  const { endpoint, model } = getStoredAiSettings();
  state.codeClassificationBusy = true;
  state.codeClassificationResult = null;
  elements.classifyStatus.textContent = 'AI 分类中';
  renderCodeClassificationResult();

  const catalog = library.templates.map(template => {
    return `${template.id} | ${template.title} | ${template.layers.join('/')} | 关键词:${(template.keywords || []).slice(0, 4).join('、')}`;
  }).join('\n');

  const systemPrompt = [
    '你是算法模板分类助手。',
    '你会读取一段 C++ 模板代码，并判断它最接近当前模板库中的哪个类别和哪个模板。',
    '候选模板 matches 必须只从给定模板目录清单中选择。',
    '如果当前模板库没有足够合适的目录，你可以额外提出新的保存目录建议，但 suggested_directory 必须位于 模板库 内。',
    '请优先给出适合作为模板文件名的精确名称，避免使用“新模板”“模板1”这类泛化命名。',
    '返回严格 JSON，不要使用 Markdown 代码块。',
    'JSON 格式如下：',
    '{',
    '  "matched_category": ["一级专题", "二级专题"],',
    '  "suggested_file_name": "建议保存的文件名，带或不带 .cpp 均可",',
    '  "suggested_directory": "建议保存目录，例如 模板库/图论/网络流",',
    '  "signals": ["识别信号1", "识别信号2"],',
    '  "matches": [',
    '    {"id": "模板id", "title": "模板标题", "reason": "匹配原因"}',
    '  ],',
    '  "caution": "补充说明"',
    '}',
    'matches 最多返回 3 个，id 和 title 必须来自目录清单。',
    '如果建议新目录，请保持目录名简洁、稳定，不要写成长句。',
  ].join('\n');

  const userPrompt = [
    '下面是本地模板目录清单，请只从中选择候选模板：',
    catalog,
    '下面是待识别的 C++ 模板代码：',
    code,
  ].join('\n\n');

  try {
    const payload = await callAiChatProxy({
      endpoint,
      model,
      apiKey,
      temperature: 0.2,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const messageContent = payload.choices?.[0]?.message?.content;
    const parsed = extractJsonFromResponse(messageContent);
    const matches = (Array.isArray(parsed.matches) ? parsed.matches : [])
      .map(item => {
        const template = findTemplateByCandidate(item);
        if (!template) {
          return null;
        }

        return {
          template,
          reason: item.reason || '模型未提供匹配原因',
        };
      })
      .filter(Boolean)
      .slice(0, 3);

    const category = Array.isArray(parsed.matched_category) ? parsed.matched_category.filter(Boolean) : [];
    state.codeClassificationResult = {
      categoryText: category.length > 0 ? category.join(' / ') : (matches[0]?.template.layers.join(' / ') || ''),
      suggestedFileName: sanitizeTemplateFileName(parsed.suggested_file_name || ''),
      suggestedDirectory: parsed.suggested_directory ? sanitizeTemplateDirectory(parsed.suggested_directory) : '',
      signals: Array.isArray(parsed.signals) ? parsed.signals : [],
      caution: parsed.caution || '',
      matches,
    };

    elements.classifyStatus.textContent = 'AI 分类完成';
    renderCodeClassificationResult();

    if (matches.length > 0) {
      state.activeCategory = matches[0].template.layers[0] || '';
      state.selectedId = matches[0].template.id;
      expandPathForTemplate(matches[0].template);
      render();
    } else if (category.length > 0) {
      state.activeCategory = category[0];
      expandAllBranches();
      render();
    }
  } catch (error) {
    state.codeClassificationResult = {
      categoryText: '本次分类未成功完成',
      suggestedFileName: '',
      suggestedDirectory: '',
      signals: [],
      caution: error instanceof Error ? error.message : '请检查接口配置、模型可用性和 API Key。',
      matches: [],
    };
    elements.classifyStatus.textContent = error instanceof Error ? error.message : 'AI 分类失败';
    renderCodeClassificationResult();
  } finally {
    state.codeClassificationBusy = false;
  }
}

async function explainCurrentTemplate() {
  const template = getSelectedTemplate();
  if (!template || !elements.explainStatus) {
    return;
  }

  const apiKey = getExplainApiKey();
  if (!apiKey) {
    state.explanationVisible = true;
    elements.explainStatus.textContent = '请先填写临时 API Key，再生成当前模板讲解。';
    renderTemplateExplanation();
    return;
  }

  const { endpoint, model } = getStoredAiSettings();
  state.explanationVisible = true;
  state.explanationBusy = true;
  state.explanationResult = null;
  state.explanationTemplateId = template.id;
  elements.explainStatus.textContent = 'AI 讲解生成中';
  renderTemplateExplanation();

  try {
    const payload = await callAiChatProxy({
      endpoint,
      model,
      apiKey,
      temperature: 0.2,
      messages: [
        { role: 'system', content: TEMPLATE_EXPLAIN_SYSTEM_PROMPT },
        { role: 'user', content: buildTemplateExplainUserPrompt(template) },
      ],
    });

    const messageContent = payload.choices?.[0]?.message?.content;
    const parsed = extractJsonFromResponse(messageContent);
    state.explanationResult = {
      algorithmName: parsed.algorithm_name || template.title,
      algorithmSummary: parsed.algorithm_summary || '模型未返回摘要',
      coreIdeas: Array.isArray(parsed.core_ideas) ? parsed.core_ideas : [],
      whenToUse: Array.isArray(parsed.when_to_use) ? parsed.when_to_use : [],
      identifySignals: Array.isArray(parsed.identify_signals) ? parsed.identify_signals : [],
      pitfalls: Array.isArray(parsed.pitfalls) ? parsed.pitfalls : [],
      readingSteps: Array.isArray(parsed.reading_steps) ? parsed.reading_steps : [],
    };
    elements.explainStatus.textContent = 'AI 讲解生成完成';
    renderTemplateExplanation();
  } catch (error) {
    state.explanationResult = null;
    elements.explainStatus.textContent = error instanceof Error ? error.message : 'AI 讲解生成失败';
    renderTemplateExplanation();
  } finally {
    state.explanationBusy = false;
  }
}

function renderAnalysisResult() {
  if (!hasAiPage || !elements.recommendResults || !elements.recommendCount || !elements.analysisSummary) {
    return;
  }

  const result = state.recommendationResult;

  if (!result) {
    elements.recommendCount.textContent = state.analysisBusy ? '分析中' : '等待图片';
    elements.analysisSummary.classList.add('hidden');
    elements.recommendResults.innerHTML = `
      <div class="recommend-empty">
        <h4>${state.analysisBusy ? '正在调用模型' : '先配置模型并上传图片'}</h4>
        <p>${state.analysisBusy ? '模型正在读取题目图片并分析题意，请稍等。' : '系统会把题目图片交给外部多模态模型分析，再从本地模板库中给出候选模板。'}</p>
      </div>
    `;
    return;
  }

  const candidates = result.candidates || [];
  elements.recommendCount.textContent = `${candidates.length} 个候选`;
  elements.analysisSummary.classList.remove('hidden');
  elements.analysisSummaryText.textContent = result.problemSummary || '模型未返回题意概括';
  renderTagList(elements.analysisSignals, result.extractedSignals || []);
  elements.analysisCautionText.textContent = result.caution || '无额外备注';
  elements.recommendResults.innerHTML = '';

  if (candidates.length === 0) {
    elements.recommendResults.innerHTML = `
      <div class="recommend-empty">
        <h4>模型未给出候选模板</h4>
        <p>可以尝试更换模型，或提供更清晰的题目图片。</p>
      </div>
    `;
    return;
  }

  candidates.forEach((item, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'recommend-item';
    card.innerHTML = `
      <div class="recommend-rank">TOP ${index + 1}</div>
      <div class="recommend-body">
        <div class="recommend-main">
          <strong>${escapeForHtml(item.template.title)}</strong>
          <span>${escapeForHtml(item.template.layers.join(' / '))}</span>
        </div>
        <div class="recommend-score">模型置信度 ${escapeForHtml(item.confidence)}</div>
        <div class="recommend-reasons">
          <span class="reason-pill">理由：${escapeForHtml(item.reason)}</span>
          <span class="reason-pill">来源：${escapeForHtml(item.sourceTitle)}</span>
        </div>
      </div>
    `;
    card.addEventListener('click', () => {
      state.selectedId = item.template.id;
      expandPathForTemplate(item.template);
      renderTree();
      renderDetail();
    });
    elements.recommendResults.appendChild(card);
  });
}

async function analyzeProblemImage() {
  if (!hasAiPage || !elements.aiEndpoint || !elements.aiModel || !elements.aiApiKey) {
    return;
  }

  const rawEndpoint = elements.aiEndpoint.value.trim();
  const endpoint = isValidAiEndpoint(rawEndpoint) ? rawEndpoint : DEFAULT_AI_ENDPOINT;
  const model = elements.aiModel.value.trim();
  const apiKey = elements.aiApiKey.value.trim();

  if (rawEndpoint !== endpoint) {
    elements.aiEndpoint.value = endpoint;
    localStorage.setItem('template-ai-endpoint', endpoint);
  }

  if (!endpoint || !model || !apiKey) {
    elements.recommendStatus.textContent = '请先填写接口地址、模型名称和 API Key';
    return;
  }

  if (!state.analysisImageDataUrl) {
    elements.recommendStatus.textContent = '请先上传题目图片';
    return;
  }

  persistAiSettings();
  state.analysisBusy = true;
  state.recommendationResult = null;
  elements.recommendStatus.textContent = '模型分析中';
  renderAnalysisResult();

  const templateCatalog = createTemplateCatalog();
  const extraPrompt = elements.aiExtraPrompt.value.trim();
  const systemPrompt = [
    '你是算法模板推荐助手。',
    '你必须先读取题目图片，理解题意和关键特征。',
    '然后只能从给定的模板目录清单中选择 1 到 5 个候选模板。',
    '请优先输出最匹配的模板，并说明原因。',
    '返回严格 JSON，不要使用 Markdown 代码块。',
    'JSON 格式如下：',
    '{',
    '  "problem_summary": "一句话概括题意",',
    '  "extracted_signals": ["信号1", "信号2"],',
    '  "candidate_templates": [',
    '    {"id": "模板id", "title": "模板标题", "reason": "推荐原因", "confidence": 0}',
    '  ],',
    '  "caution": "补充提醒"',
    '}',
    'candidate_templates 中的 id 和 title 必须来自目录清单。confidence 使用 0 到 100 的整数。',
  ].join('\n');

  const userText = [
    '下面是本地模板目录清单，请只从中选择候选模板：',
    templateCatalog,
    extraPrompt ? `额外要求：${extraPrompt}` : '',
  ].filter(Boolean).join('\n\n');

  try {
    const payload = await callAiChatProxy({
      endpoint,
      model,
      apiKey,
      temperature: 0.2,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: userText },
            { type: 'image_url', image_url: { url: state.analysisImageDataUrl } },
          ],
        },
      ],
    });

    const messageContent = payload.choices?.[0]?.message?.content;
    const parsed = extractJsonFromResponse(messageContent);
    const candidates = Array.isArray(parsed.candidate_templates) ? parsed.candidate_templates : [];
    const mappedCandidates = candidates
      .map(candidate => {
        const template = findTemplateByCandidate(candidate);
        if (!template) {
          return null;
        }

        return {
          template,
          sourceTitle: candidate.title || template.title,
          reason: candidate.reason || '模型未提供理由',
          confidence: candidate.confidence ?? '未知',
        };
      })
      .filter(Boolean)
      .slice(0, 5);

    state.recommendationResult = {
      problemSummary: parsed.problem_summary || '',
      extractedSignals: Array.isArray(parsed.extracted_signals) ? parsed.extracted_signals : [],
      caution: parsed.caution || '',
      candidates: mappedCandidates,
    };

    elements.recommendStatus.textContent = '模型分析完成';
    renderAnalysisResult();

    if (mappedCandidates.length > 0) {
      state.selectedId = mappedCandidates[0].template.id;
      expandPathForTemplate(mappedCandidates[0].template);
      renderTree();
      renderDetail();
    }
  } catch (error) {
    elements.recommendStatus.textContent = error instanceof Error ? error.message : '模型分析失败';
    state.recommendationResult = {
      problemSummary: '本次模型调用未成功完成。',
      extractedSignals: [],
      caution: error instanceof Error ? error.message : '请检查接口配置、模型是否支持图片输入，以及浏览器是否能直连该接口。',
      candidates: [],
    };
    renderAnalysisResult();
  } finally {
    state.analysisBusy = false;
  }
}

async function callAiChatProxy({ endpoint, model, apiKey, messages, temperature = 0.2 }) {
  const response = await fetch('/api/ai-chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint,
      model,
      apiKey,
      messages,
      temperature,
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || `接口调用失败：${response.status}`);
  }

  return payload;
}

function expandPathForTemplate(template) {
  state.expandedKeys.clear();
  let currentPath = '';
  template.layers.forEach(layer => {
    currentPath = currentPath ? `${currentPath}/${layer}` : layer;
    state.expandedKeys.add(currentPath);
  });
}

function renderRecommendations() {
  const query = state.recommendationQuery.trim();
  const recommendations = getRecommendations(query);

  if (!query) {
    elements.recommendCount.textContent = '等待输入';
    elements.recommendStatus.textContent = '纯规则匹配，不依赖 AI';
    elements.recommendResults.innerHTML = `
      <div class="recommend-empty">
        <h4>先输入题目特征</h4>
        <p>系统会根据关键词、识别信号、适用题型和分类标签，给出前几名候选模板。</p>
      </div>
    `;
    return;
  }

  if (recommendations.length === 0) {
    elements.recommendCount.textContent = '0 个结果';
    elements.recommendStatus.textContent = '未匹配到明显规则';
    elements.recommendResults.innerHTML = `
      <div class="recommend-empty">
        <h4>没有匹配结果</h4>
        <p>可以尝试补充更明确的题目特征，例如“最短路”“非负权”“区间修改”“树结构”“容量限制”等关键词。</p>
      </div>
    `;
    return;
  }

  elements.recommendCount.textContent = `${recommendations.length} 个候选`;
  elements.recommendStatus.textContent = '已根据题目特征完成规则匹配';
  elements.recommendResults.innerHTML = '';

  recommendations.forEach((item, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'recommend-item';
    card.innerHTML = `
      <div class="recommend-rank">TOP ${index + 1}</div>
      <div class="recommend-body">
        <div class="recommend-main">
          <strong>${item.template.title}</strong>
          <span>${item.template.layers.join(' / ')}</span>
        </div>
        <div class="recommend-score">匹配分 ${item.score.toFixed(1)}</div>
        <div class="recommend-reasons">
          ${item.matchedReasons.map(reason => `<span class="reason-pill">${reason.label}：${reason.text}</span>`).join('')}
        </div>
      </div>
    `;
    card.addEventListener('click', () => {
      state.selectedId = item.template.id;
      expandPathForTemplate(item.template);
      renderTree();
      renderDetail();
    });
    elements.recommendResults.appendChild(card);
  });
}

function renderTree() {
  const filteredTemplates = getFilteredTemplates();
  const tree = buildTree(filteredTemplates);
  elements.treeRoot.innerHTML = '';
  elements.resultCount.textContent = `当前显示 ${filteredTemplates.length} 个模板`;

  tree.forEach(node => {
    elements.treeRoot.appendChild(renderNode(node));
  });
}

function ensureValidSelection(filteredTemplates) {
  if (filteredTemplates.length === 0) {
    state.selectedId = null;
    return;
  }

  const existsInResults = filteredTemplates.some(template => template.id === state.selectedId);
  if (!existsInResults) {
    state.selectedId = filteredTemplates[0].id;
  }
}

function renderNode(node) {
  const wrapper = document.createElement('div');
  wrapper.className = 'tree-node';

  if (node.type === 'leaf') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tree-leaf';
    if (node.template.id === state.selectedId) {
      button.classList.add('active');
    }
    button.innerHTML = `<span>${node.template.title}</span><small>.cpp</small>`;
    button.addEventListener('click', () => {
      state.selectedId = node.template.id;
      renderDetail();
      renderTree();
    });
    wrapper.appendChild(button);
    return wrapper;
  }

  const header = document.createElement('button');
  header.type = 'button';
  header.className = 'tree-branch-header';
  if (state.expandedKeys.has(node.key)) {
    header.classList.add('active');
  }
  header.innerHTML = `<span>${node.name}</span><small>${countLeaves(node)} 个模板</small>`;
  header.addEventListener('click', () => {
    if (state.expandedKeys.has(node.key)) {
      state.expandedKeys.delete(node.key);
    } else {
      state.expandedKeys.add(node.key);
    }
    renderTree();
  });
  wrapper.appendChild(header);

  if (state.expandedKeys.has(node.key)) {
    const children = document.createElement('div');
    children.className = 'tree-node-children';
    node.children.forEach(child => {
      children.appendChild(renderNode(child));
    });
    wrapper.appendChild(children);
  }

  return wrapper;
}

function countLeaves(node) {
  if (node.type === 'leaf') {
    return 1;
  }

  return node.children.reduce((sum, child) => sum + countLeaves(child), 0);
}

function renderDetail() {
  const selected = library.templates.find(template => template.id === state.selectedId);

  if (!selected) {
    if (elements.deleteCurrentTemplate) {
      elements.deleteCurrentTemplate.disabled = true;
    }
    clearTemplateDeleteStatus();
    elements.emptyState.classList.remove('hidden');
    elements.detailPanel.classList.add('hidden');
    return;
  }

  pushRecentTemplate(selected.id);
  elements.emptyState.classList.add('hidden');
  elements.detailPanel.classList.remove('hidden');
  elements.detailBreadcrumb.textContent = selected.layers.join(' / ');
  elements.detailTitle.textContent = selected.title;
  elements.detailTag.textContent = selected.fileName;
  if (elements.templateActionStatus) {
    const message = state.templateActionStatusMessage || '';
    elements.templateActionStatus.textContent = message;
    elements.templateActionStatus.classList.toggle('hidden', !message);
  }
  if (elements.deleteCurrentTemplate) {
    elements.deleteCurrentTemplate.disabled = false;
  }
  if (elements.toggleFavorite) {
    const isFavorite = isFavoriteTemplate(selected.id);
    elements.toggleFavorite.textContent = isFavorite ? '取消收藏' : '加入收藏';
    elements.toggleFavorite.classList.toggle('is-favorite', isFavorite);
  }
  elements.detailDifficulty.textContent = selected.difficulty || '未标注';
  elements.detailLayers.textContent = selected.layers.join(' -> ');
  elements.detailPath.textContent = selected.relativePath;
  elements.detailNote.textContent = selected.note;
  renderTagList(elements.detailKeywords, selected.keywords || []);
  renderTagList(elements.detailScenarios, selected.scenarios || []);
  renderTagList(elements.detailSignals, selected.signals || []);
  renderTagList(elements.detailRisks, selected.risks || []);
  if (state.explanationTemplateId !== selected.id) {
    resetTemplateExplanation(selected.id);
  }
  const codeLineCount = countCodeLines(selected.code);
  elements.codeMeta.textContent = `${codeLineCount} 行`;
  if (codeLineCount <= COLLAPSE_LINE_THRESHOLD) {
    state.collapseCode = false;
  }
  elements.detailCode.innerHTML = renderHighlightedCode(selected.code);
  renderCodeBlockState(codeLineCount);
}

function renderTagList(container, values) {
  container.innerHTML = '';

  values.forEach(value => {
    const tag = document.createElement('span');
    tag.className = 'tag-item';
    tag.textContent = value;
    container.appendChild(tag);
  });
}

function expandAllBranches() {
  const filteredTemplates = getFilteredTemplates();
  const tree = buildTree(filteredTemplates);
  state.expandedKeys.clear();

  const stack = [...tree];
  while (stack.length > 0) {
    const node = stack.pop();
    if (node.type === 'branch') {
      state.expandedKeys.add(node.key);
      stack.push(...node.children);
    }
  }
}

function countCodeLines(code) {
  return normalizeCodeLineEndings(code).split('\n').length;
}

function normalizeCodeLineEndings(code) {
  return String(code || '').replace(/\r\n?/g, '\n');
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const CPP_TOKEN_PATTERN = /(^\s*#.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\/\*[\s\S]*?\*\/)|(\/\/.*$)/gm;

function storeTokenHtml(tokenStore, html) {
  const token = `__TOKEN_${tokenStore.length}__`;
  tokenStore.push({ token, html });
  return token;
}

function preserveCppTokens(source) {
  const tokenStore = [];

  const text = source.replace(CPP_TOKEN_PATTERN, (match, preprocessor, stringLiteral, blockComment, lineComment) => {
    const className = preprocessor
      ? 'preprocessor'
      : classNameForToken(stringLiteral || blockComment || lineComment || match, 'comment');

    return match
      .split('\n')
      .map(line => storeTokenHtml(tokenStore, `<span class="token ${className}">${escapeHtml(line)}</span>`))
      .join('\n');
  });

  return { text, tokenStore };
}

function classNameForToken(match, fallback) {
  if (match.startsWith('//') || match.startsWith('/*')) {
    return 'comment';
  }

  if (match.startsWith('"') || match.startsWith("'")) {
    return 'string';
  }

  return fallback;
}

function highlightCpp(code) {
  const { text, tokenStore } = preserveCppTokens(code);
  const escaped = escapeHtml(text);
  const segments = escaped.split(/(__TOKEN_\d+__)/g);

  return segments
    .map(segment => {
      const tokenEntry = tokenStore.find(entry => entry.token === segment);
      if (tokenEntry) {
        return tokenEntry.html;
      }

      return highlightPlainSegment(segment);
    })
    .join('');
}

function highlightPlainSegment(segment) {
  return segment.replace(/0x[\da-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[A-Za-z_]\w*/g, (match, offset, source) => {
    if (/^(0x[\da-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)$/.test(match)) {
      return `<span class="token number">${match}</span>`;
    }

    if (CPP_KEYWORDS.has(match)) {
      return `<span class="token keyword">${match}</span>`;
    }

    if (CPP_TYPES.has(match)) {
      return `<span class="token type">${match}</span>`;
    }

    const trailing = source.slice(offset + match.length);
    if (/^\s*\(/.test(trailing)) {
      return `<span class="token function">${match}</span>`;
    }

    return match;
  });
}

function renderHighlightedCode(code) {
  const highlighted = highlightCpp(normalizeCodeLineEndings(code));
  return highlighted
    .split('\n')
    .map((line, index) => {
      const content = line.length > 0 ? line : '&nbsp;';
      return `<span class="code-line"><span class="line-number">${index + 1}</span><span class="line-content">${content}</span></span>`;
    })
    .join('');
}

function renderCodeBlockState(codeLineCount) {
  elements.codeBlock.classList.toggle('is-wrapped', state.wrapCode);

  const shouldCollapse = state.collapseCode && codeLineCount > COLLAPSE_LINE_THRESHOLD;
  elements.codeBlock.classList.toggle('is-collapsed', shouldCollapse);

  elements.toggleWrap.textContent = state.wrapCode ? '关闭换行' : '自动换行';
  elements.toggleWrap.classList.toggle('is-active', state.wrapCode);

  const canCollapse = codeLineCount > COLLAPSE_LINE_THRESHOLD;
  elements.toggleCollapse.disabled = !canCollapse;
  elements.toggleCollapse.textContent = canCollapse
    ? (shouldCollapse ? '展开全部' : '折叠长代码')
    : '无需折叠';
  elements.toggleCollapse.classList.toggle('is-active', !shouldCollapse && canCollapse);

  if (!canCollapse) {
    elements.codeStatus.textContent = '完整展示';
    return;
  }

  elements.codeStatus.textContent = shouldCollapse
    ? `已折叠到前 ${COLLAPSE_LINE_THRESHOLD} 行`
    : '完整展示';
}

function getSelectedTemplate() {
  return library.templates.find(template => template.id === state.selectedId) || null;
}

function render() {
  const filteredTemplates = getFilteredTemplates();
  ensureValidSelection(filteredTemplates);
  renderQuickFilters();
  renderSummary();
  renderRecentTemplates();
  renderFavoriteTemplates();
  renderTemplateSaveSuggestion();
  renderCodeClassificationResult();
  renderTree();
  if (hasAiPage) {
    renderAnalysisResult();
  }
  renderDetail();
}

if (elements.keyword) {
  elements.keyword.addEventListener('input', event => {
    state.keyword = event.target.value;
    expandAllBranches();
    render();
  });
}

if (elements.clearSearch) {
  elements.clearSearch.addEventListener('click', () => {
    state.keyword = '';
    elements.keyword.value = '';
    expandAllBranches();
    render();
  });
}

if (elements.clearCategoryFilter) {
  elements.clearCategoryFilter.addEventListener('click', () => {
    state.activeCategory = '';
    expandAllBranches();
    render();
  });
}

if (elements.clearRecent) {
  elements.clearRecent.addEventListener('click', () => {
    state.recentTemplateIds = [];
    persistRecentTemplateIds();
    renderRecentTemplates();
  });
}

if (elements.clearFavorites) {
  elements.clearFavorites.addEventListener('click', () => {
    state.favoriteTemplateIds = [];
    persistFavoriteTemplateIds();
    renderFavoriteTemplates();
    renderDetail();
  });
}

if (hasAiPage && elements.aiEndpoint && elements.aiModel && elements.aiExtraPrompt) {
  // 清理可能存有的无效端点
  const rawStored = localStorage.getItem('template-ai-endpoint') || '';
  if (rawStored && !isValidAiEndpoint(rawStored)) {
    localStorage.setItem('template-ai-endpoint', DEFAULT_AI_ENDPOINT);
  }

  const storedAiSettings = getStoredAiSettings();
  elements.aiEndpoint.value = storedAiSettings.endpoint;
  elements.aiModel.value = storedAiSettings.model;
  elements.aiExtraPrompt.value = storedAiSettings.extraPrompt;
}

if (elements.explainApiKey) {
  elements.explainApiKey.value = getSessionAiApiKey();
  elements.explainApiKey.addEventListener('input', event => {
    persistSessionAiApiKey(event.target.value);
    if (elements.classifyApiKey && elements.classifyApiKey.value !== event.target.value) {
      elements.classifyApiKey.value = event.target.value;
    }
  });
}

if (elements.classifyApiKey) {
  elements.classifyApiKey.value = getSessionAiApiKey();
  elements.classifyApiKey.addEventListener('input', event => {
    persistSessionAiApiKey(event.target.value);
    if (elements.explainApiKey && elements.explainApiKey.value !== event.target.value) {
      elements.explainApiKey.value = event.target.value;
    }
  });
}

if (elements.classifyCodeFile && elements.classifyCodeInput) {
  elements.classifyCodeFile.addEventListener('change', async event => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      elements.classifyCodeInput.value = await readFileAsText(file);
      if (elements.classifyStatus) {
        elements.classifyStatus.textContent = `${file.name} 已载入，请点击“智能分类”`;
      }
    } catch (error) {
      if (elements.classifyStatus) {
        elements.classifyStatus.textContent = error instanceof Error ? error.message : '读取代码文件失败';
      }
    }
  });
}

if (elements.classifyCodeInput) {
  elements.classifyCodeInput.addEventListener('input', event => {
    const value = event.target.value.trim();
    if (!value) {
      setCodeClassificationIdleState('等待输入代码');
      return;
    }

    if (!state.codeClassificationBusy) {
      setCodeClassificationIdleState('代码已更新，请点击“智能分类”');
    }
  });

  elements.classifyCodeInput.addEventListener('paste', () => {
    window.setTimeout(() => {
      const value = elements.classifyCodeInput.value.trim();
      if (!value) {
        return;
      }

      setCodeClassificationIdleState('代码已粘贴，请点击“智能分类”');
    }, 0);
  });
}

if (hasAiPage && elements.problemImage) {
  elements.problemImage.addEventListener('change', async event => {
    const file = event.target.files?.[0];
    await applyAnalysisImageFile(file, '图片');
  });
}

if (elements.toggleExplanation) {
  elements.toggleExplanation.addEventListener('click', () => {
    state.explanationVisible = !state.explanationVisible;
    renderTemplateExplanation();
  });
}

if (elements.runExplanation) {
  elements.runExplanation.addEventListener('click', () => {
    explainCurrentTemplate();
  });
}

if (elements.runCodeClassify) {
  elements.runCodeClassify.addEventListener('click', () => {
    analyzeTemplateCodeInput();
  });
}

if (elements.clearCodeClassify) {
  elements.clearCodeClassify.addEventListener('click', () => {
    if (elements.classifyCodeInput) {
      elements.classifyCodeInput.value = '';
    }
    if (elements.classifyCodeFile) {
      elements.classifyCodeFile.value = '';
    }
    if (elements.saveTemplateName) {
      elements.saveTemplateName.value = '';
    }
    state.saveTemplateNameTouched = false;
    state.saveTemplateDirectory = '';
    state.saveTemplateDirectoryTouched = false;
    setCodeClassificationIdleState('等待输入代码');
  });
}

if (elements.saveTemplateName) {
  elements.saveTemplateName.addEventListener('input', event => {
    state.saveTemplateNameTouched = Boolean(event.target.value.trim());
    renderTemplateSaveSuggestion();
  });
}

if (elements.saveTemplatePath) {
  elements.saveTemplatePath.addEventListener('input', event => {
    state.saveTemplateDirectory = sanitizeTemplateDirectory(event.target.value);
    state.saveTemplateDirectoryTouched = true;
    renderTemplateSaveSuggestion();
  });
}

if (elements.saveTemplateAiMetadata) {
  elements.saveTemplateAiMetadata.addEventListener('change', () => {
    renderTemplateSaveSuggestion();
  });
}

if (elements.saveCurrentTemplate) {
  elements.saveCurrentTemplate.addEventListener('click', () => {
    saveCurrentTemplateToLibrary();
  });
}

if (elements.deleteCurrentTemplate) {
  elements.deleteCurrentTemplate.addEventListener('click', () => {
    deleteCurrentTemplateFromLibrary();
  });
}

if (elements.toggleFavorite) {
  elements.toggleFavorite.addEventListener('click', () => {
    const selected = getSelectedTemplate();
    if (!selected) {
      return;
    }

    toggleFavoriteTemplate(selected.id);
    renderFavoriteTemplates();
    renderDetail();
  });
}

if (hasAiPage && elements.pasteTarget) {
  elements.pasteTarget.addEventListener('click', () => {
    elements.pasteTarget.focus();
  });

  elements.pasteTarget.addEventListener('paste', async event => {
    await handleImagePaste(event, '剪贴板图片');
  });

  document.addEventListener('paste', async event => {
    if (event.defaultPrevented) {
      return;
    }

    const pasted = await handleImagePaste(event, '剪贴板图片');
    if (!pasted) {
      return;
    }

    if (!isEditableTarget(event.target) && elements.pasteTarget) {
      elements.pasteTarget.focus();
    }
  });
}

if (hasAiPage && elements.runRecommendation) {
  elements.runRecommendation.addEventListener('click', () => {
    analyzeProblemImage();
  });
}

if (hasAiPage && document.querySelector('#reset-ai-endpoint')) {
  document.querySelector('#reset-ai-endpoint').addEventListener('click', () => {
    elements.aiEndpoint.value = DEFAULT_AI_ENDPOINT;
    localStorage.setItem('template-ai-endpoint', DEFAULT_AI_ENDPOINT);
    elements.recommendStatus.textContent = '接口地址已设为默认值';
  });
}

if (hasAiPage && document.querySelector('#reset-ai-model')) {
  document.querySelector('#reset-ai-model').addEventListener('click', () => {
    elements.aiModel.value = DEFAULT_AI_MODEL;
    localStorage.setItem('template-ai-model', DEFAULT_AI_MODEL);
    elements.recommendStatus.textContent = '模型已设为默认值';
  });
}

if (hasAiPage && elements.clearRecommendation) {
  elements.clearRecommendation.addEventListener('click', () => {
    state.recommendationResult = null;
    clearAnalysisImage();
    elements.aiExtraPrompt.value = DEFAULT_AI_EXTRA_PROMPT;
    elements.recommendStatus.textContent = '等待模型配置';
    renderAnalysisResult();
  });
}

if (elements.resetView) {
  elements.resetView.addEventListener('click', () => {
    state.keyword = '';
    state.activeCategory = '';
    state.selectedId = null;
    state.expandedKeys.clear();
    elements.keyword.value = '';
    render();
  });
}

if (elements.expandAll) {
  elements.expandAll.addEventListener('click', () => {
    expandAllBranches();
    renderTree();
  });
}

if (elements.toggleWrap) {
  elements.toggleWrap.addEventListener('click', () => {
    state.wrapCode = !state.wrapCode;
    const selected = getSelectedTemplate();
    if (!selected) {
      return;
    }

    renderCodeBlockState(countCodeLines(selected.code));
  });
}

if (elements.toggleCollapse) {
  elements.toggleCollapse.addEventListener('click', () => {
    const selected = getSelectedTemplate();
    if (!selected) {
      return;
    }

    const lineCount = countCodeLines(selected.code);
    if (lineCount <= COLLAPSE_LINE_THRESHOLD) {
      return;
    }

    state.collapseCode = !state.collapseCode;
    renderCodeBlockState(lineCount);
  });
}

if (elements.copyCode) {
  elements.copyCode.addEventListener('click', async () => {
    const selected = getSelectedTemplate();
    if (!selected) {
      return;
    }

    try {
      await navigator.clipboard.writeText(selected.code);
      elements.copyCode.textContent = '复制成功';
      elements.copyCode.classList.add('is-success');
      elements.codeStatus.textContent = '源码已复制到剪贴板';
      window.setTimeout(() => {
        elements.copyCode.textContent = '复制代码';
        elements.copyCode.classList.remove('is-success');
        renderCodeBlockState(countCodeLines(selected.code));
      }, 1200);
    } catch (error) {
      elements.copyCode.textContent = '复制失败';
      elements.copyCode.classList.add('is-danger');
      elements.codeStatus.textContent = '浏览器未允许写入剪贴板';
      window.setTimeout(() => {
        elements.copyCode.textContent = '复制代码';
        elements.copyCode.classList.remove('is-danger');
        renderCodeBlockState(countCodeLines(selected.code));
      }, 1200);
    }
  });
}

state.recentTemplateIds = getStoredRecentTemplateIds();
state.favoriteTemplateIds = getStoredFavoriteTemplateIds();

render();
renderTemplateExplanation();