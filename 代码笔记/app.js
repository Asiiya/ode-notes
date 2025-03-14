// 代码笔记应用的主要JavaScript逻辑

// DOM元素
const notesList = document.getElementById('notes-list');
const tagsList = document.getElementById('tags-list');
const tagCloud = document.getElementById('tag-cloud');
const searchInput = document.getElementById('search-input');
const noteTitle = document.getElementById('note-title');
const tagsInput = document.getElementById('tags-input');
const languageSelector = document.getElementById('language-selector');
const themeSelector = document.getElementById('theme-selector');
const colorThemeSelector = document.getElementById('color-theme-selector');
const fontSelector = document.getElementById('font-selector');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const noteDescription = document.getElementById('note-description');
const newNoteBtn = document.getElementById('new-note-btn');
const saveNoteBtn = document.getElementById('save-note-btn');
const deleteNoteBtn = document.getElementById('delete-note-btn');
const formatCodeBtn = document.getElementById('format-code-btn');
const themeIcon = document.querySelector('.theme-icon');
const floatingToolbar = document.getElementById('floating-toolbar');
const indentBtn = document.getElementById('indent-btn');
const outdentBtn = document.getElementById('outdent-btn');
const commentBtn = document.getElementById('comment-btn');
const foldBtn = document.getElementById('fold-btn');
const searchCodeBtn = document.getElementById('search-code-btn');
const replaceBtn = document.getElementById('replace-btn');

// 代码编辑器实例
let codeEditor;

// 当前选中的笔记ID
let currentNoteId = null;

// 是否为暗黑模式
let isDarkMode = false;

// 当前检测到的语言
let detectedLanguage = 'javascript';

// 语言映射表 (用于自动检测)
const languageMap = {
    'javascript': ['js', 'javascript', 'jsx', 'node'],
    'python': ['py', 'python'],
    'html': ['html', 'htm', 'xml'],
    'css': ['css', 'scss', 'sass', 'less'],
    'java': ['java'],
    'cpp': ['cpp', 'c', 'cc', 'h', 'hpp'],
    'csharp': ['cs', 'csharp'],
    'php': ['php'],
    'ruby': ['rb', 'ruby'],
    'go': ['go'],
    'rust': ['rs', 'rust'],
    'swift': ['swift'],
    'typescript': ['ts', 'typescript', 'tsx'],
    'kotlin': ['kt', 'kotlin'],
    'sql': ['sql'],
    'shell': ['sh', 'bash', 'zsh', 'shell'],
    'yaml': ['yml', 'yaml'],
    'json': ['json'],
    'markdown': ['md', 'markdown']
};

// 语言检测正则表达式
const languagePatterns = {
    'javascript': /\b(const|let|var|function|=>|import|export|class|extends|async|await|document|window|console|if|else|for|while|return)\b/,
    'python': /\b(def|class|import|from|if|elif|else|for|while|try|except|with|print|return|self|None|True|False)\b/,
    'html': /<(!DOCTYPE|html|head|body|div|span|p|a|img|ul|ol|li|table|form|input|button|h[1-6]|script|link|meta|style)[^>]*>|<\/[a-z]+>/i,
    'css': /({[\s\S]*}|@media|@keyframes|@import|@font-face|#[a-zA-Z0-9_-]+|body|html|\.[a-zA-Z0-9_-]+|margin|padding|color|background|font|width|height)/,
    'java': /\b(public|private|protected|class|interface|extends|implements|new|void|static|final|import|package)\b/,
    'cpp': /\b(#include|namespace|template|class|struct|public|private|protected|virtual|const|int|void|char|bool|std::)\b/,
    'csharp': /\b(using|namespace|class|public|private|protected|static|void|string|int|bool|var|async|await|Console)\b/,
    'php': /(<\?php|\$[a-zA-Z_]|function|echo|require|include|namespace|use|public|private|protected|class|new)\b/,
    'ruby': /\b(def|class|module|require|include|attr_accessor|if|unless|end|puts|nil|true|false)\b/,
    'go': /\b(package|import|func|type|struct|interface|go|chan|defer|var|const|fmt|return|if|else|for|range)\b/,
    'rust': /\b(fn|let|mut|struct|enum|impl|trait|pub|use|mod|match|if|else|Option|Result|String|Vec)\b/,
    'swift': /\b(func|var|let|class|struct|enum|protocol|extension|guard|if|else|switch|case|import|UIKit|SwiftUI)\b/,
    'typescript': /\b(interface|type|namespace|enum|as|implements|declare|readonly|private|public|protected|extends|implements|any|string|number|boolean)\b/,
    'kotlin': /\b(fun|val|var|class|interface|object|suspend|override|lateinit|companion|data|when|is|in|by)\b/,
    'sql': /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN|GROUP BY|ORDER BY|HAVING|CREATE|ALTER|DROP|TABLE|DATABASE|INDEX|VIEW)\b/i,
    'shell': /\b(echo|export|source|alias|if|then|else|fi|for|do|done|while|case|esac|function)\b/,
    'yaml': /^(\s*)([a-zA-Z0-9_-]+):\s*(.*)|^\s*-\s+[a-zA-Z0-9_-]+:/m,
    'json': /^[\s\n]*[{[]|"[^"]+"\s*:/,
    'markdown': /^(#{1,6}\s|[*-]\s|\d+\.\s|>\s|\[.+\]\(.+\)|```|__|\*\*)/m
};

// 初始化应用
function initApp() {
    // 初始化代码编辑器
    codeEditor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        lineNumbers: true,
        mode: 'javascript',
        theme: 'default',
        indentUnit: 4,
        autoCloseBrackets: true,
        matchBrackets: true,
        lineWrapping: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    });

    // 加载笔记
    loadNotes();

    // 添加事件监听器
    newNoteBtn.addEventListener('click', createNewNote);
    saveNoteBtn.addEventListener('click', saveCurrentNote);
    deleteNoteBtn.addEventListener('click', deleteCurrentNote);
    searchInput.addEventListener('input', searchNotes);
    languageSelector.addEventListener('change', changeLanguage);
    themeSelector.addEventListener('change', changeEditorTheme);
    colorThemeSelector.addEventListener('change', changeColorTheme);
    fontSelector.addEventListener('change', changeEditorFont);
    themeToggleBtn.addEventListener('click', toggleDarkMode);
    formatCodeBtn.addEventListener('click', formatCode);
    
    // 添加悬浮工具栏事件监听器
    indentBtn.addEventListener('click', indentCode);
    outdentBtn.addEventListener('click', outdentCode);
    commentBtn.addEventListener('click', toggleComment);
    foldBtn.addEventListener('click', toggleFold);
    searchCodeBtn.addEventListener('click', searchInCode);
    replaceBtn.addEventListener('click', replaceInCode);
    
    // 添加代码变化监听
    setupCodeChangeListener();
    
    // 添加复制代码按钮
    addCopyCodeButton();

    // 检查本地存储中的主题设置
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        enableDarkMode();
    }

    // 检查本地存储中的编辑器主题设置
    const savedEditorTheme = localStorage.getItem('editorTheme');
    if (savedEditorTheme) {
        themeSelector.value = savedEditorTheme;
        changeEditorTheme();
    }
    
    // 检查本地存储中的颜色主题设置
    const savedColorTheme = localStorage.getItem('colorTheme');
    if (savedColorTheme) {
        colorThemeSelector.value = savedColorTheme;
        changeColorTheme();
    }
    
    // 检查本地存储中的字体设置
    const savedFont = localStorage.getItem('editorFont');
    if (savedFont) {
        fontSelector.value = savedFont;
        changeEditorFont();
    }

    // 添加毛玻璃效果
    document.querySelector('.sidebar').classList.add('glass');
    document.querySelector('.editor-container').classList.add('glass');
    
    // 初始化语言选择器样式
    updateLanguageSelectorStyle('javascript');
    
    // 初始化标签云
    updateTagCloud();
}

