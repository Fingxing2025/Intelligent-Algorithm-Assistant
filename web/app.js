const library = window.TEMPLATE_LIBRARY || { templates: [], summary: {} };
const pageType = document.body?.dataset?.page || 'library';
const hasAiPage = pageType === 'ai-analysis';

const DEFAULT_AI_ENDPOINT = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const DEFAULT_AI_MODEL = 'qwen3-vl-flash';
const DEFAULT_AI_EXTRA_PROMPT = '先提取题型和关键信号，再从本地模板库中选最相关的 3 个候选模板，说明依据并补 1 条误判风险；不要输出题解，严格返回 JSON。';
const AI_API_KEY_SESSION_KEY = 'template-ai-api-key';
const RECENT_TEMPLATES_STORAGE_KEY = 'template-recent-views';
const FAVORITE_TEMPLATES_STORAGE_KEY = 'template-favorite-views';
const ANALYSIS_HISTORY_STORAGE_KEY = 'template-analysis-history';
const MAX_RECENT_TEMPLATES = 6;
const MAX_FAVORITE_TEMPLATES = 12;
const MAX_ANALYSIS_HISTORY = 50;
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
  // 新功能：用户模板选择、分析历史与诊断
  userChoiceValidation: null,
  analysisHistory: [],
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
  // 用户模板选择与诊断
  userTemplateChoice: document.querySelector('#user-template-choice'),
  templateAutocomplete: document.querySelector('#template-autocomplete'),
  runDiagnosis: document.querySelector('#run-diagnosis'),
  clearDiagnosis: document.querySelector('#clear-diagnosis'),
  diagnosisStatus: document.querySelector('#diagnosis-status'),
  diagnosisSummary: document.querySelector('#diagnosis-summary'),
  diagnosisEmpty: document.querySelector('#diagnosis-empty'),
  diagTotalAttempts: document.querySelector('#diag-total-attempts'),
  diagCorrectRate: document.querySelector('#diag-correct-rate'),
  diagStrongCategories: document.querySelector('#diag-strong-categories'),
  diagWeakCategories: document.querySelector('#diag-weak-categories'),
  diagnosisCategories: document.querySelector('#diagnosis-categories'),
  diagnosisHistory: document.querySelector('#diagnosis-history'),
  diagnosisAiReportShell: document.querySelector('#diagnosis-ai-report-shell'),
  diagnosisAiReportStatus: document.querySelector('#diagnosis-ai-report-status'),
  diagnosisAiReportContent: document.querySelector('#diagnosis-ai-report-content'),
  regenerateDiagnosis: document.querySelector('#regenerate-diagnosis'),
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
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>');
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

// ========== 分析历史存储 ==========

function getStoredAnalysisHistory() {
  try {
    const raw = localStorage.getItem(ANALYSIS_HISTORY_STORAGE_KEY);
    const parsed = JSON.parse(raw || '[]');
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.slice(0, MAX_ANALYSIS_HISTORY);
  } catch (error) {
    return [];
  }
}

function persistAnalysisHistory() {
  const trimmed = state.analysisHistory.slice(0, MAX_ANALYSIS_HISTORY);
  localStorage.setItem(ANALYSIS_HISTORY_STORAGE_KEY, JSON.stringify(trimmed));
}

function addAnalysisHistoryRecord(record) {
  state.analysisHistory = [record, ...state.analysisHistory].slice(0, MAX_ANALYSIS_HISTORY);
  persistAnalysisHistory();
}

function clearAllAnalysisHistory() {
  state.analysisHistory = [];
  localStorage.removeItem(ANALYSIS_HISTORY_STORAGE_KEY);
}

// ========== 自动补全 ==========

function renderAutocomplete(query) {
  if (!elements.templateAutocomplete) {
    return;
  }

  const normalizedQuery = String(query || '').trim().toLowerCase();
  if (!normalizedQuery) {
    elements.templateAutocomplete.classList.add('hidden');
    elements.templateAutocomplete.innerHTML = '';
    return;
  }

  const matches = library.templates
    .filter(template => {
      const haystack = [template.title, ...template.layers, ...(template.keywords || [])]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    })
    .slice(0, 8);

  if (matches.length === 0) {
    elements.templateAutocomplete.classList.add('hidden');
    elements.templateAutocomplete.innerHTML = '';
    return;
  }

  elements.templateAutocomplete.innerHTML = '';
  matches.forEach(template => {
    const item = document.createElement('div');
    item.className = 'autocomplete-item';
    item.innerHTML = `<strong>${escapeForHtml(template.title)}</strong><span>${escapeForHtml(template.layers.join(' / '))}</span>`;
    item.addEventListener('mousedown', event => {
      event.preventDefault();
      if (elements.userTemplateChoice) {
        elements.userTemplateChoice.value = template.title;
      }
      elements.templateAutocomplete.classList.add('hidden');
    });
    elements.templateAutocomplete.appendChild(item);
  });
  elements.templateAutocomplete.classList.remove('hidden');
}

// ========== 学习诊断 ==========

function analyzeMastery() {
  const history = state.analysisHistory;
  if (!Array.isArray(history) || history.length === 0) {
    return {
      totalAttempts: 0,
      correctCount: 0,
      correctRate: 0,
      categoryStats: {},
      recentHistory: [],
    };
  }

  let correctCount = 0;
  const categoryStats = {};

  history.forEach(record => {
    if (record.isCorrect) {
      correctCount += 1;
    }

    const category = record.aiTopCategory || '未分类';
    if (!categoryStats[category]) {
      categoryStats[category] = { total: 0, correct: 0 };
    }
    categoryStats[category].total += 1;
    if (record.isCorrect) {
      categoryStats[category].correct += 1;
    }
  });

  const totalAttempts = history.length;
  const correctRate = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

  return {
    totalAttempts,
    correctCount,
    correctRate,
    categoryStats,
    recentHistory: history.slice(0, 10),
  };
}

function renderDiagnosis() {
  if (!hasAiPage) {
    return;
  }

  const diagnosis = analyzeMastery();

  if (diagnosis.totalAttempts === 0) {
    if (elements.diagnosisSummary) elements.diagnosisSummary.classList.add('hidden');
    if (elements.diagnosisEmpty) elements.diagnosisEmpty.classList.remove('hidden');
    if (elements.diagnosisStatus) elements.diagnosisStatus.textContent = '暂无历史记录';
    return;
  }

  if (elements.diagnosisEmpty) elements.diagnosisEmpty.classList.add('hidden');
  if (elements.diagnosisSummary) elements.diagnosisSummary.classList.remove('hidden');

  if (elements.diagTotalAttempts) elements.diagTotalAttempts.textContent = diagnosis.totalAttempts;
  if (elements.diagCorrectRate) elements.diagCorrectRate.textContent = `${diagnosis.correctRate}%`;

  const categories = Object.entries(diagnosis.categoryStats).sort((a, b) => {
    const rateA = a[1].total > 0 ? a[1].correct / a[1].total : 0;
    const rateB = b[1].total > 0 ? b[1].correct / b[1].total : 0;
    return rateA - rateB;
  });

  const strongCount = categories.filter(([, s]) => s.total > 0 && s.correct / s.total >= 0.7).length;
  const weakCount = categories.filter(([, s]) => s.total > 0 && s.correct / s.total < 0.5).length;

  if (elements.diagStrongCategories) elements.diagStrongCategories.textContent = strongCount;
  if (elements.diagWeakCategories) elements.diagWeakCategories.textContent = weakCount;

  if (elements.diagnosisStatus) {
    if (diagnosis.correctRate >= 80) {
      elements.diagnosisStatus.textContent = '掌握良好，继续保持！';
    } else if (diagnosis.correctRate >= 50) {
      elements.diagnosisStatus.textContent = '部分专题需要加强练习';
    } else {
      elements.diagnosisStatus.textContent = '建议系统性地回顾薄弱专题';
    }
  }

  // 渲染各专题掌握情况
  if (elements.diagnosisCategories) {
    elements.diagnosisCategories.innerHTML = '';
    if (categories.length === 0) {
      elements.diagnosisCategories.innerHTML = '<p class="helper">暂无足够数据按专题分析。</p>';
    } else {
      categories.forEach(([category, stats]) => {
        const rate = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
        let level = 'weak';
        if (rate >= 80) level = 'strong';
        else if (rate >= 60) level = 'moderate';

        const card = document.createElement('div');
        card.className = 'diagnosis-category-card';
        card.innerHTML = `
          <div class="diag-category-header">
            <strong>${escapeForHtml(category)}</strong>
            <span class="diag-category-rate diag-${level}">${rate}%</span>
          </div>
          <div class="diag-category-bar"><div class="diag-category-fill diag-${level}" style="width:${rate}%"></div></div>
          <small>${stats.correct}/${stats.total} 次选择正确</small>
        `;
        elements.diagnosisCategories.appendChild(card);
      });
    }
  }

  // 渲染历史记录
  if (elements.diagnosisHistory) {
    elements.diagnosisHistory.innerHTML = '';
    if (diagnosis.recentHistory.length === 0) {
      elements.diagnosisHistory.innerHTML = '<p class="helper">暂无分析记录。</p>';
    } else {
      const list = document.createElement('div');
      list.className = 'diagnosis-history-list';
      diagnosis.recentHistory.forEach(record => {
        const item = document.createElement('div');
        item.className = `diagnosis-history-item ${record.isCorrect ? 'is-correct' : 'is-wrong'}`;
        item.innerHTML = `
          <div class="diag-history-status">${record.isCorrect ? '✓ 正确' : '✗ 错误'}</div>
          <div class="diag-history-body">
            <span>题目：${escapeForHtml(record.problemSummary || '无概括')}</span>
            <span>你选了：<strong>${escapeForHtml(record.userChoice || '未选')}</strong></span>
            <span>AI推荐：<strong>${escapeForHtml(record.aiTopTitle || '未知')}</strong></span>
          </div>
          <small>${escapeForHtml(record.timestamp || '')}</small>
        `;
        list.appendChild(item);
      });
      elements.diagnosisHistory.appendChild(list);
    }
  }
}

