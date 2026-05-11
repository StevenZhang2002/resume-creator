// 学术简历 JSON 类型定义 - 欧美院校申请风格

// 个人信息
export interface PersonalInfo {
  name: string;                    // 姓名（全大写，如：BOWEN ZHANG）
  email: string;                   // 邮箱
  phone: string;                   // 电话（含国际区号，如：+86 138-0000-0000）
  address?: string;                // 地址（可选）
  website?: string;                // 个人网站/主页
  github?: string;                 // GitHub 链接
  linkedin?: string;               // LinkedIn 链接
  researchGate?: string;           // ResearchGate 链接（学术向）
  googleScholar?: string;          // Google Scholar 链接（学术向）
}

// 教育背景
export interface Education {
  institution: string;             // 学校名称
  degree: string;                  // 学位（如：Bachelor of Science, Master of Arts）
  major: string;                   // 专业
  location: string;                // 学校地点
  startDate: string;               // 开始日期（YYYY-MM）
  endDate?: string;                // 结束日期（YYYY-MM 或 Expected YYYY-MM）
  gpa?: string;                    // GPA（如：3.8/4.0）
  ranking?: string;                // 排名（如：Top 5%）
  honors?: string[];               // 荣誉（可选）
  coursework?: string[];           // 相关课程（可选，本科用）
}

// 科研经历
export interface ResearchExperience {
  title: string;                   // 科研项目名称
  role: string;                    // 担任角色（如：Research Assistant, Principal Investigator）
  institution: string;             // 机构名称
  location: string;                // 地点
  startDate: string;               // 开始日期（YYYY-MM）
  endDate?: string;                // 结束日期（YYYY-MM 或 Present）
  advisor?: string;                // 导师姓名（学术向推荐）
  description: string[];           // 项目描述（bullet points，使用动作动词开头）
}

// 论文发表
export interface Publication {
  title: string;                   // 论文标题
  authors: string[];               // 作者列表（用 * 标注自己，如："*Bowen Zhang"）
  venue: string;                   // 发表 venue（期刊/会议名称）
  year: number;                    // 发表年份
  status: 'published' | 'accepted' | 'under_review' | 'in_preparation';
  doi?: string;                    // DOI 链接
  url?: string;                    // 论文链接
  arxiv?: string;                  // arXiv 链接
}

// 实习经历
export interface InternshipExperience {
  company: string;                 // 公司名称
  position: string;                // 职位
  location: string;                // 地点
  startDate: string;               // 开始日期（YYYY-MM）
  endDate?: string;                // 结束日期（YYYY-MM 或 Present）
  description: string[];           // 工作描述（bullet points）
}

// 项目经历
export interface ProjectExperience {
  name: string;                    // 项目名称
  role: string;                    // 担任角色
  startDate: string;               // 开始日期（YYYY-MM）
  endDate?: string;                // 结束日期（YYYY-MM 或 Present）
  url?: string;                    // 项目链接
  description: string[];           // 项目描述（bullet points）
  technologies?: string[];         // 使用的技术（可选）
}

// 奖项荣誉
export interface Award {
  title: string;                   // 奖项名称
  issuer: string;                  // 颁发机构
  date: string;                    // 获奖日期（YYYY-MM）
  description?: string;            // 奖项描述（可选）
}

// 技能
export interface Skill {
  category: string;                // 技能类别（如：Programming Languages, Frameworks, Tools）
  items: string[];                 // 具体技能列表
}

// 学术服务
export interface AcademicService {
  role: string;                    // 服务角色（如：Reviewer, Teaching Assistant）
  organization: string;            // 机构/期刊/会议名称
  startDate: string;               // 开始日期（YYYY-MM）
  endDate?: string;                // 结束日期（YYYY-MM 或 Present）
  description?: string;            // 描述（可选）
}

// 简历配置（排版相关）
export interface ResumeConfig {
  fontSize: 'small' | 'medium' | 'large';  // 字体大小
  showSectionBorders: boolean;             // 显示分隔线
  compactMode: boolean;                    // 紧凑模式
  pageMargin: number;                      // 页边距（mm）
}

