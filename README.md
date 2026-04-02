# Academic CV Editor

欧美学术风格简历编辑器 - 基于 TypeScript + React + Vite

## 功能特性

- **左右分栏布局**: 左侧 JSON 编辑器，右侧实时预览
- **JSON 代码编辑器**:
  - Monaco Editor 支持语法高亮
  - 实时语法校验
  - 一键格式化 (Ctrl+S)
  - 重置模板
- **实时预览**: JSON 修改后秒级同步更新
- **学术风格**: 极简正式、适配欧美院校申请、留学递交、打印导出
- **TS 强类型**: 完整的简历数据结构定义，支持教育/科研/论文/实习/奖项等模块
- **PDF 导出**: 一键导出 A4 格式 PDF (Ctrl+Enter)
- **配置选项**: 字体大小、分隔线显示

## 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite
- **编辑器**: Monaco Editor (@monaco-editor/react)
- **PDF 导出**: html2pdf.js
- **图标**: lucide-react

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 数据结构

简历数据通过 JSON 维护，包含以下模块:

```typescript
interface ResumeData {
  personalInfo: PersonalInfo;      // 个人信息
  education: Education[];          // 教育背景
  researchExperience: ResearchExperience[];  // 科研经历
  publications: Publication[];     // 论文发表
  internshipExperience: InternshipExperience[]; // 实习经历
  projectExperience: ProjectExperience[]; // 项目经历
  awards: Award[];                 // 奖项荣誉
  skills: Skill[];                 // 技能
  academicService: AcademicService[]; // 学术服务
  config: ResumeConfig;            // 排版配置
}
```

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl+S | 格式化 JSON |
| Ctrl+Enter | 导出 PDF |

## 项目结构

```
academic-cv-editor/
├── src/
│   ├── types/
│   │   └── resume.ts        # TypeScript 类型定义
│   ├── components/
│   │   ├── JSONEditor.tsx   # JSON 编辑器组件
│   │   └── ResumePreview.tsx # 简历预览组件
│   ├── App.tsx              # 主应用组件
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── package.json
└── tsconfig.json
```

## License

MIT