// ========== 修改后的 analyzeProblemImage ==========

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

  // 获取用户选择的模板名称
  const userChoiceText = (elements.userTemplateChoice?.value || '').trim();
  state.userChoiceValidation = null;

  persistAiSettings();
  state.analysisBusy = true;
  state.recommendationResult = null;
  elements.recommendStatus.textContent = '模型分析中';
  renderAnalysisResult();

  const templateCatalog = createTemplateCatalog();
  const extraPrompt = elements.aiExtraPrompt.value.trim();

  // 构建历史反馈上下文
  const history = analyzeMastery();
  let historyContext = '';
  if (history.totalAttempts > 0) {
    const weakCategories = Object.entries(history.categoryStats)
      .filter(([, s]) => s.total > 0 && s.correct / s.total < 0.5)
      .map(([cat, s]) => `${cat}（${s.correct}/${s.total} 正确）`)
      .join('、');

    const recentMistakes = history.recentHistory
      .filter(r => !r.isCorrect)
      .slice(0, 3)
      .map(r => `题目"${r.problemSummary}"选了"${r.userChoice}"但实际应选"${r.aiTopTitle}"`)
      .join('；');

    historyContext = [
      '=== 用户历史学习数据 ===',
      `累计分析 ${history.totalAttempts} 次，正确率 ${history.correctRate}%。`,
      weakCategories ? `薄弱专题：${weakCategories}。` : '',
      recentMistakes ? `近期错误记录：${recentMistakes}。` : '',
      '请在分析时参考以上历史数据：如果用户在当前题目中可能重复之前的错误模式，请明确提醒；',
      '如果用户这次的选择体现了进步或退步趋势，请指出。',
    ].filter(Boolean).join('\n');
  }

  // 构建包含用户选择分析的新 prompt
  const userChoicePrompt = userChoiceText
    ? `用户认为这道题应该使用模板："${userChoiceText}"。请在分析结果中加入对用户选择的评估：\n` +
      `1. user_choice_correct: 判断用户选择是否合理(true/false)\n` +
      `2. user_choice_analysis: 分析用户选择正确或错误的原因，并结合用户历史学习数据给出个性化建议\n` +
      `3. 如果选择错误，指出用户可能混淆的概念`
    : '';

  const systemPrompt = [
    '你是算法模板推荐与诊断助手。',
    historyContext,
    '你必须先读取题目图片，理解题意和关键特征。',
    '然后只能从给定的模板目录清单中选择 1 到 5 个候选模板。',
    '请优先输出最匹配的模板，并说明原因。',
    userChoicePrompt,
    '返回严格 JSON，不要使用 Markdown 代码块。',
    'JSON 格式如下：',
    '{',
    '  "problem_summary": "一句话概括题意",',
    '  "extracted_signals": ["信号1", "信号2"],',
    '  "candidate_templates": [',
    '    {"id": "模板id", "title": "模板标题", "reason": "推荐原因", "confidence": 0}',
    '  ],',
    '  "caution": "补充提醒",',
    userChoiceText ? '  "user_choice_correct": true,' : '',
    userChoiceText ? '  "user_choice_analysis": "对用户选择的评估"' : '',
    '}',
    'candidate_templates 中的 id 和 title 必须来自目录清单。confidence 使用 0 到 100 的整数。',
  ].filter(Boolean).join('\n');

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

    // 处理用户选择验证
    if (userChoiceText && parsed.hasOwnProperty('user_choice_correct')) {
      const topTemplate = mappedCandidates[0]?.template || null;
      const isCorrect = Boolean(parsed.user_choice_correct);
      const analysis = parsed.user_choice_analysis || '';

      // 存入历史记录
      addAnalysisHistoryRecord({
        timestamp: new Date().toLocaleString('zh-CN'),
        problemSummary: parsed.problem_summary || '题目',
        userChoice: userChoiceText,
        aiTopId: topTemplate?.id || '',
        aiTopTitle: topTemplate?.title || '未知',
        aiTopCategory: topTemplate?.layers?.[0] || '未分类',
        isCorrect,
        analysis,
      });

      // 更新结果中的用户反馈
      state.recommendationResult.userChoiceValidation = {
        userChoice: userChoiceText,
        isCorrect,
        analysis,
      };

      if (elements.diagnosisStatus) {
        elements.diagnosisStatus.textContent = isCorrect
          ? `✅ 你的选择正确！${analysis ? ' ' + truncateText(analysis, 60) : ''}`
          : `❌ 选择有偏差。${analysis ? ' ' + truncateText(analysis, 60) : ''}`;
      }
    }

    elements.recommendStatus.textContent = '模型分析完成';
    renderAnalysisResult();
    renderDiagnosis();

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

// ========== 现有函数，保持原样 ==========

function callAiChatProxy({ endpoint, model, apiKey, messages, temperature = 0.2 }) {
  return fetch('/api/ai-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint, model, apiKey, messages, temperature }),
  }).then(async response => {
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || `接口调用失败：${response.status}`);
    }
    return payload;
  });
}

function pushRecentTemplate(templateId) {
  if (!templateId) return;
  state.recentTemplateIds = [templateId, ...state.recentTemplateIds.filter(id => id !== templateId)].slice(0, MAX_RECENT_TEMPLATES);
  persistRecentTemplateIds();
}

function isFavoriteTemplate(templateId) {
  return state.favoriteTemplateIds.includes(templateId);
}

function toggleFavoriteTemplate(templateId) {
  if (!templateId) return;
  if (isFavoriteTemplate(templateId)) {
    state.favoriteTemplateIds = state.favoriteTemplateIds.filter(id => id !== templateId);
  } else {
    state.favoriteTemplateIds = [templateId, ...state.favoriteTemplateIds.filter(id => id !== templateId)].slice(0, MAX_FAVORITE_TEMPLATES);
  }
  persistFavoriteTemplateIds();
}

function removeTemplateFromCollections(templateId) {
  if (!templateId) return;
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
  if (!target) return;
  target.textContent = message;
  target.classList.remove('hidden');
}

