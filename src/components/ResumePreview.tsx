import type { ResumeData } from '../types/resume';
import { FileDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface PreviewProps {
  data: ResumeData;
  onExportPDF: () => void;
}

// A4 纸尺寸
const A4_HEIGHT_MM = 297;
const A4_WIDTH_MM = 210;

// 估计每行的高度（mm）
const LINE_HEIGHT_MM = 4.5;

export default function ResumePreview({ data, onExportPDF }: PreviewProps) {
  const { personalInfo, education, researchExperience, publications, internshipExperience, projectExperience, awards, skills, academicService, config } = data;
  const [pages, setPages] = useState<React.ReactNode[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const pageMargin = config.pageMargin || 25; // 默认 25mm
  const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - pageMargin * 2;

  // 根据配置计算字体大小
  const getFontSize = () => {
    switch (config.fontSize) {
      case 'small': return '11px';
      case 'large': return '13px';
      default: return '12px';
    }
  };

  const getBodyFontFamily = () => {
    return '"Times New Roman", Times, Georgia, serif';
  };

  const getHeadingFontFamily = () => {
    return '"Times New Roman", Times, Georgia, serif';
  };

  // 估算内容高度（mm）
  const estimateHeight = (content: React.ReactNode): number => {
    // 简化的估算逻辑
    if (typeof content === 'string') {
      const lines = Math.ceil(content.length / 80);
      return lines * LINE_HEIGHT_MM;
    }
    return LINE_HEIGHT_MM * 3; // 默认估算
  };

  // 将模块分配到页面
  const paginateContent = () => {
    // 根据字体大小获取行高系数
    const getLineHeightFactor = () => {
      switch (config.fontSize) {
        case 'small': return 0.95;
        case 'large': return 1.2;
        default: return 1.05;
      }
    };

    const allPages: React.ReactNode[] = [];
    let pageContent: React.ReactNode[] = [];
    let pageHeight = 0;
    let pageIdx = 0;

    // 个人信息总是放在第一页顶部
    const headerContent = (
      <header
        id="section-personalInfo"
        style={{
          textAlign: 'center' as const,
          marginBottom: '20px',
        }}
      >
        <h1 style={{
          fontSize: '18px',
          fontFamily: getHeadingFontFamily(),
          fontWeight: 700,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.15em',
          color: '#1a1a1a',
          margin: '0 0 8px 0',
        }}>
          {personalInfo.name}
        </h1>
        <div style={{
          fontSize: getFontSize(),
          fontFamily: getBodyFontFamily(),
          color: '#555',
          lineHeight: '1.5',
        }}>
          {[
            personalInfo.email,
            personalInfo.phone,
            personalInfo.address,
          ].filter(Boolean).join(' | ')}
          {(personalInfo.website || personalInfo.github || personalInfo.googleScholar) && (
            <div style={{ marginTop: '2px' }}>
              {[
                personalInfo.website,
                personalInfo.github,
                personalInfo.googleScholar,
              ].filter(Boolean).join(' | ')}
            </div>
          )}
        </div>
      </header>
    );

    // 个人信息高度估算（包含安全系数）
    const headerHeight = 35 * getLineHeightFactor() * 1.08; // header 大约占用 35mm

    // 创建页面的辅助函数
    const createPage = (contents: React.ReactNode[], pageIndex: number) => {
      return (
        <div
          key={`page-${pageIndex}`}
          className="resume-page"
          style={{
            width: `${A4_WIDTH_MM}mm`,
            height: `${A4_HEIGHT_MM}mm`,
            backgroundColor: '#fff',
            padding: `${pageMargin}mm`,
            boxSizing: 'border-box',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column' as const,
          }}
        >
          {contents}
        </div>
      );
    };

    // 刷新页面（将当前内容推入页面数组）
    const flushPage = () => {
      if (pageContent.length > 0) {
        allPages.push(createPage(pageContent, pageIdx));
        pageContent = [];
        pageHeight = 0;
        pageIdx++;
      }
    };

    // 构建所有模块
    const sections: { name: string; content: React.ReactNode; height: number }[] = [];

    const sectionStyle = {
      marginBottom: '16px',
    };

    const sectionHeadingStyle = {
      fontSize: getFontSize(),
      fontFamily: getHeadingFontFamily(),
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.08em',
      color: '#1a1a1a',
      borderBottom: config.showSectionBorders ? '1px solid #333' : 'none',
      paddingBottom: '4px',
      marginBottom: '10px',
    };

    const entryHeaderStyle = {
      display: 'flex' as const,
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: '2px',
    };

    const entryTitleStyle = {
      fontSize: getFontSize(),
      fontFamily: getBodyFontFamily(),
      fontWeight: 600,
      color: '#1a1a1a',
    };

    const entrySubtitleStyle = {
      fontSize: getFontSize(),
      fontFamily: getBodyFontFamily(),
      fontStyle: 'italic',
      color: '#333',
    };

    const dateStyle = {
      fontSize: getFontSize(),
      fontFamily: getBodyFontFamily(),
      color: '#555',
      whiteSpace: 'nowrap' as const,
      marginLeft: '12px',
    };

    const descriptionStyle = {
      fontSize: getFontSize(),
      fontFamily: getBodyFontFamily(),
      color: '#333',
      lineHeight: '1.4',
      margin: '4px 0',
      paddingLeft: '16px',
    };

    const bulletPointStyle = {
      marginBottom: '3px',
    };

    // Honors 标签样式
    const honorTagStyle = {
      display: 'inline-block',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: getFontSize(),
      fontFamily: getBodyFontFamily(),
      marginRight: '6px',
      marginBottom: '4px',
      fontWeight: 500,
    };

    // Technology 标签样式
    const techTagStyle = {
      display: 'inline-block',
      backgroundColor: '#e0e7ff',
      color: '#3730a3',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: getFontSize(),
      fontFamily: getBodyFontFamily(),
      marginRight: '6px',
      marginBottom: '4px',
      fontWeight: 500,
    };

    // Award description 样式（引用块）
    const awardDescriptionStyle = {
      marginTop: '6px',
      padding: '8px 12px',
      backgroundColor: '#f9fafb',
      borderLeft: '3px solid #d1d5db',
      borderRadius: '0 4px 4px 0',
      fontSize: getFontSize(),
      fontFamily: getBodyFontFamily(),
      color: '#6b7280',
      fontStyle: 'italic',
      lineHeight: '1.5',
    };

    // 估算单个条目高度（使用合理的安全系数）
    const estimateEntryHeight = (item: any, type: string): number => {
      const factor = getLineHeightFactor();
      const safetyMargin = 1.08; // 8% 的安全系数
      let height = LINE_HEIGHT_MM * 2 * factor * safetyMargin; // 基本行高

      if (type === 'education') {
        height += LINE_HEIGHT_MM * 1.5 * factor * safetyMargin; // institution + degree
        if (item.honors?.length) height += LINE_HEIGHT_MM * 0.9 * factor * safetyMargin * item.honors.length;
      } else if (type === 'research' || type === 'internship' || type === 'project') {
        height += LINE_HEIGHT_MM * 1.5 * factor * safetyMargin; // title + role
        const descCount = item.description?.length || 0;
        // 每个 bullet point 估算为 1.8 行（考虑换行）
        height += LINE_HEIGHT_MM * 2.0 * factor * safetyMargin * Math.max(descCount, 1);
      } else if (type === 'publication') {
        height += LINE_HEIGHT_MM * 3.5 * factor * safetyMargin; // title + authors + venue
      } else if (type === 'award') {
        height += LINE_HEIGHT_MM * 1.5 * factor * safetyMargin;
        if (item.description) height += LINE_HEIGHT_MM * 2.8 * factor * safetyMargin; // description 占用多行
      } else if (type === 'skill') {
        height += LINE_HEIGHT_MM * 1.5 * factor * safetyMargin;
      } else if (type === 'service') {
        height += LINE_HEIGHT_MM * 1.5 * factor * safetyMargin;
        if (item.description) height += LINE_HEIGHT_MM * 2.0 * factor * safetyMargin;
      }

      return height + 6; // 额外间距
    };

    // 添加模块的辅助函数
    const addSection = (title: string, items: any[], type: string, renderFunc: (item: any, idx: number) => React.ReactNode) => {
      if (items.length === 0) return;

      // 计算整个 section 的高度（包含安全系数）
      const safetyMargin = 1.08;
      let sectionHeight = LINE_HEIGHT_MM * 2.5 * getLineHeightFactor() * safetyMargin; // section heading
      const itemHeights: number[] = [];
      items.forEach((item) => {
        const h = estimateEntryHeight(item, type);
        sectionHeight += h;
        itemHeights.push(h);
      });

      const sectionContent = (
        <section
          key={sections.length}
          id={`section-${type}`}
          style={{
            ...sectionStyle,
            breakInside: 'avoid' as const,
          }}
        >
          <h2 style={sectionHeadingStyle}>{title}</h2>
          {items.map((item, idx) => renderFunc(item, idx))}
        </section>
      );

      sections.push({
        name: title,
        content: sectionContent,
        height: sectionHeight,
      });
    };

    // 构建各模块
    addSection('Education', education, 'education', (edu, idx) => (
      <div key={idx} style={{ marginBottom: '8px' }}>
        <div style={entryHeaderStyle}>
          <span style={entryTitleStyle}>
            {edu.institution}
          </span>
          <span style={dateStyle}>
            {edu.startDate} – {edu.endDate || 'Present'}
          </span>
        </div>
        <div style={entrySubtitleStyle}>
          {edu.degree} in {edu.major}
          {edu.location && `, ${edu.location}`}
          {(edu.gpa || edu.ranking) && (
            <span style={{ marginLeft: '12px' }}>
              {edu.gpa && `${edu.gpa}`}
              {edu.gpa && edu.ranking && ' | '}
              {edu.ranking && `${edu.ranking}`}
            </span>
          )}
        </div>
        {edu.honors && edu.honors.length > 0 && (
          <div style={{ marginTop: '4px' }}>
            {edu.honors.map((honor, i) => (
              <span key={i} style={honorTagStyle}>{honor}</span>
            ))}
          </div>
        )}
      </div>
    ));

    addSection('Research Experience', researchExperience, 'researchExperience', (research, idx) => (
      <div key={idx} style={{ marginBottom: '10px' }}>
        <div style={entryHeaderStyle}>
          <span style={entryTitleStyle}>{research.title}</span>
          <span style={dateStyle}>
            {research.startDate} – {research.endDate || 'Present'}
          </span>
        </div>
        <div style={entrySubtitleStyle}>
          {research.role}, {research.institution}
          {research.location && `, ${research.location}`}
          {research.advisor && ` | Advisor: ${research.advisor}`}
        </div>
        <ul style={{
          ...descriptionStyle,
          listStyle: 'none',
          padding: 0,
          margin: '4px 0',
        }}>
          {research.description.map((desc, i) => (
            <li key={i} style={bulletPointStyle}>• {desc}</li>
          ))}
        </ul>
      </div>
    ));

    addSection('Publications', publications, 'publications', (pub, idx) => (
      <div key={idx} style={{ marginBottom: '8px' }}>
        <div style={{ ...descriptionStyle, paddingLeft: 0 }}>
          <strong>{pub.title}</strong>
        </div>
        <div style={{ ...descriptionStyle, paddingLeft: 0 }}>
          {pub.authors.join(', ')}. "{pub.title}." <em>{pub.venue}</em>, {pub.year}.
          {pub.status !== 'published' && (
            <span style={{ color: '#666' }}> [{pub.status.replace('_', ' ')}]</span>
          )}
          {pub.doi && <div>DOI: {pub.doi}</div>}
        </div>
      </div>
    ));

    addSection('Professional Experience', internshipExperience, 'internshipExperience', (internship, idx) => (
      <div key={idx} style={{ marginBottom: '10px' }}>
        <div style={entryHeaderStyle}>
          <span style={entryTitleStyle}>{internship.company}</span>
          <span style={dateStyle}>
            {internship.startDate} – {internship.endDate || 'Present'}
          </span>
        </div>
        <div style={entrySubtitleStyle}>
          {internship.position}
          {internship.location && `, ${internship.location}`}
        </div>
        <ul style={{
          ...descriptionStyle,
          listStyle: 'none',
          padding: 0,
          margin: '4px 0',
        }}>
          {internship.description.map((desc, i) => (
            <li key={i} style={bulletPointStyle}>• {desc}</li>
          ))}
        </ul>
      </div>
    ));

    addSection('Projects', projectExperience, 'projectExperience', (project, idx) => (
      <div key={idx} style={{ marginBottom: '10px' }}>
        <div style={entryHeaderStyle}>
          <span style={entryTitleStyle}>{project.name}</span>
          <span style={dateStyle}>
            {project.startDate} – {project.endDate || 'Present'}
          </span>
        </div>
        <div style={entrySubtitleStyle}>
          {project.role}
          {project.url && ` | ${project.url}`}
        </div>
        <ul style={{
          ...descriptionStyle,
          listStyle: 'none',
          padding: 0,
          margin: '4px 0',
        }}>
          {project.description.map((desc, i) => (
            <li key={i} style={bulletPointStyle}>• {desc}</li>
          ))}
        </ul>
        {project.technologies && project.technologies.length > 0 && (
          <div style={{ marginTop: '6px' }}>
            {project.technologies.map((tech, i) => (
              <span key={i} style={techTagStyle}>{tech}</span>
            ))}
          </div>
        )}
      </div>
    ));

    addSection('Honors & Awards', awards, 'awards', (award, idx) => (
      <div key={idx} style={{ marginBottom: '6px' }}>
        <div style={entryHeaderStyle}>
          <span style={entryTitleStyle}>{award.title}</span>
          <span style={dateStyle}>{award.date}</span>
        </div>
        <div style={entrySubtitleStyle}>{award.issuer}</div>
        {award.description && (
          <div style={awardDescriptionStyle}>{award.description}</div>
        )}
      </div>
    ));

    addSection('Skills', skills, 'skills', (skill, idx) => (
      <div key={idx} style={{ marginBottom: '4px' }}>
        <span style={{ ...entryTitleStyle, marginRight: '8px' }}>
          {skill.category}:
        </span>
        <span style={entrySubtitleStyle}>
          {skill.items.join(', ')}
        </span>
      </div>
    ));

    addSection('Academic Service', academicService, 'academicService', (service, idx) => (
      <div key={idx} style={{ marginBottom: '6px' }}>
        <div style={entryHeaderStyle}>
          <span style={entryTitleStyle}>{service.role}</span>
          <span style={dateStyle}>
            {service.startDate} – {service.endDate || 'Present'}
          </span>
        </div>
        <div style={entrySubtitleStyle}>{service.organization}</div>
        {service.description && (
          <div style={descriptionStyle}>{service.description}</div>
        )}
      </div>
    ));

    // 第一页包含 header
    pageContent = [headerContent];
    pageHeight = headerHeight;

    // 分配模块到页面
    for (const section of sections) {
      if (pageHeight + section.height > CONTENT_HEIGHT_MM && pageContent.length > 0) {
        // 当前页放不下，创建新页
        flushPage();
      }

      pageContent.push(section.content);
      pageHeight += section.height;
    }

    // 刷新最后一页
    flushPage();

    setPages(allPages);
  };

  useEffect(() => {
    paginateContent();
  }, [data, pageMargin, config.fontSize]);

  return (
    <div
      id="resume-preview"
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#525659',
        padding: '20px',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: '20px',
      }}
    >
      {/* 导出按钮 - 在简历容器外 */}
      <div className="no-print" style={{
        position: 'fixed' as const,
        top: '80px',
        right: '40px',
        zIndex: 1000,
      }}>
        <button
          onClick={onExportPDF}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
            fontWeight: 500,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          <FileDown size={16} />
          Export PDF
        </button>
      </div>

      {/* 多页内容 */}
      <div ref={contentRef} id="resume-content" style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>
        {pages}
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          #resume-preview {
            background: white !important;
            padding: 0 !important;
          }
          #resume-preview > div {
            gap: 0 !important;
          }
          .resume-page {
            box-shadow: none !important;
            page-break-after: always;
          }
          .resume-page:last-child {
            page-break-after: auto;
          }
        }
      `}</style>
    </div>
  );
}