// 从本地存储加载笔记
function loadNotes() {
    const notes = getNotes();
    renderNotesList(notes);
    renderTagsList(getAllTags(notes));
}

// 从localStorage获取所有笔记
function getNotes() {
    const notesJson = localStorage.getItem('codeNotes');
    return notesJson ? JSON.parse(notesJson) : [];
}

// 保存笔记到localStorage
function saveNotes(notes) {
    localStorage.setItem('codeNotes', JSON.stringify(notes));
}

// 渲染笔记列表
function renderNotesList(notes) {
    notesList.innerHTML = '';
    
    if (notes.length === 0) {
        notesList.innerHTML = '<div class="empty-notes">没有笔记，点击"新建笔记"开始</div>';
        return;
    }

    notes.forEach(note => {
        const noteItem = document.createElement('div');
        noteItem.className = `note-item ${note.id === currentNoteId ? 'active' : ''}`;
        noteItem.dataset.id = note.id;
        
        const titleElement = document.createElement('div');
        titleElement.className = 'note-item-title';
        titleElement.textContent = note.title || '无标题笔记';
        
        const languageElement = document.createElement('div');
        languageElement.className = 'note-item-language';
        
        // 获取实际语言
        let actualLanguage = note.language;
        if (note.language === 'auto' && note.code) {
            actualLanguage = detectLanguage(note.code);
        }
        
        // 使用标准颜色
        const languageColor = getLanguageColor(actualLanguage);
        languageElement.textContent = note.language === 'auto' ? 
            `自动检测 (${getLanguageDisplayName(actualLanguage)})` : 
            getLanguageDisplayName(note.language);
        languageElement.style.color = languageColor;
        
        const tagsElement = document.createElement('div');
        tagsElement.className = 'note-item-tags';
        if (note.tags && note.tags.length > 0) {
            tagsElement.textContent = note.tags.join(', ');
        }
        
        noteItem.appendChild(titleElement);
        noteItem.appendChild(languageElement);
        noteItem.appendChild(tagsElement);
        
        noteItem.addEventListener('click', () => loadNote(note.id));
        
        notesList.appendChild(noteItem);
    });
    
    // 更新标签云
    updateTagCloud();
}

// 渲染标签列表
function renderTagsList(tags) {
    tagsList.innerHTML = '';
    
    tags.forEach(tag => {
        const tagItem = document.createElement('div');
        tagItem.className = 'tag-item';
        tagItem.textContent = tag;
        tagItem.addEventListener('click', () => filterNotesByTag(tag));
        tagsList.appendChild(tagItem);
    });
}

// 获取所有标签
function getAllTags(notes) {
    const tagsSet = new Set();
    
    notes.forEach(note => {
        if (note.tags && note.tags.length > 0) {
            note.tags.forEach(tag => tagsSet.add(tag));
        }
    });
    
    return Array.from(tagsSet);
}

// 加载笔记到编辑器
function loadNote(noteId) {
    const notes = getNotes();
    const note = notes.find(n => n.id === noteId);
    
    if (!note) return;
    
    currentNoteId = noteId;
    
    // 更新UI
    noteTitle.value = note.title || '';
    tagsInput.value = note.tags ? note.tags.join(', ') : '';
    noteDescription.value = note.description || '';
    languageSelector.value = note.language;
    
    // 更新代码编辑器
    codeEditor.setValue(note.code || '');
    
    // 如果没有代码，隐藏语言显示
    if (!note.code || note.code.trim() === '') {
        const languageDisplay = document.getElementById('detected-language-display');
        if (languageDisplay) {
            languageDisplay.style.display = 'none';
        }
        return;
    }
    
    // 如果是自动检测语言，则进行检测
    if (note.language === 'auto') {
        const detectedLang = detectLanguage(note.code);
        detectedLanguage = detectedLang; // 更新全局变量
        setEditorLanguage(detectedLang);
        // 确保设置了代码变化监听
        setupCodeChangeListener();
        
        // 显示检测到的语言
        if (note.code) {
            const languageDisplayName = getLanguageDisplayName(detectedLang);
            updateLanguageDisplay(languageDisplayName);
            // 更新语言选择器样式
            updateLanguageSelectorStyle(detectedLang);
        }
    } else {
        changeLanguage();
        // 显示选择的语言
        const languageDisplayName = getLanguageDisplayName(note.language);
        updateLanguageDisplay(languageDisplayName);
        // 更新语言选择器样式
        updateLanguageSelectorStyle(note.language);
    }
    
    // 更新笔记列表选中状态
    document.querySelectorAll('.note-item').forEach(item => {
        item.classList.toggle('active', item.dataset.id === noteId);
    });
}