function clearTemplateDeleteStatus() {
  if (!elements.templateActionStatus) return;
  elements.templateActionStatus.textContent = '';
  elements.templateActionStatus.classList.add('hidden');
}

function ensureActionToastElement() {
  let toast = document.querySelector('#action-toast');
  if (toast) return toast;
  toast = document.createElement('div');
  toast.id = 'action-toast';
  toast.className = 'action-toast hidden';
  document.body.appendChild(toast);
  return toast;
}

function showActionToast(message) {
  const normalizedMessage = String(message || '').trim();
  if (!normalizedMessage) return;
  const toast = ensureActionToastElement();
  toast.textContent = normalizedMessage;
  toast.classList.remove('hidden');
  toast.classList.add('is-visible');
  if (actionToastTimer) window.clearTimeout(actionToastTimer);
  actionToastTimer = window.setTimeout(() => {
    toast.classList.remove('is-visible');
    toast.classList.add('hidden');
  }, 2400);
}

function renderRecentTemplates() {
  if (!elements.recentRoot) return;
  elements.recentRoot.innerHTML = '';
  const recentTemplates = state.recentTemplateIds.map(id => library.templates.find(t => t.id === id)).filter(Boolean);
  if (recentTemplates.length === 0) {
    elements.recentRoot.innerHTML = '<div class="recent-empty"><p>选中过的模板会出现在这里，方便快速回看。</p></div>';
    return;
  }
  recentTemplates.forEach(template => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'recent-item';
    if (template.id === state.selectedId) button.classList.add('active');
    button.innerHTML = `<strong>${escapeForHtml(template.title)}</strong><span>${escapeForHtml(template.layers.join(' / '))}</span><small>${escapeForHtml(template.fileName)}</small>`;
    button.addEventListener('click', () => { state.selectedId = template.id; expandPathForTemplate(template); render(); });
    elements.recentRoot.appendChild(button);
  });
}

function renderFavoriteTemplates() {
  if (!elements.favoriteRoot) return;
  elements.favoriteRoot.innerHTML = '';
  const favTemplates = state.favoriteTemplateIds.map(id => library.templates.find(t => t.id === id)).filter(Boolean);
  if (favTemplates.length === 0) {
    elements.favoriteRoot.innerHTML = '<div class="recent-empty"><p>收藏常用模板后，可以从这里快速进入。</p></div>';
    return;
  }
  favTemplates.forEach(template => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'recent-item';
    if (template.id === state.selectedId) button.classList.add('active');
    button.innerHTML = `<strong>${escapeForHtml(template.title)}</strong><span>${escapeForHtml(template.layers.join(' / '))}</span><small>${escapeForHtml(template.fileName)}</small>`;
    button.addEventListener('click', () => { state.selectedId = template.id; expandPathForTemplate(template); render(); });
    elements.favoriteRoot.appendChild(button);
  });
}

function getSessionAiApiKey() { return sessionStorage.getItem(AI_API_KEY_SESSION_KEY) || ''; }
function persistSessionAiApiKey(value) {
  const v = String(value || '').trim();
  v ? sessionStorage.setItem(AI_API_KEY_SESSION_KEY, v) : sessionStorage.removeItem(AI_API_KEY_SESSION_KEY);
}

function getExplainApiKey() { return elements.explainApiKey?.value.trim() || getSessionAiApiKey(); }
function getSharedAiApiKey() { return elements.classifyApiKey?.value.trim() || getExplainApiKey(); }

function getTopMatchedTemplateForCodeClassification() { return state.codeClassificationResult?.matches?.[0]?.template || null; }
function getSuggestedTemplateDirectory() {
  const m = getTopMatchedTemplateForCodeClassification();
  if (m?.relativePath) return m.relativePath.split('/').slice(0, -1).join('/');
  const top = state.codeClassificationResult?.matches?.[0]?.template?.layers?.[0] || state.codeClassificationResult?.categoryText?.split(' / ')[0] || '';
  if (top === '图论') return '模板库/图论';
  if (top === '动态规划') return '模板库/dp';
  if (top === '数据结构') return '模板库/数据结构';
  if (top === '基础能力') return '模板库/基础';
  if (top === '基础算法') return '模板库/二分';
  return '模板库';
}