// 简历数据主接口
export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  researchExperience: ResearchExperience[];
  publications: Publication[];
  internshipExperience: InternshipExperience[];
  projectExperience: ProjectExperience[];
  awards: Award[];
  skills: Skill[];
  academicService: AcademicService[];
  config: ResumeConfig;
}

// 默认模板数据
export const defaultResumeData: ResumeData = {
  personalInfo: {
    name: "ZHANG SAN",
    email: "bowen.zhang@example.edu",
    phone: "+86 138-0000-0000",
    address: "Beijing, China",
    website: "https://bowenzhang.github.io",
    github: "https://github.com/zhangsan",
    googleScholar: "https://scholar.google.com/citations?user=xxx",
  },
  education: [
    {
      institution: "Peking University",
      degree: "Bachelor of Science",
      major: "Computer Science",
      location: "Beijing, China",
      startDate: "2020-09",
      endDate: "2024-06",
      gpa: "3.9/4.0",
      ranking: "Top 3%",
      honors: ["National Scholarship", "Outstanding Graduate"],
    },
  ],
  researchExperience: [
    {
      title: "Deep Learning for Natural Language Processing",
      role: "Research Assistant",
      institution: "Peking University",
      location: "Beijing, China",
      startDate: "2022-06",
      endDate: "Present",
      advisor: "Prof. Xiaoming Li",
      description: [
        "Proposed a novel attention mechanism for machine translation, improving BLEU score by 2.3 points",
        "Implemented experiments using PyTorch on 8-GPU cluster; results published at ACL 2024",
        "Collaborated with 3 PhD students on extending the work to low-resource language scenarios",
      ],
    },
  ],
  publications: [
    {
      title: "Enhanced Attention Mechanisms for Low-Resource Machine Translation",
      authors: ["Zhang San*", "Xiaoming Li", "Yanyan Wang"],
      venue: "Annual Meeting of the Association for Computational Linguistics (ACL)",
      year: 2024,
      status: "published",
      doi: "10.18653/v1/2024.acl-long.xxx",
    },
  ],
  internshipExperience: [
    {
      company: "Microsoft Research Asia",
      position: "Research Intern",
      location: "Beijing, China",
      startDate: "2023-06",
      endDate: "2023-09",
      description: [
        "Developed a pre-trained model for code understanding under the mentorship of Dr. Wei Chen",
        "Achieved SOTA results on CodeXGLUE benchmark; technology transferred to VSCode team",
      ],
    },
  ],
  projectExperience: [
    {
      name: "Open-Source NLP Toolkit",
      role: "Creator & Maintainer",
      startDate: "2021-09",
      endDate: "Present",
      url: "https://github.com/zhangsan/nlp-toolkit",
      description: [
        "Built a lightweight NLP library in Python with 2K+ stars on GitHub",
        "Designed modular architecture supporting easy extension for new tasks",
      ],
      technologies: ["Python", "PyTorch", "Transformers"],
    },
  ],
  awards: [
    {
      title: "National Scholarship",
      issuer: "Ministry of Education, China",
      date: "2022-10",
      description: "Awarded to top 2% undergraduate students nationwide",
    },
  ],
  skills: [
    {
      category: "Programming Languages",
      items: ["Python", "C++", "Java", "TypeScript", "SQL"],
    },
    {
      category: "Frameworks & Tools",
      items: ["PyTorch", "TensorFlow", "Git", "Docker", "LaTeX"],
    },
    {
      category: "Languages",
      items: ["Chinese (Native)", "English (TOEFL 110)", "German (A2)"],
    },
  ],
  academicService: [
    {
      role: "Student Reviewer",
      organization: "ACL 2024",
      startDate: "2024-01",
      endDate: "2024-06",
    },
  ],
  config: {
    fontSize: "medium",
    showSectionBorders: true,
    compactMode: false,
    pageMargin: 25,
  },
};