// 创建新笔记
function createNewNote() {
    const newNote = {
        id: Date.now().toString(),
        title: '新笔记',
        language: 'auto', // 默认使用自动检测
        code: '',
        description: '',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    const notes = getNotes();
    notes.unshift(newNote);
    saveNotes(notes);
    
    // 设置语言选择器为自动检测
    languageSelector.value = 'auto';
    
    loadNotes();
    loadNote(newNote.id);
    
    // 添加代码输入监听，实时检测语言
    setupCodeChangeListener();
}

// 设置代码变化监听器
function setupCodeChangeListener() {
    // 移除之前的监听器（如果有）
    codeEditor.off('change', detectLanguageOnChange);
    // 添加新的监听器
    codeEditor.on('change', detectLanguageOnChange);
}

// 代码变化时检测语言
function detectLanguageOnChange(cm, change) {
    // 只在语言设置为自动检测时执行
    if (languageSelector.value === 'auto') {
        // 获取当前代码
        const code = cm.getValue();
        // 如果代码长度超过一定阈值才进行检测（避免频繁检测）
        if (code.length > 10) {
            const newDetectedLanguage = detectLanguage(code);
            // 如果检测到的语言发生变化
            if (newDetectedLanguage !== detectedLanguage) {
                detectedLanguage = newDetectedLanguage;
                setEditorLanguage(detectedLanguage);
                // 显示检测到的语言
                showLanguageDetectionNotification(detectedLanguage);
                
                // 调试信息
                console.log('语言检测结果:', detectedLanguage);
                logLanguageScores(code);
            }
        }
    }
}

// 记录语言检测分数（用于调试）
function logLanguageScores(code) {
    if (!code || code.trim() === '') return;
    
    const scores = {};
    const codeLength = Math.max(100, code.length);
    
    // 初始化所有语言的分数
    for (const lang of Object.keys(languagePatterns)) {
        scores[lang] = 0;
    }
    
    // 特殊检测：HTML
    if (/<[a-z][^>]*>/i.test(code)) {
        const htmlTags = (code.match(/<[a-z][^>]*>/gi) || []).length;
        const closingTags = (code.match(/<\/[a-z][^>]*>/gi) || []).length;
        
        if (htmlTags > 0) {
            scores['html'] += Math.min(50, htmlTags * 5);
            
            // 如果有成对的标签，更可能是HTML
            if (closingTags > 0) {
                scores['html'] += Math.min(30, closingTags * 3);
            }
        }
    }
    
    // 特殊检测：CSS
    if (/{[^}]*}/g.test(code)) {
        const cssBlocks = (code.match(/{[^}]*}/g) || []).length;
        const cssProperties = (code.match(/[a-z-]+\s*:\s*[^;]+;/gi) || []).length;
        
        if (cssProperties > 0) {
            scores['css'] += Math.min(60, cssProperties * 4);
            
            // 如果有CSS块，更可能是CSS
            if (cssBlocks > 0) {
                scores['css'] += Math.min(40, cssBlocks * 5);
            }
        }
    }
    
    // 特殊检测：JavaScript
    const jsKeywords = (code.match(/\b(const|let|var|function|=>|class|if|else|for|while|return)\b/g) || []).length;
    if (jsKeywords > 0) {
        scores['javascript'] += Math.min(70, jsKeywords * 5);
        
        // 检查是否有JavaScript特有的语法
        if (/=>/g.test(code)) {
            scores['javascript'] += 15;
        }
        
        if (/\${[^}]*}/g.test(code)) {
            scores['javascript'] += 10;
        }
    }
    
    // 特殊检测：Markdown
    const mdPatterns = (code.match(/^(#{1,6}\s|[*-]\s|\d+\.\s|>\s|```)/gm) || []).length;
    if (mdPatterns > 0) {
        scores['markdown'] += Math.min(80, mdPatterns * 10);
    }
    
    // 特殊检测：JSON
    if (/^[\s\n]*[{[]/.test(code) && /"[^"]+"\s*:/.test(code)) {
        const jsonPairs = (code.match(/"[^"]+"\s*:/g) || []).length;
        scores['json'] += Math.min(80, jsonPairs * 5);
        
        // 如果没有JavaScript关键字，更可能是JSON
        if (jsKeywords === 0) {
            scores['json'] += 20;
        }
    }
    
    // 对每种语言进行模式匹配
    for (const [lang, pattern] of Object.entries(languagePatterns)) {
        const matches = (code.match(pattern) || []).length;
        
        // 根据匹配数量和代码长度计算分数
        const normalizedScore = Math.min(50, (matches / (codeLength / 100)) * 10);
        scores[lang] += normalizedScore;
    }
    
    // 语言特定的额外规则
    if (scores['html'] > 0 && scores['javascript'] > 0) {
        // 如果同时包含HTML和JS，检查哪个更主要
        if (scores['html'] > scores['javascript'] * 1.5) {
            scores['html'] += 20;
        } else if (scores['javascript'] > scores['html'] * 1.5) {
            scores['javascript'] += 20;
        }
    }
    
    if (scores['css'] > 0 && scores['html'] > 0) {
        // 如果同时包含CSS和HTML，检查哪个更主要
        if (scores['css'] > scores['html'] * 2) {
            scores['css'] += 20;
        }
    }
    
    // 找出得分最高的语言
    let bestMatch = 'javascript'; // 默认为JavaScript
    let highestScore = 0;
    
    for (const [lang, score] of Object.entries(scores)) {
        if (score > highestScore) {
            highestScore = score;
            bestMatch = lang;
        }
    }
    
    // 如果最高分太低，默认为JavaScript
    if (highestScore < 10 && code.length > 20) {
        // 尝试一些简单的启发式规则
        if (/<[^>]+>/.test(code)) {
            return 'html';
        }
        if (/{[^}]+}/.test(code) && /[a-z-]+\s*:/.test(code)) {
            return 'css';
        }
        return 'javascript';
    }
    
    // 记录检测结果（调试用）
    console.log('语言检测结果:', bestMatch, '分数:', highestScore);
    
    return bestMatch;
}

// 显示语言检测通知
function showLanguageDetectionNotification(language) {
    // 获取当前代码
    const code = codeEditor.getValue();
    
    // 如果没有代码，不显示通知
    if (!code || code.trim() === '') {
        return;
    }
    
    // 创建或更新语言检测状态显示
    let langStatus = document.getElementById('language-detection-status');
    
    if (!langStatus) {
        langStatus = document.createElement('div');
        langStatus.id = 'language-detection-status';
        langStatus.className = 'language-status';
        document.querySelector('.code-editor-container').appendChild(langStatus);
    }
    
    // 获取语言的显示名称
    const languageDisplayName = getLanguageDisplayName(language);
    
    // 添加语言图标
    const languageIcon = getLanguageIcon(language.toLowerCase());
    langStatus.innerHTML = `${languageIcon} <span style="margin-left:5px;">检测到: ${languageDisplayName}</span>`;
    
    // 显示通知
    showNotification(`已自动检测到 ${languageDisplayName} 语言`, 'info');
    
    // 添加淡出效果
    langStatus.classList.add('show');
    setTimeout(() => {
        langStatus.classList.remove('show');
    }, 3000);
    
    // 在标签名下显示检测到的语言
    updateLanguageDisplay(languageDisplayName);
    
    // 更新语言选择器的提示
    languageSelector.title = `当前检测到的语言: ${languageDisplayName}`;
}

// 在标签名下显示检测到的语言
function updateLanguageDisplay(languageName) {
    // 获取当前代码
    const code = codeEditor.getValue();
    
    // 更新标题下方的语言显示
    let languageDisplay = document.getElementById('detected-language-display');
    
    // 如果没有代码，隐藏语言显示区域
    if (!code || code.trim() === '') {
        if (languageDisplay) {
            languageDisplay.style.display = 'none';
        }
        return;
    }
    
    if (!languageDisplay) {
        languageDisplay = document.createElement('div');
        languageDisplay.id = 'detected-language-display';
        languageDisplay.className = 'detected-language';
        
        // 插入到标题下方
        const editorHeader = document.querySelector('.editor-header');
        editorHeader.insertAdjacentElement('afterend', languageDisplay);
    }
    
    // 显示语言区域
    languageDisplay.style.display = 'flex';
    
    // 添加语言图标
    const languageIcon = getLanguageIcon(languageName.toLowerCase());
    
    // 获取语言对应的颜色
    const languageColor = getLanguageColor(languageName.toLowerCase());
    
    languageDisplay.innerHTML = `
        ${languageIcon} 
        <span style="margin-left:8px;">当前语言: <strong style="color:${languageColor};">${languageName}</strong></span>
    `;
    
    // 添加淡入效果
    languageDisplay.classList.add('fade-in');
    setTimeout(() => {
        languageDisplay.classList.remove('fade-in');
    }, 500);
    
    // 更新笔记列表中的语言显示
    if (currentNoteId) {
        const noteItems = document.querySelectorAll('.note-item');
        noteItems.forEach(item => {
            if (item.dataset.id === currentNoteId) {
                const langElement = item.querySelector('.note-item-language');
                if (langElement) {
                    langElement.textContent = languageName;
                    langElement.style.color = languageColor;
                    langElement.style.fontWeight = 'bold';
                }
            }
        });
    }
}

// 获取语言对应的图标
function getLanguageIcon(language) {
    // 标准的编程语言颜色方案
    const icons = {
        'javascript': '<span style="color:#F0DB4F; background-color:#323330; padding:2px 4px; border-radius:3px;">JS</span>',
        'python': '<span style="color:#FFD43B; background-color:#306998; padding:2px 4px; border-radius:3px;">Py</span>',
        'html': '<span style="color:#FFFFFF; background-color:#E34C26; padding:2px 4px; border-radius:3px;">HTML</span>',
        'css': '<span style="color:#FFFFFF; background-color:#264DE4; padding:2px 4px; border-radius:3px;">CSS</span>',
        'java': '<span style="color:#FFFFFF; background-color:#007396; padding:2px 4px; border-radius:3px;">Java</span>',
        'cpp': '<span style="color:#FFFFFF; background-color:#00599C; padding:2px 4px; border-radius:3px;">C++</span>',
        'csharp': '<span style="color:#FFFFFF; background-color:#239120; padding:2px 4px; border-radius:3px;">C#</span>',
        'php': '<span style="color:#FFFFFF; background-color:#777BB4; padding:2px 4px; border-radius:3px;">PHP</span>',
        'ruby': '<span style="color:#FFFFFF; background-color:#CC342D; padding:2px 4px; border-radius:3px;">Ruby</span>',
        'go': '<span style="color:#FFFFFF; background-color:#00ADD8; padding:2px 4px; border-radius:3px;">Go</span>',
        'rust': '<span style="color:#FFFFFF; background-color:#DEA584; padding:2px 4px; border-radius:3px;">Rust</span>',
        'swift': '<span style="color:#000000; background-color:#FFAC45; padding:2px 4px; border-radius:3px;">Swift</span>',
        'typescript': '<span style="color:#FFFFFF; background-color:#007ACC; padding:2px 4px; border-radius:3px;">TS</span>',
        'kotlin': '<span style="color:#FFFFFF; background-color:#F18E33; padding:2px 4px; border-radius:3px;">Kotlin</span>',
        'sql': '<span style="color:#FFFFFF; background-color:#E38C00; padding:2px 4px; border-radius:3px;">SQL</span>',
        'shell': '<span style="color:#FFFFFF; background-color:#4EAA25; padding:2px 4px; border-radius:3px;">Shell</span>',
        'yaml': '<span style="color:#FFFFFF; background-color:#CB171E; padding:2px 4px; border-radius:3px;">YAML</span>',
        'json': '<span style="color:#FFFFFF; background-color:#000000; padding:2px 4px; border-radius:3px;">JSON</span>',
        'markdown': '<span style="color:#FFFFFF; background-color:#083FA1; padding:2px 4px; border-radius:3px;">MD</span>'
    };
    
    // 为未知语言创建一个默认样式
    return icons[language.toLowerCase()] || 
        `<span style="color:#FFFFFF; background-color:#808080; padding:2px 4px; border-radius:3px;">${language.toUpperCase()}</span>`;
}

// 获取语言的显示名称
function getLanguageDisplayName(languageKey) {
    const languageOptions = languageSelector.options;
    for (let i = 0; i < languageOptions.length; i++) {
        if (languageOptions[i].value === languageKey) {
            return languageOptions[i].textContent;
        }
    }
    return languageKey.charAt(0).toUpperCase() + languageKey.slice(1);
}

// 保存当前笔记
function saveCurrentNote() {
    if (!currentNoteId) return;
    
    const notes = getNotes();
    const noteIndex = notes.findIndex(n => n.id === currentNoteId);
    
    if (noteIndex === -1) return;
    
    // 获取标签数组
    const tags = tagsInput.value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
    
    // 如果是自动检测语言，则进行检测
    let language = languageSelector.value;
    if (language === 'auto') {
        const detectedLanguage = detectLanguage(codeEditor.getValue());
        setEditorLanguage(detectedLanguage);
    }
    
    // 更新笔记
    notes[noteIndex] = {
        ...notes[noteIndex],
        title: noteTitle.value,
        language: language,
        code: codeEditor.getValue(),
        description: noteDescription.value,
        tags: tags,
        updatedAt: new Date().toISOString()
    };
    
    saveNotes(notes);
    loadNotes();
    
    // 显示保存成功提示
    showNotification('笔记已保存');
}

// 删除当前笔记
function deleteCurrentNote() {
    if (!currentNoteId) return;
    
    if (!confirm('确定要删除这个笔记吗？此操作不可撤销。')) {
        return;
    }
    
    const notes = getNotes();
    const filteredNotes = notes.filter(n => n.id !== currentNoteId);
    
    saveNotes(filteredNotes);
    
    currentNoteId = null;
    clearEditor();
    loadNotes();
    
    // 显示删除成功提示
    showNotification('笔记已删除');
}

// 清空编辑器
function clearEditor() {
    noteTitle.value = '';
    tagsInput.value = '';
    noteDescription.value = '';
    codeEditor.setValue('');
    
    // 隐藏语言显示
    const languageDisplay = document.getElementById('detected-language-display');
    if (languageDisplay) {
        languageDisplay.style.display = 'none';
    }
}

// 搜索笔记
function searchNotes() {
    const searchTerm = searchInput.value.toLowerCase();
    const notes = getNotes();
    
    if (!searchTerm) {
        renderNotesList(notes);
        return;
    }
    
    const filteredNotes = notes.filter(note => {
        const titleMatch = note.title && note.title.toLowerCase().includes(searchTerm);
        const codeMatch = note.code && note.code.toLowerCase().includes(searchTerm);
        const descMatch = note.description && note.description.toLowerCase().includes(searchTerm);
        const tagMatch = note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        
        return titleMatch || codeMatch || descMatch || tagMatch;
    });
    
    renderNotesList(filteredNotes);
}

// 按标签筛选笔记
function filterNotesByTag(tag) {
    const notes = getNotes();
    
    const filteredNotes = notes.filter(note => {
        return note.tags && note.tags.includes(tag);
    });
    
    renderNotesList(filteredNotes);
    searchInput.value = `#${tag}`;
}

// 更改代码语言
function changeLanguage() {
    const language = languageSelector.value;
    
    if (language === 'auto' && codeEditor.getValue()) {
        const detectedLang = detectLanguage(codeEditor.getValue());
        detectedLanguage = detectedLang; // 更新全局变量
        setEditorLanguage(detectedLang);
        
        // 显示检测到的语言
        const languageDisplayName = getLanguageDisplayName(detectedLang);
        updateLanguageDisplay(languageDisplayName);
        
        // 更新语言选择器的样式
        updateLanguageSelectorStyle(detectedLang);
    } else {
        setEditorLanguage(language);
        
        // 显示选择的语言
        const languageDisplayName = getLanguageDisplayName(language);
        updateLanguageDisplay(languageDisplayName);
        
        // 更新语言选择器的样式
        updateLanguageSelectorStyle(language);
    }
}

// 更新语言选择器的样式
function updateLanguageSelectorStyle(language) {
    // 获取语言颜色
    const color = getLanguageColor(language);
    
    // 设置选择器的边框颜色
    languageSelector.style.borderColor = color;
    languageSelector.style.boxShadow = `0 0 0 1px ${color}`;
    
    // 设置选择器的文本颜色
    if (language !== 'auto') {
        languageSelector.style.color = color;
        languageSelector.style.fontWeight = 'bold';
    } else {
        languageSelector.style.color = '';
        languageSelector.style.fontWeight = '';
    }
}

// 设置编辑器语言模式
function setEditorLanguage(language) {
    // 设置CodeMirror的语言模式
    switch (language) {
        case 'javascript':
            codeEditor.setOption('mode', 'javascript');
            break;
        case 'python':
            codeEditor.setOption('mode', 'python');
            break;
        case 'html':
            codeEditor.setOption('mode', 'xml');
            break;
        case 'css':
            codeEditor.setOption('mode', 'css');
            break;
        case 'java':
            codeEditor.setOption('mode', 'text/x-java');
            break;
        case 'cpp':
            codeEditor.setOption('mode', 'text/x-c++src');
            break;
        case 'csharp':
            codeEditor.setOption('mode', 'text/x-csharp');
            break;
        case 'php':
            codeEditor.setOption('mode', 'application/x-httpd-php');
            break;
        case 'ruby':
            codeEditor.setOption('mode', 'ruby');
            break;
        case 'go':
            codeEditor.setOption('mode', 'go');
            break;
        case 'rust':
            codeEditor.setOption('mode', 'rust');
            break;
        case 'swift':
            codeEditor.setOption('mode', 'swift');
            break;
        case 'typescript':
            codeEditor.setOption('mode', 'text/typescript');
            break;
        case 'sql':
            codeEditor.setOption('mode', 'text/x-sql');
            break;
        case 'shell':
            codeEditor.setOption('mode', 'shell');
            break;
        case 'yaml':
            codeEditor.setOption('mode', 'yaml');
            break;
        case 'json':
            codeEditor.setOption('mode', 'application/json');
            break;
        case 'markdown':
            codeEditor.setOption('mode', 'markdown');
            break;
        default:
            codeEditor.setOption('mode', 'javascript');
    }
}

// 自动检测代码语言
function detectLanguage(code) {
    if (!code || code.trim() === '') return 'javascript';
    
    // 首先进行一些简单的快速检测
    
    // JavaScript 快速检测 - 优先检查JS，避免被HTML误判
    if (/^\s*(const|let|var|function|class|import|export|async|await)\s+/m.test(code) || 
        /\b(document\.|window\.|console\.log|setTimeout|Promise\.|new Promise|fetch\(|async function|=>\s*{)/m.test(code)) {
        return 'javascript';
    }
    
    // HTML 快速检测
    if (/<html|<!DOCTYPE html|<head|<body/i.test(code)) {
        return 'html';
    }
    
    // CSS 快速检测
    if (/^\s*(\.[a-zA-Z]|#[a-zA-Z]|body|html|@media|@keyframes)/m.test(code) && 
        /\{\s*[a-zA-Z-]+\s*:\s*[^;]+;/.test(code)) {
        return 'css';
    }
    
    // Markdown 快速检测
    if (/^#\s|^##\s|^>\s|^\*\s|^-\s|^[0-9]+\.\s|^```/m.test(code)) {
        return 'markdown';
    }
    
    // JSON 快速检测
    if (/^\s*[\{\[]/.test(code) && /"[^"]+"\s*:/.test(code) && 
        !/function|if|for|while|var|let|const/.test(code)) {
        return 'json';
    }
    
    // 检查文件扩展名模式
    const extensionMatch = code.match(/\.([a-zA-Z0-9]+)$/m);
    if (extensionMatch) {
        const extension = extensionMatch[1].toLowerCase();
        for (const [lang, extensions] of Object.entries(languageMap)) {
            if (extensions.includes(extension)) {
                return lang;
            }
        }
    }
    
    // 使用语言特征模式检测
    const scores = {};
    const codeLength = Math.max(100, code.length); // 防止短代码导致分数过高
    
    // 初始化所有语言的分数
    for (const lang of Object.keys(languagePatterns)) {
        scores[lang] = 0;
    }
    
    // 特殊检测：JavaScript
    const jsKeywords = (code.match(/\b(const|let|var|function|=>|class|if|else|for|while|return|this|new|document|window)\b/g) || []).length;
    if (jsKeywords > 0) {
        scores['javascript'] += Math.min(70, jsKeywords * 5);
        
        // 检查是否有JavaScript特有的语法
        if (/=>/g.test(code)) {
            scores['javascript'] += 15;
        }
        
        if (/\${[^}]*}/g.test(code)) {
            scores['javascript'] += 10;
        }
        
        // 检查是否有DOM操作
        if (/document\.get|document\.query|addEventListener|innerHTML|appendChild/g.test(code)) {
            scores['javascript'] += 20;
        }
    }
    
    // 特殊检测：HTML
    if (/<[a-z][^>]*>/i.test(code)) {
        const htmlTags = (code.match(/<[a-z][^>]*>/gi) || []).length;
        const closingTags = (code.match(/<\/[a-z][^>]*>/gi) || []).length;
        
        if (htmlTags > 0) {
            scores['html'] += Math.min(50, htmlTags * 5);
            
            // 如果有成对的标签，更可能是HTML
            if (closingTags > 0) {
                scores['html'] += Math.min(30, closingTags * 3);
            }
        }
        
        // 如果代码中有大量JS关键字，可能是包含JS的HTML
        if (jsKeywords > 5 && htmlTags > 5) {
            // 检查是否有<script>标签
            if (/<script/i.test(code)) {
                // 如果有script标签，根据比例决定是JS还是HTML
                const scriptContent = code.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
                if (scriptContent && scriptContent.join('').length > code.length * 0.5) {
                    scores['javascript'] += 30;
                } else {
                    scores['html'] += 20;
                }
            }
        }
    }
    
    // 特殊检测：CSS
    if (/{[^}]*}/g.test(code)) {
        const cssBlocks = (code.match(/{[^}]*}/g) || []).length;
        const cssProperties = (code.match(/[a-z-]+\s*:\s*[^;]+;/gi) || []).length;
        
        if (cssProperties > 0) {
            scores['css'] += Math.min(60, cssProperties * 4);
            
            // 如果有CSS块，更可能是CSS
            if (cssBlocks > 0) {
                scores['css'] += Math.min(40, cssBlocks * 5);
            }
        }
    }
    
    // 特殊检测：Markdown
    const mdPatterns = (code.match(/^(#{1,6}\s|[*-]\s|\d+\.\s|>\s|```)/gm) || []).length;
    if (mdPatterns > 0) {
        scores['markdown'] += Math.min(80, mdPatterns * 10);
    }
    
    // 特殊检测：JSON
    if (/^[\s\n]*[{[]/.test(code) && /"[^"]+"\s*:/g.test(code)) {
        const jsonPairs = (code.match(/"[^"]+"\s*:/g) || []).length;
        scores['json'] += Math.min(80, jsonPairs * 5);
        
        // 如果没有JavaScript关键字，更可能是JSON
        if (jsKeywords === 0) {
            scores['json'] += 20;
        }
    }
    
    // 对每种语言进行模式匹配
    for (const [lang, pattern] of Object.entries(languagePatterns)) {
        const matches = (code.match(pattern) || []).length;
        
        // 根据匹配数量和代码长度计算分数
        const normalizedScore = Math.min(50, (matches / (codeLength / 100)) * 10);
        scores[lang] += normalizedScore;
    }
    
    // 语言特定的额外规则
    if (scores['html'] > 0 && scores['javascript'] > 0) {
        // 如果同时包含HTML和JS，检查哪个更主要
        if (scores['html'] > scores['javascript'] * 1.5) {
            scores['html'] += 20;
        } else if (scores['javascript'] > scores['html'] * 1.5) {
            scores['javascript'] += 20;
        }
        
        // 如果代码中包含div但也包含大量JS关键字，优先判断为JS
        if (/<div/i.test(code) && jsKeywords > 10) {
            scores['javascript'] += 15;
        }
    }
    
    if (scores['css'] > 0 && scores['html'] > 0) {
        // 如果同时包含CSS和HTML，检查哪个更主要
        if (scores['css'] > scores['html'] * 2) {
            scores['css'] += 20;
        }
    }
    
    // 找出得分最高的语言
    let bestMatch = 'javascript'; // 默认为JavaScript
    let highestScore = 0;
    
    for (const [lang, score] of Object.entries(scores)) {
        if (score > highestScore) {
            highestScore = score;
            bestMatch = lang;
        }
    }
    
    // 如果最高分太低，默认为JavaScript
    if (highestScore < 10 && code.length > 20) {
        // 尝试一些简单的启发式规则
        if (/<[^>]+>/.test(code) && !jsKeywords) {
            return 'html';
        }
        if (/{[^}]+}/.test(code) && /[a-z-]+\s*:/.test(code) && !jsKeywords) {
            return 'css';
        }
        return 'javascript';
    }
    
    // 记录检测结果（调试用）
    console.log('语言检测结果:', bestMatch, '分数:', highestScore);
    console.log('语言得分详情:', scores);
    
    return bestMatch;
}

// 更改编辑器主题
function changeEditorTheme() {
    const theme = themeSelector.value;
    codeEditor.setOption('theme', theme);
    localStorage.setItem('editorTheme', theme);
}

// 切换暗黑模式
function toggleDarkMode() {
    if (isDarkMode) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

// 启用暗黑模式
function enableDarkMode() {
    document.body.classList.add('dark-theme');
    themeIcon.textContent = '☀️';
    isDarkMode = true;
    localStorage.setItem('darkMode', 'true');
    
    // 如果编辑器主题是默认的，自动切换到暗色主题
    if (themeSelector.value === 'default') {
        themeSelector.value = 'dracula';
        changeEditorTheme();
    }
}

// 禁用暗黑模式
function disableDarkMode() {
    document.body.classList.remove('dark-theme');
    themeIcon.textContent = '🌙';
    isDarkMode = false;
    localStorage.setItem('darkMode', 'false');
    
    // 如果编辑器主题是暗色的，自动切换到默认主题
    if (themeSelector.value === 'dracula') {
        themeSelector.value = 'default';
        changeEditorTheme();
    }
}

// 格式化代码
function formatCode() {
    const language = languageSelector.value === 'auto' 
        ? detectLanguage(codeEditor.getValue()) 
        : languageSelector.value;
    
    let formattedCode = codeEditor.getValue();
    
    try {
        switch (language) {
            case 'javascript':
            case 'typescript':
            case 'json':
                formattedCode = js_beautify(codeEditor.getValue(), {
                    indent_size: 2,
                    space_in_empty_paren: true
                });
                break;
            case 'html':
            case 'xml':
                formattedCode = html_beautify(codeEditor.getValue(), {
                    indent_size: 2,
                    max_preserve_newlines: 1
                });
                break;
            case 'css':
                formattedCode = css_beautify(codeEditor.getValue(), {
                    indent_size: 2
                });
                break;
            default:
                // 对于其他语言，我们保持原样
                showNotification('当前语言不支持格式化', 'warning');
                return;
        }
        
        codeEditor.setValue(formattedCode);
        showNotification('代码已格式化');
    } catch (error) {
        console.error('格式化代码时出错:', error);
        showNotification('格式化代码时出错', 'error');
    }
}

// 显示通知
function showNotification(message, type = 'success') {
    // 移除现有通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // 添加图标
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle" style="color: var(--success-color);"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle" style="color: var(--danger-color);"></i>';
            break;
        case 'info':
            icon = '<i class="fas fa-info-circle" style="color: var(--info-color);"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle" style="color: var(--warning-color);"></i>';
            break;
    }
    
    notification.innerHTML = `${icon} <span>${message}</span>`;
    
    // 添加到文档
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自动隐藏通知
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 添加复制代码按钮
function addCopyCodeButton() {
    const copyBtn = document.createElement('button');
    copyBtn.id = 'copy-code-btn';
    copyBtn.className = 'copy-code-btn';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.title = '复制代码';
    
    // 添加到编辑器容器
    document.querySelector('.code-editor-container').appendChild(copyBtn);
    
    // 添加点击事件
    copyBtn.addEventListener('click', copyCodeToClipboard);
}

// 复制代码到剪贴板
function copyCodeToClipboard() {
    const code = codeEditor.getValue();
    
    if (!code) {
        showNotification('没有可复制的代码', 'warning');
        return;
    }
    
    // 使用 navigator.clipboard API 复制文本
    navigator.clipboard.writeText(code)
        .then(() => {
            showNotification('代码已复制到剪贴板', 'success');
            
            // 添加复制成功动画
            const copyBtn = document.getElementById('copy-code-btn');
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                copyBtn.classList.remove('copied');
            }, 1500);
        })
        .catch(err => {
            console.error('复制失败:', err);
            showNotification('复制失败，请手动复制', 'error');
        });
}

// 更新标签云
function updateTagCloud() {
    if (!tagCloud) return;
    
    tagCloud.innerHTML = '';
    
    const notes = getNotes();
    const tags = getAllTags(notes);
    
    // 计算标签频率
    const tagFrequency = {};
    tags.forEach(tag => {
        tagFrequency[tag] = 0;
        notes.forEach(note => {
            if (note.tags && note.tags.includes(tag)) {
                tagFrequency[tag]++;
            }
        });
    });
    
    // 确定标签大小级别 (1-5)
    const maxFrequency = Math.max(...Object.values(tagFrequency), 1);
    
    // 创建标签云元素
    Object.entries(tagFrequency).forEach(([tag, frequency]) => {
        const sizeLevel = Math.ceil((frequency / maxFrequency) * 5);
        
        const tagItem = document.createElement('div');
        tagItem.className = `tag-cloud-item size-${sizeLevel}`;
        tagItem.textContent = tag;
        tagItem.addEventListener('click', () => filterNotesByTag(tag));
        
        // 为不同标签分配不同颜色
        const hue = Math.floor(Math.random() * 360);
        tagItem.style.borderColor = `hsl(${hue}, 70%, 60%)`;
        tagItem.style.color = `hsl(${hue}, 70%, 40%)`;
        
        tagCloud.appendChild(tagItem);
    });
}

// 更改颜色主题
function changeColorTheme() {
    const theme = colorThemeSelector.value;
    
    // 移除所有主题类
    document.body.classList.remove('theme-blue', 'theme-purple', 'theme-green', 'theme-orange', 'theme-red');
    
    // 添加选择的主题类
    document.body.classList.add(theme);
    
    // 保存到本地存储
    localStorage.setItem('colorTheme', theme);
}

// 更改编辑器字体
function changeEditorFont() {
    const font = fontSelector.value;
    
    // 更新编辑器字体
    const editorElement = document.querySelector('.CodeMirror');
    if (editorElement) {
        editorElement.style.fontFamily = `${font}, monospace`;
    }
    
    // 保存到本地存储
    localStorage.setItem('editorFont', font);
}

// 增加缩进
function indentCode() {
    const selection = codeEditor.getSelection();
    
    if (selection) {
        // 如果有选中文本，增加选中行的缩进
        codeEditor.execCommand('indentMore');
    } else {
        // 如果没有选中文本，在光标位置插入空格
        codeEditor.execCommand('insertSoftTab');
    }
}

// 减少缩进
function outdentCode() {
    codeEditor.execCommand('indentLess');
}

// 切换注释
function toggleComment() {
    const mode = codeEditor.getOption('mode');
    let commentStart = '// ';
    let commentEnd = '';
    
    // 根据语言设置注释符号
    if (mode === 'python' || mode === 'shell') {
        commentStart = '# ';
    } else if (mode === 'xml' || mode === 'html') {
        commentStart = '<!-- ';
        commentEnd = ' -->';
    } else if (mode === 'css') {
        commentStart = '/* ';
        commentEnd = ' */';
    }
    
    const selection = codeEditor.getSelection();
    const cursor = codeEditor.getCursor();
    
    if (selection) {
        // 检查选中文本是否已经被注释
        if (selection.startsWith(commentStart) && selection.endsWith(commentEnd)) {
            // 如果已注释，则取消注释
            codeEditor.replaceSelection(selection.substring(commentStart.length, selection.length - commentEnd.length));
        } else {
            // 如果未注释，则添加注释
            codeEditor.replaceSelection(commentStart + selection + commentEnd);
        }
    } else {
        // 如果没有选中文本，注释当前行
        const line = codeEditor.getLine(cursor.line);
        const isCommented = line.trimStart().startsWith(commentStart);
        
        if (isCommented) {
            // 取消注释
            const commentIndex = line.indexOf(commentStart);
            const newLine = line.substring(0, commentIndex) + line.substring(commentIndex + commentStart.length);
            codeEditor.replaceRange(newLine, {line: cursor.line, ch: 0}, {line: cursor.line, ch: line.length});
        } else {
            // 添加注释
            const indentation = line.match(/^\s*/)[0];
            const newLine = indentation + commentStart + line.trimStart();
            codeEditor.replaceRange(newLine, {line: cursor.line, ch: 0}, {line: cursor.line, ch: line.length});
        }
    }
}

// 折叠/展开代码
function toggleFold() {
    const cursor = codeEditor.getCursor();
    codeEditor.foldCode(cursor);
}

// 在代码中搜索
function searchInCode() {
    const searchTerm = prompt('请输入要搜索的内容:');
    if (!searchTerm) return;
    
    // 创建搜索光标
    const cursor = codeEditor.getSearchCursor(searchTerm);
    
    // 查找第一个匹配项
    if (cursor.findNext()) {
        codeEditor.setSelection(cursor.from(), cursor.to());
        codeEditor.scrollIntoView({from: cursor.from(), to: cursor.to()}, 20);
    } else {
        showNotification('未找到匹配项', 'info');
    }
}

// 在代码中替换
function replaceInCode() {
    const searchTerm = prompt('请输入要搜索的内容:');
    if (!searchTerm) return;
    
    const replaceTerm = prompt('请输入要替换的内容:');
    if (replaceTerm === null) return; // 用户取消
    
    // 创建搜索光标
    const cursor = codeEditor.getSearchCursor(searchTerm);
    
    let count = 0;
    // 查找并替换所有匹配项
    while (cursor.findNext()) {
        cursor.replace(replaceTerm);
        count++;
    }
    
    if (count > 0) {
        showNotification(`已替换 ${count} 处匹配项`, 'success');
    } else {
        showNotification('未找到匹配项', 'info');
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 获取语言对应的颜色
function getLanguageColor(language) {
    const colors = {
        'javascript': '#F0DB4F',
        'python': '#306998',
        'html': '#E34C26',
        'css': '#264DE4',
        'java': '#007396',
        'cpp': '#00599C',
        'csharp': '#239120',
        'php': '#777BB4',
        'ruby': '#CC342D',
        'go': '#00ADD8',
        'rust': '#DEA584',
        'swift': '#FFAC45',
        'typescript': '#007ACC',
        'kotlin': '#F18E33',
        'sql': '#E38C00',
        'shell': '#4EAA25',
        'yaml': '#CB171E',
        'json': '#000000',
        'markdown': '#083FA1'
    };
    
    return colors[language.toLowerCase()] || '#808080';
} 