function sanitizeTemplateFileName(name) {
  const n = String(name || '').trim().replace(/[\\/:*?"<>|]+/g, '-');
  if (!n) return '';
  return /\.(cpp|cc|cxx)$/i.test(n) ? n : `${n}.cpp`;
}

function sanitizeTemplateDirectory(d) {
  const n = String(d || '').trim().replace(/\\/g, '/').replace(/[?*:"<>|]+/g, '-').replace(/\/+/g, '/').replace(/^\/+|\/+$/g, '');
  if (!n) return '模板库';
  return n.startsWith('模板库') ? n : `模板库/${n}`;
}

function slugifySuggestionSegment(v) {
  return String(v || '').trim().replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function slugifyDirectorySegment(v) {
  return String(v || '').trim().replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function getCategorySegmentsForSuggestion() {
  const m = getTopMatchedTemplateForCodeClassification();
  if (Array.isArray(m?.layers) && m.layers.length > 0) return m.layers.filter(Boolean);
  return String(state.codeClassificationResult?.categoryText || '').split(' / ').map(s => s.trim()).filter(Boolean);
}

function getAiSuggestedDirectory() {
  const d = state.codeClassificationResult?.suggestedDirectory || '';
  return d ? sanitizeTemplateDirectory(d) : '';
}

function buildDirectoryFromCategorySegments(cs) {
  if (!Array.isArray(cs) || cs.length === 0) return '模板库';
  const top = cs[0] || '';
  const tail = cs.slice(1).map(slugifyDirectorySegment).filter(Boolean);
  if (top === '图论') return sanitizeTemplateDirectory(['模板库', '图论', ...tail].join('/'));
  if (top === '动态规划') return sanitizeTemplateDirectory(['模板库', 'dp', ...tail].join('/'));
  if (top === '数据结构') return sanitizeTemplateDirectory(['模板库', '数据结构', ...tail].join('/'));
  if (top === '基础能力') return sanitizeTemplateDirectory(['模板库', '基础', ...tail].join('/'));
  if (top === '基础算法') return sanitizeTemplateDirectory(['模板库', ...tail].join('/'));
  return sanitizeTemplateDirectory(['模板库', ...cs.map(slugifyDirectorySegment).filter(Boolean)].join('/'));
}

function getBestDirectoryByCategorySegments(cs) {
  if (!Array.isArray(cs) || cs.length === 0) return '';
  let bm = ''; let bs = 0;
  library.templates.forEach(t => {
    const tl = Array.isArray(t.layers) ? t.layers : [];
    let s = 0;
    for (let i = 0; i < Math.min(cs.length, tl.length); i++) { if (cs[i] !== tl[i]) break; s++; }
    if (s === 0) return;
    const parts = String(t.relativePath || '').split('/');
    if (parts.length < 2) return;
    const d = parts.slice(0, -1).join('/');
    if (s > bs || (s === bs && d.length > bm.length)) { bs = s; bm = d; }
  });
  return bm;
}

function buildUniqueTemplateFileName(base, dir) {
  const nb = slugifySuggestionSegment(base) || '新模板';
  const paths = new Set(library.templates.map(t => String(t.relativePath || '').toLowerCase()));
  for (let i = 0; i < 50; i++) {
    const s = i === 0 ? '' : `-${i + 1}`;
    const fn = sanitizeTemplateFileName(`${nb}${s}`);
    const rp = `${dir || '模板库'}/${fn}`.toLowerCase();
    if (!paths.has(rp)) return fn;
  }
  return sanitizeTemplateFileName(`${nb}-${Date.now()}`);
}

function getSuggestedTemplateFileName(d = getSuggestedTemplateDirectory()) {
  const ai = sanitizeTemplateFileName(state.codeClassificationResult?.suggestedFileName || '');
  if (ai) return buildUniqueTemplateFileName(ai.replace(/\.(cpp|cc|cxx)$/i, ''), d);
  const m = getTopMatchedTemplateForCodeClassification();
  if (m?.title) return buildUniqueTemplateFileName(m.title, d);
  const cs = getCategorySegmentsForSuggestion();
  const sig = state.codeClassificationResult?.signals?.[0] || '';
  const tail = cs[cs.length - 1] || cs[0] || '';
  const parts = [tail, sig].map(slugifySuggestionSegment).filter(Boolean).slice(0, 2);
  return parts.length > 0 ? buildUniqueTemplateFileName(parts.join('-'), d) : buildUniqueTemplateFileName('新模板', d);
}

function getTemplateDirectoryOptions() {
  const dirs = new Set(['模板库']);
  library.templates.forEach(t => { const p = t.relativePath.split('/'); if (p.length > 1) dirs.add(sanitizeTemplateDirectory(p.slice(0, -1).join('/'))); });
  return Array.from(dirs).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
}

function applyLibraryDataUpdate(next) {
  if (!next || !Array.isArray(next.templates) || typeof next.summary !== 'object') return;
  library.templates = next.templates;
  library.summary = next.summary;
  library.total = next.total || next.templates.length;
  library.generatedAt = next.generatedAt || library.generatedAt;
  window.TEMPLATE_LIBRARY = library;
}

function renderTemplateSaveSuggestion() {
  const m = getTopMatchedTemplateForCodeClassification();
  const cs = getCategorySegmentsForSuggestion();
  const sd = getAiSuggestedDirectory() || (m?.relativePath ? getSuggestedTemplateDirectory() : '') || getBestDirectoryByCategorySegments(cs) || buildDirectoryFromCategorySegments(cs) || getSuggestedTemplateDirectory();
  const sfn = getSuggestedTemplateFileName(sd);
  if (elements.saveTemplatePath) {
    const opts = getTemplateDirectoryOptions();
    const nd = state.saveTemplateDirectoryTouched ? sanitizeTemplateDirectory(state.saveTemplateDirectory || sd) : sd;
    if (elements.saveTemplatePathOptions) {
      elements.saveTemplatePathOptions.innerHTML = '';
      opts.forEach(v => { const o = document.createElement('option'); o.value = v; elements.saveTemplatePathOptions.appendChild(o); });
      if (!opts.includes(nd)) { const o = document.createElement('option'); o.value = nd; elements.saveTemplatePathOptions.appendChild(o); }
    }
    elements.saveTemplatePath.value = nd;
    state.saveTemplateDirectory = nd;
  }
  if (elements.saveTemplateName && !state.saveTemplateNameTouched) elements.saveTemplateName.value = sfn;
  if (elements.saveTemplateHint) elements.saveTemplateHint.textContent = `建议文件名：${sfn}。建议目录：${sd}。`;
}

async function saveCurrentTemplateToLibrary() {
  if (!elements.classifyCodeInput || !elements.classifyStatus) return;
  const code = elements.classifyCodeInput.value.trim();
  if (!code) { elements.classifyStatus.textContent = '请先提供模板代码'; return; }
  const fn = sanitizeTemplateFileName(elements.saveTemplateName?.value) || getSuggestedTemplateFileName();
  const sd = sanitizeTemplateDirectory(elements.saveTemplatePath?.value || state.saveTemplateDirectory || getSuggestedTemplateDirectory());
  if (elements.saveTemplateName) elements.saveTemplateName.value = fn;
  if (elements.saveTemplatePath) elements.saveTemplatePath.value = sd;
  try {
    elements.classifyStatus.textContent = '正在写入模板库';
    const r = await fetch('/api/save-template', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: fn, relativeDirectory: sd, code: code.endsWith('\n') ? code : code + '\n', enrichWithAiMetadata: Boolean(elements.saveTemplateAiMetadata?.checked), aiEndpoint: getStoredAiSettings().endpoint, aiModel: getStoredAiSettings().model, aiApiKey: getSharedAiApiKey() }),
    });
    const p = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(p.error || `保存失败：${r.status}`);
    applyLibraryDataUpdate(p.library);
    if (p.savedTemplate?.id) { state.selectedId = p.savedTemplate.id; state.activeCategory = p.savedTemplate.layers?.[0] || ''; expandPathForTemplate(p.savedTemplate); }
    elements.classifyStatus.textContent = p.message || `已保存 ${fn}`;
    showActionToast(p.message || `已保存 ${fn}`);
    state.saveTemplateDirectoryTouched = false;
    renderTemplateSaveSuggestion();
    render();
  } catch (e) { elements.classifyStatus.textContent = e instanceof Error ? e.message : '保存失败'; }
}

async function deleteCurrentTemplateFromLibrary() {
  const sel = getSelectedTemplate(); const se = getTemplateDeleteStatusElement();
  if (!sel || !se) return;
  if (!window.confirm(`确认删除 ${sel.relativePath}？`)) return;
  try {
    setTemplateDeleteStatus('正在删除');
    const r = await fetch('/api/delete-template', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ templateId: sel.id, relativePath: sel.relativePath }) });
    const p = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(p.error || `删除失败：${r.status}`);
    removeTemplateFromCollections(sel.id);
    applyLibraryDataUpdate(p.library);
    state.selectedId = null; state.explanationTemplateId = null; state.explanationResult = null;
    showActionToast(p.message || '已删除');
    render();
  } catch (e) { setTemplateDeleteStatus(e instanceof Error ? e.message : '删除失败'); }
}

function setCodeClassificationIdleState(msg = '等待输入代码') {
  state.codeClassificationBusy = false; state.codeClassificationResult = null;
  if (elements.classifyStatus) elements.classifyStatus.textContent = msg;
  renderCodeClassificationResult();
}

function buildTemplateExplainUserPrompt(t) {
  return [`当前模板标题：${t.title}`, `人工分类路径：${t.layers.join(' / ')}`, `学习难度：${t.difficulty || '未标注'}`, `适用题型：${(t.scenarios || []).join('、') || '无'}`, `识别信号：${(t.signals || []).join('、') || '无'}`, `常见风险：${(t.risks || []).join('、') || '无'}`, `关键词：${(t.keywords || []).join('、') || '无'}`, '下面是模板源码：', t.code].join('\n\n');
}

function resetTemplateExplanation(id = null) {
  state.explanationResult = null; state.explanationTemplateId = id;
  if (elements.explainStatus) elements.explainStatus.textContent = '打开后可按需调用 AI';
  if (elements.explainResult) elements.explainResult.classList.add('hidden');
}

function renderTemplateExplanation() {
  if (!elements.toggleExplanation || !elements.explainBody || !elements.explainStatus || !elements.explainResult) return;
  elements.explainBody.classList.toggle('hidden', !state.explanationVisible);
  elements.toggleExplanation.textContent = state.explanationVisible ? '收起 AI 讲解' : '需要 AI 讲解';
  elements.toggleExplanation.classList.toggle('is-active', state.explanationVisible);
  const r = state.explanationResult;
  if (!r) { elements.explainResult.classList.add('hidden'); if (state.explanationBusy) elements.explainStatus.textContent = 'AI 正在讲解中'; return; }
  elements.explainResult.classList.remove('hidden');
  elements.explainAlgorithmName.textContent = r.algorithmName || '未识别';
  elements.explainSummary.textContent = r.algorithmSummary || '';
  renderTagList(elements.explainCoreIdeas, r.coreIdeas || []);
  renderTagList(elements.explainWhenToUse, r.whenToUse || []);
  renderTagList(elements.explainIdentifySignals, r.identifySignals || []);
  renderTagList(elements.explainPitfalls, r.pitfalls || []);
  renderTagList(elements.explainReadingSteps, r.readingSteps || []);
}

