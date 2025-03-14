# 代码笔记应用

一个简单但功能强大的代码笔记Web应用，用于保存和管理代码片段。

## 功能特点

### 代码格式化和高亮
- 自动识别代码语言
- 进行适当的代码格式化
- 确保代码缩进正确
- 保持代码的可读性
- 支持20多种编程语言

### 代码解释
- 为代码片段添加简明的中文注释
- 解释代码的核心逻辑
- 标注重要的知识点
- 记录代码的使用场景

### 笔记整理
- 建议合适的标签分类
- 关联相似的代码片段
- 提醒可能需要更新的过时代码
- 帮助整理常用代码模板

### 新增功能
- **自动识别语言**：智能检测代码语言类型，显示标准语言图标
- **暗黑主题**：支持明亮/暗黑模式切换
- **编辑器主题**：多种编辑器主题可选
- **颜色主题**：多种应用颜色主题（蓝色、紫色、绿色、橙色、红色）
- **代码格式化**：一键美化代码格式
- **毛玻璃效果**：现代化UI设计
- **响应式布局**：适配不同屏幕尺寸
- **标签云**：根据标签使用频率动态显示标签大小
- **悬浮工具栏**：提供快捷编辑功能（缩进、注释、折叠等）
- **代码搜索替换**：在代码中快速查找和替换内容
- **字体选择器**：选择不同的编程字体
- **增强通知**：美观的通知提示，支持不同类型（成功、错误、警告、信息）
- **动画效果**：平滑的过渡动画和微交互
- **打印样式**：优化的打印布局

## 支持的语言

- JavaScript
- Python
- HTML
- CSS
- Java
- C++
- C#
- PHP
- Ruby
- Go
- Rust
- Swift
- TypeScript
- Kotlin
- SQL
- Shell/Bash
- YAML
- JSON
- Markdown
- 以及更多...

## 使用方法

1. 直接在浏览器中打开 `index.html` 文件
2. 点击"新建笔记"按钮创建新的代码笔记
3. 选择代码语言（或使用"自动检测"功能）
4. 在编辑器中输入代码
5. 添加笔记标题、标签和描述
6. 点击"保存"按钮保存笔记
7. 使用右上角的月亮/太阳图标切换暗黑/明亮模式
8. 使用主题选择器更改编辑器主题和颜色主题
9. 使用悬浮工具栏快速编辑代码
10. 使用标签云查看和筛选笔记

## 快捷功能

### 悬浮工具栏
- **增加缩进**：增加选中代码的缩进
- **减少缩进**：减少选中代码的缩进
- **注释/取消注释**：根据语言类型添加或移除注释
- **折叠/展开代码**：折叠或展开代码块
- **搜索代码**：在当前代码中搜索内容
- **替换**：在当前代码中查找并替换内容

### 其他功能
- **复制代码**：一键复制全部代码
- **标签筛选**：点击标签筛选相关笔记
- **搜索笔记**：根据标题、内容、标签搜索笔记
- **字体选择**：选择不同的编程字体
- **颜色主题**：选择不同的应用颜色主题

## 数据存储

所有笔记数据都保存在浏览器的本地存储（localStorage）中，不会上传到任何服务器。这意味着：

- 数据在本地保存，不会丢失
- 清除浏览器数据会导致笔记丢失
- 不同浏览器或设备之间不会同步数据

## 技术栈

- HTML5
- CSS3 (变量、Flexbox、Grid、动画)
- JavaScript (ES6+)
- CodeMirror (代码编辑器)
- Font Awesome (图标库)
- Google Fonts (字体)
- localStorage (本地数据存储)
- js-beautify (代码格式化)

## 浏览器兼容性

支持所有现代浏览器，包括：
- Chrome
- Firefox
- Edge
- Safari

## 本地部署

1. 下载所有文件（index.html, styles.css, app.js）
2. 将它们放在同一个目录中
3. 在浏览器中打开 index.html 文件

无需安装任何依赖或运行任何服务器，直接在浏览器中打开即可使用。 