function renderCodeClassificationResult() {
  if (!elements.classifyResults || !elements.classifyCount || !elements.classifySummary) return;
  const r = state.codeClassificationResult;
  if (!r) { elements.classifyCount.textContent = state.codeClassificationBusy ? '分类中' : '等待代码'; elements.classifySummary.classList.add('hidden'); elements.classifyResults.innerHTML = '<div class="recommend-empty"><p>' + (state.codeClassificationBusy ? '正在分类' : '先提供模板代码') + '</p></div>'; return; }
  const matches = r.matches || [];
  elements.classifyCount.textContent = `${matches.length} 个候选`;
  elements.classifySummary.classList.remove('hidden');
  elements.classifyCategoryText.textContent = r.categoryText || '';
  renderTagList(elements.classifySignals, r.signals || []);
  elements.classifyCautionText.textContent = r.caution || '';
  elements.classifyResults.innerHTML = '';
  if (matches.length === 0) { elements.classifyResults.innerHTML = '<div class="recommend-empty"><p>没有匹配到模板</p></div>'; return; }
  matches.forEach((item, i) => {
    const c = document.createElement('button'); c.type = 'button'; c.className = 'recommend-item';
    c.innerHTML = `<div class="recommend-rank">TOP ${i + 1}</div><div class="classify-result-main"><strong>${escapeForHtml(item.template.title)}</strong><span>${escapeForHtml(item.template.layers.join(' / '))}</span><small>${escapeForHtml(item.reason)}</small></div>`;
    c.addEventListener('click', () => { state.activeCategory = item.template.layers[0] || ''; state.selectedId = item.template.id; expandPathForTemplate(item.template); render(); });
    elements.classifyResults.appendChild(c);
  });
}

async function analyzeTemplateCodeInput() {
  if (!elements.classifyCodeInput || !elements.classifyStatus) return;
  const code = elements.classifyCodeInput.value.trim();
  if (!code) { elements.classifyStatus.textContent = '请先粘贴代码'; return; }
  const apiKey = getSharedAiApiKey();
  if (!apiKey) { elements.classifyStatus.textContent = '请先填写 API Key'; return; }
  const { endpoint, model } = getStoredAiSettings();
  state.codeClassificationBusy = true; state.codeClassificationResult = null;
  elements.classifyStatus.textContent = 'AI 分类中';
  renderCodeClassificationResult();
  const catalog = library.templates.map(t => `${t.id} | ${t.title} | ${t.layers.join('/')}`).join('\n');
  try {
    const payload = await callAiChatProxy({ endpoint, model, apiKey, temperature: 0.2, messages: [
      { role: 'system', content: ['你是算法模板分类助手。', '返回严格 JSON：{"matched_category":[],"suggested_file_name":"","suggested_directory":"","signals":[],"matches":[{"id":"","title":"","reason":""}],"caution":""}', 'matches 最多3个'].join('\n') },
      { role: 'user', content: `模板清单：\n${catalog}\n\n代码：\n${code}` },
    ]});
    const parsed = extractJsonFromResponse(payload.choices?.[0]?.message?.content);
    const matches = (Array.isArray(parsed.matches) ? parsed.matches : []).map(item => { const t = findTemplateByCandidate(item); return t ? { template: t, reason: item.reason || '' } : null; }).filter(Boolean).slice(0, 3);
    const cat = Array.isArray(parsed.matched_category) ? parsed.matched_category.filter(Boolean) : [];
    state.codeClassificationResult = { categoryText: cat.length > 0 ? cat.join(' / ') : (matches[0]?.template.layers.join(' / ') || ''), suggestedFileName: sanitizeTemplateFileName(parsed.suggested_file_name || ''), suggestedDirectory: parsed.suggested_directory ? sanitizeTemplateDirectory(parsed.suggested_directory) : '', signals: Array.isArray(parsed.signals) ? parsed.signals : [], caution: parsed.caution || '', matches };
    elements.classifyStatus.textContent = 'AI 分类完成';
    renderCodeClassificationResult();
    if (matches.length > 0) { state.activeCategory = matches[0].template.layers[0] || ''; state.selectedId = matches[0].template.id; expandPathForTemplate(matches[0].template); render(); }
  } catch (e) {
    state.codeClassificationResult = { categoryText: '分类失败', suggestedFileName: '', suggestedDirectory: '', signals: [], caution: e instanceof Error ? e.message : '', matches: [] };
    elements.classifyStatus.textContent = e instanceof Error ? e.message : '分类失败';
    renderCodeClassificationResult();
  } finally { state.codeClassificationBusy = false; }
}

async function explainCurrentTemplate() {
  const t = getSelectedTemplate();
  if (!t || !elements.explainStatus) return;
  const apiKey = getExplainApiKey();
  if (!apiKey) { state.explanationVisible = true; elements.explainStatus.textContent = '请先填写 API Key'; renderTemplateExplanation(); return; }
  const { endpoint, model } = getStoredAiSettings();
  state.explanationVisible = true; state.explanationBusy = true; state.explanationResult = null; state.explanationTemplateId = t.id;
  elements.explainStatus.textContent = 'AI 讲解生成中';
  renderTemplateExplanation();
  try {
    const payload = await callAiChatProxy({ endpoint, model, apiKey, temperature: 0.2, messages: [{ role: 'system', content: TEMPLATE_EXPLAIN_SYSTEM_PROMPT }, { role: 'user', content: buildTemplateExplainUserPrompt(t) }] });
    const parsed = extractJsonFromResponse(payload.choices?.[0]?.message?.content);
    state.explanationResult = { algorithmName: parsed.algorithm_name || t.title, algorithmSummary: parsed.algorithm_summary || '', coreIdeas: Array.isArray(parsed.core_ideas) ? parsed.core_ideas : [], whenToUse: Array.isArray(parsed.when_to_use) ? parsed.when_to_use : [], identifySignals: Array.isArray(parsed.identify_signals) ? parsed.identify_signals : [], pitfalls: Array.isArray(parsed.pitfalls) ? parsed.pitfalls : [], readingSteps: Array.isArray(parsed.reading_steps) ? parsed.reading_steps : [] };
    elements.explainStatus.textContent = '讲解完成';
    renderTemplateExplanation();
  } catch (e) { state.explanationResult = null; elements.explainStatus.textContent = e instanceof Error ? e.message : '讲解失败'; renderTemplateExplanation(); }
  finally { state.explanationBusy = false; }
}

function renderAnalysisResult() {
  if (!hasAiPage || !elements.recommendResults || !elements.recommendCount || !elements.analysisSummary) return;
  const result = state.recommendationResult;
  if (!result) {
    elements.recommendCount.textContent = state.analysisBusy ? '分析中' : '等待图片';
    elements.analysisSummary.classList.add('hidden');
    elements.recommendResults.innerHTML = `<div class="recommend-empty"><h4>${state.analysisBusy ? '正在调用模型' : '先配置模型并上传图片'}</h4></div>`;
    return;
  }
  const candidates = result.candidates || [];
  elements.recommendCount.textContent = `${candidates.length} 个候选`;
  elements.analysisSummary.classList.remove('hidden');
  elements.analysisSummaryText.textContent = result.problemSummary || '';
  renderTagList(elements.analysisSignals, result.extractedSignals || []);

  // 显示用户选择验证结果
  const hasValidation = Boolean(result.userChoiceValidation);
  const cautionExtra = hasValidation
    ? `${result.caution || ''} | ${result.userChoiceValidation.isCorrect ? '✅ 你的选择正确' : '❌ 选择有偏差'}：${result.userChoiceValidation.analysis || ''}`
    : result.caution || '';
  elements.analysisCautionText.textContent = cautionExtra || '无额外备注';

  elements.recommendResults.innerHTML = '';
  if (candidates.length === 0) {
    elements.recommendResults.innerHTML = '<div class="recommend-empty"><h4>模型未给出候选模板</h4></div>';
    return;
  }
  candidates.forEach((item, index) => {
    const card = document.createElement('button'); card.type = 'button'; card.className = 'recommend-item';
    card.innerHTML = `<div class="recommend-rank">TOP ${index + 1}</div><div class="recommend-body"><div class="recommend-main"><strong>${escapeForHtml(item.template.title)}</strong><span>${escapeForHtml(item.template.layers.join(' / '))}</span></div><div class="recommend-score">模型置信度 ${escapeForHtml(item.confidence)}</div><div class="recommend-reasons"><span class="reason-pill">${escapeForHtml(item.reason)}</span></div></div>`;
    card.addEventListener('click', () => { state.selectedId = item.template.id; expandPathForTemplate(item.template); renderTree(); renderDetail(); });
    elements.recommendResults.appendChild(card);
  });
}

function expandPathForTemplate(t) { state.expandedKeys.clear(); let cp = ''; t.layers.forEach(l => { cp = cp ? `${cp}/${l}` : l; state.expandedKeys.add(cp); }); }

function renderRecommendations() {
  if (!hasAiPage) return;
  const query = (state.recommendationQuery || '').trim();
  if (!query) { elements.recommendCount.textContent = '等待输入'; elements.recommendResults.innerHTML = '<div class="recommend-empty"><p>输入题目特征</p></div>'; return; }
  elements.recommendCount.textContent = '0 个结果';
  elements.recommendResults.innerHTML = '<div class="recommend-empty"><p>请使用 AI 分析页</p></div>';
}

function renderTree() {
  const ft = getFilteredTemplates(); const tree = buildTree(ft);
  elements.treeRoot.innerHTML = ''; elements.resultCount.textContent = `当前显示 ${ft.length} 个模板`;
  tree.forEach(n => elements.treeRoot.appendChild(renderNode(n)));
}

function ensureValidSelection(ft) { if (ft.length === 0) { state.selectedId = null; return; } if (!ft.some(t => t.id === state.selectedId)) state.selectedId = ft[0].id; }

function renderNode(node) {
  const w = document.createElement('div'); w.className = 'tree-node';
  if (node.type === 'leaf') {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'tree-leaf';
    if (node.template.id === state.selectedId) b.classList.add('active');
    b.innerHTML = `<span>${node.template.title}</span><small>.cpp</small>`;
    b.addEventListener('click', () => { state.selectedId = node.template.id; renderDetail(); renderTree(); });
    w.appendChild(b); return w;
  }
  const h = document.createElement('button'); h.type = 'button'; h.className = 'tree-branch-header';
  if (state.expandedKeys.has(node.key)) h.classList.add('active');
  h.innerHTML = `<span>${node.name}</span><small>${countLeaves(node)} 个模板</small>`;
  h.addEventListener('click', () => { if (state.expandedKeys.has(node.key)) state.expandedKeys.delete(node.key); else state.expandedKeys.add(node.key); renderTree(); });
  w.appendChild(h);
  if (state.expandedKeys.has(node.key)) { const c = document.createElement('div'); c.className = 'tree-node-children'; node.children.forEach(ch => c.appendChild(renderNode(ch))); w.appendChild(c); }
  return w;
}

function countLeaves(node) { if (node.type === 'leaf') return 1; return node.children.reduce((s, c) => s + countLeaves(c), 0); }

function renderDetail() {
  const sel = library.templates.find(t => t.id === state.selectedId);
  if (!sel) { if (elements.deleteCurrentTemplate) elements.deleteCurrentTemplate.disabled = true; clearTemplateDeleteStatus(); elements.emptyState.classList.remove('hidden'); elements.detailPanel.classList.add('hidden'); return; }
  pushRecentTemplate(sel.id);
  elements.emptyState.classList.add('hidden'); elements.detailPanel.classList.remove('hidden');
  elements.detailBreadcrumb.textContent = sel.layers.join(' / ');
  elements.detailTitle.textContent = sel.title; elements.detailTag.textContent = sel.fileName;
  if (elements.deleteCurrentTemplate) elements.deleteCurrentTemplate.disabled = false;
  if (elements.toggleFavorite) { const f = isFavoriteTemplate(sel.id); elements.toggleFavorite.textContent = f ? '取消收藏' : '加入收藏'; elements.toggleFavorite.classList.toggle('is-favorite', f); }
  elements.detailDifficulty.textContent = sel.difficulty || '未标注';
  elements.detailLayers.textContent = sel.layers.join(' -> ');
  elements.detailPath.textContent = sel.relativePath; elements.detailNote.textContent = sel.note;
  renderTagList(elements.detailKeywords, sel.keywords || []);
  renderTagList(elements.detailScenarios, sel.scenarios || []);
  renderTagList(elements.detailSignals, sel.signals || []);
  renderTagList(elements.detailRisks, sel.risks || []);
  if (state.explanationTemplateId !== sel.id) resetTemplateExplanation(sel.id);
  const lc = countCodeLines(sel.code); elements.codeMeta.textContent = `${lc} 行`;
  if (lc <= COLLAPSE_LINE_THRESHOLD) state.collapseCode = false;
  elements.detailCode.innerHTML = renderHighlightedCode(sel.code);
  renderCodeBlockState(lc);
}

function renderTagList(container, values) { container.innerHTML = ''; values.forEach(v => { const t = document.createElement('span'); t.className = 'tag-item'; t.textContent = v; container.appendChild(t); }); }

function expandAllBranches() { const ft = getFilteredTemplates(); const tree = buildTree(ft); state.expandedKeys.clear(); const s = [...tree]; while (s.length > 0) { const n = s.pop(); if (n.type === 'branch') { state.expandedKeys.add(n.key); s.push(...n.children); } } }

function countCodeLines(code) { return normalizeCodeLineEndings(code).split('\n').length; }
function normalizeCodeLineEndings(code) { return String(code || '').replace(/\r\n?/g, '\n'); }
function escapeHtml(value) { return value.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>'); }

const CPP_TOKEN_PATTERN = /(^\s*#.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\/\*[\s\S]*?\*\/)|(\/\/.*$)/gm;
function storeTokenHtml(ts, html) { const t = `__TOKEN_${ts.length}__`; ts.push({ token: t, html }); return t; }
function preserveCppTokens(source) { const ts = []; const text = source.replace(CPP_TOKEN_PATTERN, (m, pp, sl, bc, lc) => { const cls = pp ? 'preprocessor' : (sl || bc || lc).startsWith('//') || (sl || bc || lc).startsWith('/*') ? 'comment' : 'string'; return m.split('\n').map(line => storeTokenHtml(ts, `<span class="token ${cls}">${escapeHtml(line)}</span>`)).join('\n'); }); return { text, tokenStore: ts }; }
function highlightCpp(code) { const { text, tokenStore } = preserveCppTokens(code); return escapeHtml(text).split(/(__TOKEN_\d+__)/g).map(seg => { const e = tokenStore.find(en => en.token === seg); if (e) return e.html; return seg.replace(/0x[\da-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[A-Za-z_]\w*/g, (m, off, src) => { if (/^(0x[\da-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)$/.test(m)) return `<span class="token number">${m}</span>`; if (CPP_KEYWORDS.has(m)) return `<span class="token keyword">${m}</span>`; if (CPP_TYPES.has(m)) return `<span class="token type">${m}</span>`; if (/^\s*\(/.test(src.slice(off + m.length))) return `<span class="token function">${m}</span>`; return m; }); }).join(''); }
function renderHighlightedCode(code) { return highlightCpp(normalizeCodeLineEndings(code)).split('\n').map((l, i) => `<span class="code-line"><span class="line-number">${i + 1}</span><span class="line-content">${l.length > 0 ? l : '&nbsp;'}</span></span>`).join(''); }

function renderCodeBlockState(lc) {
  elements.codeBlock.classList.toggle('is-wrapped', state.wrapCode);
  const sc = state.collapseCode && lc > COLLAPSE_LINE_THRESHOLD;
  elements.codeBlock.classList.toggle('is-collapsed', sc);
  elements.toggleWrap.textContent = state.wrapCode ? '关闭换行' : '自动换行';
  elements.toggleWrap.classList.toggle('is-active', state.wrapCode);
  const cc = lc > COLLAPSE_LINE_THRESHOLD;
  elements.toggleCollapse.disabled = !cc;
  elements.toggleCollapse.textContent = cc ? (sc ? '展开全部' : '折叠长代码') : '无需折叠';
  elements.codeStatus.textContent = cc ? (sc ? `已折叠到前 ${COLLAPSE_LINE_THRESHOLD} 行` : '完整展示') : '完整展示';
}

function getSelectedTemplate() { return library.templates.find(t => t.id === state.selectedId) || null; }

function truncateText(text, maxLen) { const s = String(text || ''); return s.length > maxLen ? s.slice(0, maxLen) + '…' : s; }

function render() {
  const ft = getFilteredTemplates(); ensureValidSelection(ft);
  renderQuickFilters(); renderSummary(); renderRecentTemplates(); renderFavoriteTemplates();
  renderTemplateSaveSuggestion(); renderCodeClassificationResult(); renderTree();
  if (hasAiPage) { renderAnalysisResult(); renderDiagnosis(); }
  renderDetail();
}

// ========== AI 深度诊断报告 ==========

async function generateAiDiagnosisReport() {
  if (!hasAiPage || !elements.diagnosisAiReportShell) {
    return;
  }

  const diagnosis = analyzeMastery();
  if (diagnosis.totalAttempts === 0) {
    if (elements.diagnosisAiReportStatus) {
      elements.diagnosisAiReportStatus.textContent = '暂无数据';
    }
    return;
  }

  const apiKey = getExplainApiKey() || elements.aiApiKey?.value.trim();
  if (!apiKey) {
    if (elements.diagnosisAiReportStatus) {
      elements.diagnosisAiReportStatus.textContent = '请先在 AI 分析区填写 API Key';
    }
    if (elements.diagnosisAiReportShell) {
      elements.diagnosisAiReportShell.classList.remove('hidden');
    }
    if (elements.diagnosisAiReportContent) {
      elements.diagnosisAiReportContent.innerHTML = '<p class="helper">需要 API Key 才能生成 AI 诊断报告。请在题目分析区填写 API Key 后重试。</p>';
    }
    return;
  }

  if (elements.diagnosisAiReportShell) {
    elements.diagnosisAiReportShell.classList.remove('hidden');
  }
  if (elements.diagnosisAiReportStatus) {
    elements.diagnosisAiReportStatus.textContent = 'AI 正在分析你的学习数据...';
  }
  if (elements.diagnosisAiReportContent) {
    elements.diagnosisAiReportContent.innerHTML = '<p class="helper">正在调用 AI 模型，请稍候...</p>';
  }

  const { endpoint, model } = getStoredAiSettings();

  // 构建传给 AI 的历史数据摘要
  const weakCategories = Object.entries(diagnosis.categoryStats)
    .filter(([, s]) => s.total > 0 && s.correct / s.total < 0.5)
    .map(([cat, s]) => `${cat}：${s.correct}/${s.total} 正确（${Math.round(s.correct / s.total * 100)}%）`)
    .join('\n');

  const strongCategories = Object.entries(diagnosis.categoryStats)
    .filter(([, s]) => s.total > 0 && s.correct / s.total >= 0.7)
    .map(([cat, s]) => `${cat}：${s.correct}/${s.total} 正确（${Math.round(s.correct / s.total * 100)}%）`)
    .join('\n');

  const recentRecords = diagnosis.recentHistory
    .map((r, i) => `${i + 1}. [${r.isCorrect ? '✓' : '✗'}] 题目："${r.problemSummary}" | 用户选："${r.userChoice}" | AI推荐："${r.aiTopTitle}"`)
    .join('\n');

  const systemPrompt = [
    '你是算法学习诊断专家。你会收到一个学生的算法学习分析历史数据，请据此生成一份个性化学习诊断报告。',
    '报告需要包含以下部分（使用 Markdown 格式）：',
    '## 一、整体评估',
    '对学生当前算法掌握情况的总体评价（1-2段）',
    '## 二、掌握良好的专题',
    '列出学生表现较好的算法专题，并说明其优势模式',
    '## 三、需要加强的专题',
    '列出薄弱专题，分析可能的原因（概念混淆？推理断层？迁移困难？）',
    '## 四、具体学习建议',
    '针对薄弱专题给出 3-5 条具体可操作的学习建议',
    '## 五、学习趋势',
    '根据近期记录分析进步或退步趋势',
    '请用中文回答，语气鼓励但客观。',
  ].join('\n');

  const userPrompt = [
    '以下是学生的算法学习分析数据：',
    '',
    `累计分析次数：${diagnosis.totalAttempts}`,
    `总体正确率：${diagnosis.correctRate}%`,
    '',
    '=== 掌握良好的专题（正确率 ≥ 70%）===',
    strongCategories || '无',
    '',
    '=== 薄弱专题（正确率 < 50%）===',
    weakCategories || '无',
    '',
    '=== 最近分析记录 ===',
    recentRecords || '无',
    '',
    '请据此生成完整的诊断报告。',
  ].join('\n');

  try {
    const payload = await callAiChatProxy({
      endpoint,
      model,
      apiKey,
      temperature: 0.5,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const reportText = payload.choices?.[0]?.message?.content || 'AI 未返回有效报告内容。';

    if (elements.diagnosisAiReportStatus) {
      elements.diagnosisAiReportStatus.textContent = '报告生成完成';
    }
    if (elements.diagnosisAiReportContent) {
      // 简单的 Markdown 转 HTML
      const html = reportText
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/## ([^\n]+)/g, '<h4>$1</h4>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');
      elements.diagnosisAiReportContent.innerHTML = html;
    }
  } catch (error) {
    if (elements.diagnosisAiReportStatus) {
      elements.diagnosisAiReportStatus.textContent = '报告生成失败';
    }
    if (elements.diagnosisAiReportContent) {
      elements.diagnosisAiReportContent.innerHTML = `<p class="helper">AI 诊断报告生成失败：${escapeForHtml(error instanceof Error ? error.message : '未知错误')}</p>`;
    }
  }
}

// ========== 事件监听 ==========

if (elements.keyword) { elements.keyword.addEventListener('input', e => { state.keyword = e.target.value; expandAllBranches(); render(); }); }
if (elements.clearSearch) { elements.clearSearch.addEventListener('click', () => { state.keyword = ''; elements.keyword.value = ''; expandAllBranches(); render(); }); }
if (elements.clearCategoryFilter) { elements.clearCategoryFilter.addEventListener('click', () => { state.activeCategory = ''; expandAllBranches(); render(); }); }
if (elements.clearRecent) { elements.clearRecent.addEventListener('click', () => { state.recentTemplateIds = []; persistRecentTemplateIds(); renderRecentTemplates(); }); }
if (elements.clearFavorites) { elements.clearFavorites.addEventListener('click', () => { state.favoriteTemplateIds = []; persistFavoriteTemplateIds(); renderFavoriteTemplates(); renderDetail(); }); }

if (hasAiPage && elements.aiEndpoint && elements.aiModel && elements.aiExtraPrompt) {
  const raw = localStorage.getItem('template-ai-endpoint') || '';
  if (raw && !isValidAiEndpoint(raw)) localStorage.setItem('template-ai-endpoint', DEFAULT_AI_ENDPOINT);
  const s = getStoredAiSettings();
  elements.aiEndpoint.value = s.endpoint; elements.aiModel.value = s.model; elements.aiExtraPrompt.value = s.extraPrompt;
}

if (elements.explainApiKey) { elements.explainApiKey.value = getSessionAiApiKey(); elements.explainApiKey.addEventListener('input', e => { persistSessionAiApiKey(e.target.value); if (elements.classifyApiKey && elements.classifyApiKey.value !== e.target.value) elements.classifyApiKey.value = e.target.value; }); }
if (elements.classifyApiKey) { elements.classifyApiKey.value = getSessionAiApiKey(); elements.classifyApiKey.addEventListener('input', e => { persistSessionAiApiKey(e.target.value); if (elements.explainApiKey && elements.explainApiKey.value !== e.target.value) elements.explainApiKey.value = e.target.value; }); }
if (elements.classifyCodeFile && elements.classifyCodeInput) { elements.classifyCodeFile.addEventListener('change', async e => { const f = e.target.files?.[0]; if (!f) return; try { elements.classifyCodeInput.value = await readFileAsText(f); if (elements.classifyStatus) elements.classifyStatus.textContent = `${f.name} 已载入`; } catch (err) { if (elements.classifyStatus) elements.classifyStatus.textContent = err instanceof Error ? err.message : '读取失败'; } }); }
if (elements.classifyCodeInput) {
  elements.classifyCodeInput.addEventListener('input', e => { if (!e.target.value.trim()) { setCodeClassificationIdleState('等待输入代码'); return; } if (!state.codeClassificationBusy) setCodeClassificationIdleState('代码已更新，点击智能分类'); });
  elements.classifyCodeInput.addEventListener('paste', () => { window.setTimeout(() => { if (elements.classifyCodeInput.value.trim() && !state.codeClassificationBusy) setCodeClassificationIdleState('代码已粘贴，点击智能分类'); }, 0); });
}

if (hasAiPage && elements.problemImage) { elements.problemImage.addEventListener('change', async e => { await applyAnalysisImageFile(e.target.files?.[0], '图片'); }); }
if (elements.toggleExplanation) { elements.toggleExplanation.addEventListener('click', () => { state.explanationVisible = !state.explanationVisible; renderTemplateExplanation(); }); }
if (elements.runExplanation) { elements.runExplanation.addEventListener('click', () => explainCurrentTemplate()); }
if (elements.runCodeClassify) { elements.runCodeClassify.addEventListener('click', () => analyzeTemplateCodeInput()); }
if (elements.clearCodeClassify) { elements.clearCodeClassify.addEventListener('click', () => { if (elements.classifyCodeInput) elements.classifyCodeInput.value = ''; if (elements.classifyCodeFile) elements.classifyCodeFile.value = ''; if (elements.saveTemplateName) elements.saveTemplateName.value = ''; state.saveTemplateNameTouched = false; state.saveTemplateDirectory = ''; state.saveTemplateDirectoryTouched = false; setCodeClassificationIdleState('等待输入代码'); }); }
if (elements.saveTemplateName) { elements.saveTemplateName.addEventListener('input', e => { state.saveTemplateNameTouched = Boolean(e.target.value.trim()); renderTemplateSaveSuggestion(); }); }
if (elements.saveTemplatePath) { elements.saveTemplatePath.addEventListener('input', e => { state.saveTemplateDirectory = sanitizeTemplateDirectory(e.target.value); state.saveTemplateDirectoryTouched = true; renderTemplateSaveSuggestion(); }); }
if (elements.saveTemplateAiMetadata) { elements.saveTemplateAiMetadata.addEventListener('change', () => renderTemplateSaveSuggestion()); }
if (elements.saveCurrentTemplate) { elements.saveCurrentTemplate.addEventListener('click', () => saveCurrentTemplateToLibrary()); }
if (elements.deleteCurrentTemplate) { elements.deleteCurrentTemplate.addEventListener('click', () => deleteCurrentTemplateFromLibrary()); }
if (elements.toggleFavorite) { elements.toggleFavorite.addEventListener('click', () => { const s = getSelectedTemplate(); if (!s) return; toggleFavoriteTemplate(s.id); renderFavoriteTemplates(); renderDetail(); }); }

if (hasAiPage && elements.pasteTarget) {
  elements.pasteTarget.addEventListener('click', () => elements.pasteTarget.focus());
  elements.pasteTarget.addEventListener('paste', async e => { await handleImagePaste(e, '剪贴板图片'); });
  document.addEventListener('paste', async e => { if (e.defaultPrevented) return; const pasted = await handleImagePaste(e, '剪贴板图片'); if (pasted && !isEditableTarget(e.target) && elements.pasteTarget) elements.pasteTarget.focus(); });
}

if (hasAiPage && elements.runRecommendation) { elements.runRecommendation.addEventListener('click', () => analyzeProblemImage()); }
if (hasAiPage && document.querySelector('#reset-ai-endpoint')) { document.querySelector('#reset-ai-endpoint').addEventListener('click', () => { elements.aiEndpoint.value = DEFAULT_AI_ENDPOINT; localStorage.setItem('template-ai-endpoint', DEFAULT_AI_ENDPOINT); }); }
if (hasAiPage && document.querySelector('#reset-ai-model')) { document.querySelector('#reset-ai-model').addEventListener('click', () => { elements.aiModel.value = DEFAULT_AI_MODEL; localStorage.setItem('template-ai-model', DEFAULT_AI_MODEL); }); }
if (hasAiPage && elements.clearRecommendation) { elements.clearRecommendation.addEventListener('click', () => { state.recommendationResult = null; state.userChoiceValidation = null; clearAnalysisImage(); elements.aiExtraPrompt.value = DEFAULT_AI_EXTRA_PROMPT; elements.recommendStatus.textContent = '等待模型配置'; renderAnalysisResult(); }); }

// 用户模板选择输入自动补全
if (hasAiPage && elements.userTemplateChoice) {
  elements.userTemplateChoice.addEventListener('input', e => renderAutocomplete(e.target.value));
  elements.userTemplateChoice.addEventListener('focus', () => { if (elements.userTemplateChoice.value.trim()) renderAutocomplete(elements.userTemplateChoice.value); });
  elements.userTemplateChoice.addEventListener('blur', () => { window.setTimeout(() => { if (elements.templateAutocomplete) elements.templateAutocomplete.classList.add('hidden'); }, 150); });
}

// 诊断面板按钮
if (hasAiPage && elements.runDiagnosis) { elements.runDiagnosis.addEventListener('click', () => { renderDiagnosis(); generateAiDiagnosisReport(); }); }
if (hasAiPage && elements.regenerateDiagnosis) { elements.regenerateDiagnosis.addEventListener('click', () => generateAiDiagnosisReport()); }
if (hasAiPage && elements.clearDiagnosis) { elements.clearDiagnosis.addEventListener('click', () => { if (window.confirm('确认清空所有分析历史记录？此操作不可撤销。')) { clearAllAnalysisHistory(); renderDiagnosis(); showActionToast('分析历史已清空'); } }); }

if (elements.resetView) { elements.resetView.addEventListener('click', () => { state.keyword = ''; state.activeCategory = ''; state.selectedId = null; state.expandedKeys.clear(); elements.keyword.value = ''; render(); }); }
if (elements.expandAll) { elements.expandAll.addEventListener('click', () => { expandAllBranches(); renderTree(); }); }
if (elements.toggleWrap) { elements.toggleWrap.addEventListener('click', () => { state.wrapCode = !state.wrapCode; const s = getSelectedTemplate(); if (s) renderCodeBlockState(countCodeLines(s.code)); }); }
if (elements.toggleCollapse) { elements.toggleCollapse.addEventListener('click', () => { const s = getSelectedTemplate(); if (!s) return; const lc = countCodeLines(s.code); if (lc > COLLAPSE_LINE_THRESHOLD) { state.collapseCode = !state.collapseCode; renderCodeBlockState(lc); } }); }
if (elements.copyCode) { elements.copyCode.addEventListener('click', async () => { const s = getSelectedTemplate(); if (!s) return; try { await navigator.clipboard.writeText(s.code); elements.copyCode.textContent = '复制成功'; elements.copyCode.classList.add('is-success'); setTimeout(() => { elements.copyCode.textContent = '复制代码'; elements.copyCode.classList.remove('is-success'); renderCodeBlockState(countCodeLines(s.code)); }, 1200); } catch (e) { elements.copyCode.textContent = '复制失败'; elements.copyCode.classList.add('is-danger'); setTimeout(() => { elements.copyCode.textContent = '复制代码'; elements.copyCode.classList.remove('is-danger'); renderCodeBlockState(countCodeLines(s.code)); }, 1200); } }); }

// 初始化
state.recentTemplateIds = getStoredRecentTemplateIds();
state.favoriteTemplateIds = getStoredFavoriteTemplateIds();
state.analysisHistory = getStoredAnalysisHistory();

render();
renderTemplateExplanation();
if (hasAiPage) renderDiagnosis();