import type { ResumeData } from '../types/resume';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { FileDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Error boundary to prevent render errors from cascading
class PreviewErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: string }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: '' };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ResumePreview] Render error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: '#f87171', fontFamily: 'sans-serif', fontSize: 14 }}>
          <p>Preview render error: {this.state.error}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

interface PreviewProps {
  data: ResumeData;
  onExportPDF: () => void;
}

// A4 纸尺寸
const A4_HEIGHT_MM = 297;
const A4_WIDTH_MM = 210;

export default function ResumePreview({ data, onExportPDF }: PreviewProps) {
  const { personalInfo, education, researchExperience, publications, internshipExperience, projectExperience, awards, skills, academicService, config } = data;
  const [pages, setPages] = useState<React.ReactNode[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const pageMargin = config.pageMargin || 25; // 默认 25mm
  const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - pageMargin * 2;
  const CONTENT_WIDTH_MM = A4_WIDTH_MM - pageMargin * 2;
  const PX_PER_MM = 3.78; // 96 DPI

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

  // ========== 隐藏容器测量 ==========

  interface MeasuredEntry {
    content: React.ReactNode;
    heightMm: number;
  }

  interface MeasuredSection {
    title: string;
    type: string;
    headingHeightMm: number;
    entries: MeasuredEntry[];
    sectionGapMm: number; // section 之间的 marginBottom
  }

  const createHiddenContainer = (): HTMLDivElement => {
    const container = document.createElement('div');
    container.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      visibility: hidden;
      width: ${CONTENT_WIDTH_MM}mm;
      font-size: ${getFontSize()};
      font-family: ${getBodyFontFamily()};
    `;
    return container;
  };

  // 构建用于测量的 DOM 元素（不经过 React）
  const buildSectionElements = (
    container: HTMLDivElement,
  ): MeasuredSection[] => {
    const fontSize = getFontSize();
    const bodyFont = getBodyFontFamily();
    const headingFont = getHeadingFontFamily();

    const sectionTitles: Record<string, string> = {
      education: 'Education',
      researchExperience: 'Research Experience',
      publications: 'Publications',
      internshipExperience: 'Professional Experience',
      projectExperience: 'Projects',
      awards: 'Honors & Awards',
      skills: 'Skills',
      academicService: 'Academic Service',
    };

    const sectionGaps: Record<string, number> = {
      education: 8,
      researchExperience: 10,
      publications: 8,
      internshipExperience: 10,
      projectExperience: 10,
      awards: 6,
      skills: 4,
      academicService: 6,
    };

    const measuredSections: MeasuredSection[] = [];

    const addMeasuredSection = (type: string, items: any[] | undefined, buildEntry: (item: any) => string) => {
      if (!items || items.length === 0) return;

      const sectionEl = document.createElement('div');
      sectionEl.style.cssText = `
        margin-bottom: 16px;
        font-size: ${fontSize};
        font-family: ${bodyFont};
      `;

      // Section heading
      const heading = document.createElement('h2');
      heading.style.cssText = `
        font-size: ${fontSize};
        font-family: ${headingFont};
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #1a1a1a;
        border-bottom: ${config.showSectionBorders ? '1px solid #333' : 'none'};
        padding-bottom: 4px;
        margin-bottom: 10px;
        margin-top: 0;
      `;
      heading.textContent = sectionTitles[type];
      sectionEl.appendChild(heading);

      // 测量 heading 高度
      container.appendChild(sectionEl);
      void heading.getBoundingClientRect();
      const headingHeightMm = heading.getBoundingClientRect().height / PX_PER_MM;

      // 测量每个 entry 高度
      const entries: MeasuredEntry[] = [];
      items.forEach((item) => {
        const entryWrapper = document.createElement('div');
        entryWrapper.style.marginBottom = `${sectionGaps[type] || 8}px`;
        entryWrapper.innerHTML = buildEntry(item);
        sectionEl.appendChild(entryWrapper);
        void entryWrapper.getBoundingClientRect();
        const heightMm = entryWrapper.getBoundingClientRect().height / PX_PER_MM;
        entries.push({ content: getEntryContent(type, item), heightMm });
      });

      measuredSections.push({
        title: sectionTitles[type],
        type,
        headingHeightMm,
        entries,
        sectionGapMm: sectionGaps[type] || 8,
      });
    };

    // Helper for building entry HTML strings for measurement
    const fmt = (v: string) => v || '';

    addMeasuredSection('education', education, (edu) => `
      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:2px;">
        <span style="font-weight:600; color:#1a1a1a;">${fmt(edu.institution)}</span>
        <span style="color:#555; white-space:nowrap; margin-left:12px;">${fmt(edu.startDate)} – ${fmt(edu.endDate || 'Present')}</span>
      </div>
      <div style="font-style:italic; color:#333;">
        ${fmt(edu.degree)} in ${fmt(edu.major)}${edu.location ? `, ${edu.location}` : ''}${(edu.gpa || edu.ranking) ? `<span style="margin-left:12px;">${edu.gpa || ''}${edu.gpa && edu.ranking ? ' | ' : ''}${edu.ranking || ''}</span>` : ''}
      </div>
      ${edu.honors && edu.honors.length > 0 ? `<div style="margin-top:4px;">${edu.honors.map((h: string) => `<span style="display:inline-block; background-color:#f3f4f6; color:#374151; padding:2px 8px; border-radius:4px; margin-right:6px; margin-bottom:4px; font-weight:500;">${h}</span>`).join('')}</div>` : ''}
    `);

    addMeasuredSection('researchExperience', researchExperience, (r) => `
      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:2px;">
        <span style="font-weight:600; color:#1a1a1a;">${fmt(r.title)}</span>
        <span style="color:#555; white-space:nowrap; margin-left:12px;">${fmt(r.startDate)} – ${fmt(r.endDate || 'Present')}</span>
      </div>
      <div style="font-style:italic; color:#333;">
        ${fmt(r.role)}, ${fmt(r.institution)}${r.location ? `, ${r.location}` : ''}${r.advisor ? ` | Advisor: ${r.advisor}` : ''}
      </div>
      <ul style="color:#333; line-height:1.4; margin:4px 0; padding-left:16px; list-style:none;">
        ${(r.description || []).map((d: string) => `<li style="margin-bottom:3px;">• ${d}</li>`).join('')}
      </ul>
    `);

    addMeasuredSection('publications', publications, (pub) => `
      <div style="color:#333; line-height:1.4; margin:4px 0; padding-left:0;"><strong>${fmt(pub.title)}</strong></div>
      <div style="color:#333; line-height:1.4; margin:4px 0; padding-left:0;">
        ${pub.authors.join(', ')}. "${pub.title}." <em>${pub.venue}</em>, ${pub.year}.${pub.status !== 'published' ? `<span style="color:#666;"> [${pub.status.replace('_', ' ')}]</span>` : ''}${pub.doi ? `<div>DOI: ${pub.doi}</div>` : ''}
      </div>
    `);

    addMeasuredSection('internshipExperience', internshipExperience, (intern) => `
      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:2px;">
        <span style="font-weight:600; color:#1a1a1a;">${fmt(intern.company)}</span>
        <span style="color:#555; white-space:nowrap; margin-left:12px;">${fmt(intern.startDate)} – ${fmt(intern.endDate || 'Present')}</span>
      </div>
      <div style="font-style:italic; color:#333;">
        ${fmt(intern.position)}${intern.location ? `, ${intern.location}` : ''}
      </div>
      <ul style="color:#333; line-height:1.4; margin:4px 0; padding-left:16px; list-style:none;">
        ${(intern.description || []).map((d: string) => `<li style="margin-bottom:3px;">• ${d}</li>`).join('')}
      </ul>
    `);

    addMeasuredSection('projectExperience', projectExperience, (proj) => `
      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:2px;">
        <span style="font-weight:600; color:#1a1a1a;">${fmt(proj.name)}</span>
        <span style="color:#555; white-space:nowrap; margin-left:12px;">${fmt(proj.startDate)} – ${fmt(proj.endDate || 'Present')}</span>
      </div>
      <div style="font-style:italic; color:#333;">
        ${fmt(proj.role)}${proj.url ? ` | ${proj.url}` : ''}
      </div>
      <ul style="color:#333; line-height:1.4; margin:4px 0; padding-left:16px; list-style:none;">
        ${(proj.description || []).map((d: string) => `<li style="margin-bottom:3px;">• ${d}</li>`).join('')}
      </ul>
      ${proj.technologies && proj.technologies.length > 0 ? `<div style="margin-top:6px;">${proj.technologies.map((t: string) => `<span style="display:inline-block; background-color:#e0e7ff; color:#3730a3; padding:2px 8px; border-radius:4px; margin-right:6px; margin-bottom:4px; font-weight:500;">${t}</span>`).join('')}</div>` : ''}
    `);

    addMeasuredSection('awards', awards, (award) => `
      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:2px;">
        <span style="font-weight:600; color:#1a1a1a;">${fmt(award.title)}</span>
        <span style="color:#555; white-space:nowrap; margin-left:12px;">${fmt(award.date)}</span>
      </div>
      <div style="font-style:italic; color:#333;">${fmt(award.issuer)}</div>
      ${award.description ? `<div style="margin-top:6px; padding:8px 12px; background-color:#f9fafb; border-left:3px solid #d1d5db; border-radius:0 4px 4px 0; color:#6b7280; font-style:italic; line-height:1.5;">${award.description}</div>` : ''}
    `);

    addMeasuredSection('skills', skills, (skill) => `
      <span style="font-weight:600; color:#1a1a1a; margin-right:8px;">${fmt(skill.category)}:</span>
      <span style="font-style:italic; color:#333;">${skill.items.join(', ')}</span>
    `);

    addMeasuredSection('academicService', academicService, (service) => `
      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:2px;">
        <span style="font-weight:600; color:#1a1a1a;">${fmt(service.role)}</span>
        <span style="color:#555; white-space:nowrap; margin-left:12px;">${fmt(service.startDate)} – ${fmt(service.endDate || 'Present')}</span>
      </div>
      <div style="font-style:italic; color:#333;">${fmt(service.organization)}</div>
      ${service.description ? `<div style="color:#333; line-height:1.4; margin:4px 0; padding-left:16px;">${service.description}</div>` : ''}
    `);

    return measuredSections;
  };

  // 获取 entry 的 React 渲染内容（用于最终渲染）
  const getEntryContent = (type: string, item: any): React.ReactNode => {
    switch (type) {
      case 'education':
        return (
          <div style={{ marginBottom: '8px' }}>
            <div style={entryHeaderStyle}>
              <span style={entryTitleStyle}>{item.institution}</span>
              <span style={dateStyle}>{item.startDate} – {item.endDate || 'Present'}</span>
            </div>
            <div style={entrySubtitleStyle}>
              {item.degree} in {item.major}
              {item.location && `, ${item.location}`}
              {(item.gpa || item.ranking) && (
                <span style={{ marginLeft: '12px' }}>
                  {item.gpa && `${item.gpa}`}
                  {item.gpa && item.ranking && ' | '}
                  {item.ranking && `${item.ranking}`}
                </span>
              )}
            </div>
            {item.honors && item.honors.length > 0 && (
              <div style={{ marginTop: '4px' }}>
                {item.honors.map((honor: string, i: number) => (
                  <span key={i} style={honorTagStyle}>{honor}</span>
                ))}
              </div>
            )}
          </div>
        );
      case 'researchExperience':
        return (
          <div style={{ marginBottom: '10px' }}>
            <div style={entryHeaderStyle}>
              <span style={entryTitleStyle}>{item.title}</span>
              <span style={dateStyle}>{item.startDate} – {item.endDate || 'Present'}</span>
            </div>
            <div style={entrySubtitleStyle}>
              {item.role}, {item.institution}
              {item.location && `, ${item.location}`}
              {item.advisor && ` | Advisor: ${item.advisor}`}
            </div>
            <ul style={{ ...descriptionStyle, listStyle: 'none', padding: 0, margin: '4px 0' }}>
              {item.description.map((desc: string, i: number) => (
                <li key={i} style={bulletPointStyle}>• {desc}</li>
              ))}
            </ul>
          </div>
        );
      case 'publications':
        return (
          <div style={{ marginBottom: '8px' }}>
            <div style={{ ...descriptionStyle, paddingLeft: 0 }}>
              <strong>{item.title}</strong>
            </div>
            <div style={{ ...descriptionStyle, paddingLeft: 0 }}>
              {item.authors.join(', ')}. "{item.title}." <em>{item.venue}</em>, {item.year}.
              {item.status !== 'published' && (
                <span style={{ color: '#666' }}> [{item.status.replace('_', ' ')}]</span>
              )}
              {item.doi && <div>DOI: {item.doi}</div>}
            </div>
          </div>
        );
      case 'internshipExperience':
        return (
          <div style={{ marginBottom: '10px' }}>
            <div style={entryHeaderStyle}>
              <span style={entryTitleStyle}>{item.company}</span>
              <span style={dateStyle}>{item.startDate} – {item.endDate || 'Present'}</span>
            </div>
            <div style={entrySubtitleStyle}>
              {item.position}
              {item.location && `, ${item.location}`}
            </div>
            <ul style={{ ...descriptionStyle, listStyle: 'none', padding: 0, margin: '4px 0' }}>
              {item.description.map((desc: string, i: number) => (
                <li key={i} style={bulletPointStyle}>• {desc}</li>
              ))}
            </ul>
          </div>
        );
      case 'projectExperience':
        return (
          <div style={{ marginBottom: '10px' }}>
            <div style={entryHeaderStyle}>
              <span style={entryTitleStyle}>{item.name}</span>
              <span style={dateStyle}>{item.startDate} – {item.endDate || 'Present'}</span>
            </div>
            <div style={entrySubtitleStyle}>
              {item.role}
              {item.url && ` | ${item.url}`}
            </div>
            <ul style={{ ...descriptionStyle, listStyle: 'none', padding: 0, margin: '4px 0' }}>
              {item.description.map((desc: string, i: number) => (
                <li key={i} style={bulletPointStyle}>• {desc}</li>
              ))}
            </ul>
            {item.technologies && item.technologies.length > 0 && (
              <div style={{ marginTop: '6px' }}>
                {item.technologies.map((tech: string, i: number) => (
                  <span key={i} style={techTagStyle}>{tech}</span>
                ))}
              </div>
            )}
          </div>
        );
      case 'awards':
        return (
          <div style={{ marginBottom: '6px' }}>
            <div style={entryHeaderStyle}>
              <span style={entryTitleStyle}>{item.title}</span>
              <span style={dateStyle}>{item.date}</span>
            </div>
            <div style={entrySubtitleStyle}>{item.issuer}</div>
            {item.description && (
              <div style={awardDescriptionStyle}>{item.description}</div>
            )}
          </div>
        );
      case 'skills':
        return (
          <div style={{ marginBottom: '4px' }}>
            <span style={{ ...entryTitleStyle, marginRight: '8px' }}>
              {item.category}:
            </span>
            <span style={entrySubtitleStyle}>
              {item.items.join(', ')}
            </span>
          </div>
        );
      case 'academicService':
        return (
          <div style={{ marginBottom: '6px' }}>
            <div style={entryHeaderStyle}>
              <span style={entryTitleStyle}>{item.role}</span>
              <span style={dateStyle}>{item.startDate} – {item.endDate || 'Present'}</span>
            </div>
            <div style={entrySubtitleStyle}>{item.organization}</div>
            {item.description && (
              <div style={descriptionStyle}>{item.description}</div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // Section heading 样式（复用）
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

  // 个人信息总是放在第一页顶部
  const headerContent = (
    <header
      id="section-personalInfo"
      style={{ textAlign: 'center' as const, marginBottom: '20px' }}
    >
      <h1 style={{
        fontSize: '18px', fontFamily: getHeadingFontFamily(), fontWeight: 700,
        textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#1a1a1a', margin: '0 0 8px 0',
      }}>
        {personalInfo.name}
      </h1>
      <div style={{ fontSize: getFontSize(), fontFamily: getBodyFontFamily(), color: '#555', lineHeight: '1.5' }}>
        {[personalInfo.email, personalInfo.phone, personalInfo.address].filter(Boolean).join(' | ')}
        {(personalInfo.website || personalInfo.github || personalInfo.googleScholar) && (
          <div style={{ marginTop: '2px' }}>
            {[personalInfo.website, personalInfo.github, personalInfo.googleScholar].filter(Boolean).join(' | ')}
          </div>
        )}
      </div>
    </header>
  );

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

  // ========== 主分页流程：估算 → 实测 → 以 entry 为单位分页 → 溢出兜底 ==========
  const paginateContent = () => {
    const allPages: React.ReactNode[] = [];

    // 有效内容高度（减去溢出修正值，让分页更保守）
    const effectiveContentHeight = CONTENT_HEIGHT_MM - overflowCorrection;

    // --- Pass 1: 渲染到隐藏容器，测量真实高度 ---
    const measureContainer = createHiddenContainer();
    document.body.appendChild(measureContainer);

    // 测量 header 高度
    const headerWrapper = document.createElement('div');
    headerWrapper.style.marginBottom = '20px';
    headerWrapper.innerHTML = `
      <div style="text-align:center; font-size:${getFontSize()}; font-family:${getHeadingFontFamily()};">
        <h1 style="font-size:18px; font-weight:700; text-transform:uppercase; letter-spacing:0.15em; margin:0 0 8px 0; color:#1a1a1a;">${personalInfo.name || 'Name'}</h1>
        <div style="line-height:1.5; color:#555;">
          ${[personalInfo.email, personalInfo.phone, personalInfo.address].filter(Boolean).join(' | ')}
          ${(personalInfo.website || personalInfo.github || personalInfo.googleScholar) ? `<div style="margin-top:2px;">${[personalInfo.website, personalInfo.github, personalInfo.googleScholar].filter(Boolean).join(' | ')}</div>` : ''}
        </div>
      </div>
    `;
    measureContainer.appendChild(headerWrapper);
    void headerWrapper.getBoundingClientRect();
    const headerHeightMm = headerWrapper.getBoundingClientRect().height / PX_PER_MM;

    // 测量所有 section
    const measuredSections = buildSectionElements(measureContainer);

    // 清理隐藏容器
    document.body.removeChild(measureContainer);

    // --- Pass 2: 以 entry 为单位分页 ---
    // 将所有 entry 展平成线性列表，每个 entry 知道属于哪个 section
    interface PageEntry {
      sectionTitle: string;
      sectionType: string;
      isSectionStart: boolean; // 该 entry 是否是所在 section 的第一个
      content: React.ReactNode;
      heightMm: number;
    }

    const flatEntries: PageEntry[] = [];
    measuredSections.forEach(section => {
      section.entries.forEach((entry, idx) => {
        flatEntries.push({
          sectionTitle: section.title,
          sectionType: section.type,
          isSectionStart: idx === 0,
          content: entry.content,
          heightMm: entry.heightMm,
        });
      });
    });

    // 分页
    interface PageLayout {
      hasHeader: boolean;
      entries: PageEntry[];
    }

    const pages: PageLayout[] = [];
    let entryIdx = 0;

    while (entryIdx < flatEntries.length) {
      const page: PageLayout = {
        hasHeader: pages.length === 0,
        entries: [],
      };

      let usedHeight = page.hasHeader ? headerHeightMm : 0;

      // 以 entry 为单位放入当前页
      while (entryIdx < flatEntries.length) {
        const entry = flatEntries[entryIdx];

        if (entry.isSectionStart && page.entries.length > 0) {
          // 新 section 的 heading 需要额外高度
          const section = measuredSections.find(s => s.type === entry.sectionType);
          const headingCost = section ? section.headingHeightMm : 0;
          const totalCost = entry.heightMm + headingCost;
          if (usedHeight + totalCost > effectiveContentHeight) {
            break; // 放不下 heading + entry，换页
          }
          usedHeight += headingCost;
        }

        if (usedHeight + entry.heightMm > effectiveContentHeight && page.entries.length > 0) {
          break; // 放不下这个 entry，换页
        }

        page.entries.push(entry);
        usedHeight += entry.heightMm;
        entryIdx++;
      }

      // 如果一页都没放进任何 entry（只剩 header 或空页），防止死循环
      if (page.entries.length === 0 && pages.length > 0) {
        // 强制放入一个 entry（即使超出）
        page.entries.push(flatEntries[entryIdx]);
        entryIdx++;
      }

      pages.push(page);

      // 防止无限循环
      if (pages.length > 50) break;
    }

    // --- Pass 3: 构建最终页面 ---
    pages.forEach((pageLayout, pageIdx) => {
      const pageContents: React.ReactNode[] = [];

      if (pageLayout.hasHeader) {
        pageContents.push(headerContent);
      }

      // 按 section 分组渲染
      let currentSectionType = '';

      pageLayout.entries.forEach((entry, idx) => {
        if (entry.sectionType !== currentSectionType) {
          currentSectionType = entry.sectionType;
          pageContents.push(
            <h2 key={`heading-${pageIdx}-${idx}`} style={sectionHeadingStyle}>
              {entry.sectionTitle}
            </h2>
          );
        }
        pageContents.push(
          <div key={`entry-${pageIdx}-${idx}`}>
            {entry.content}
          </div>
        );
      });

      allPages.push(createPage(pageContents, pageIdx));
    });

    // --- Pass 4: 溢出兜底检测 ---
    // 在下一个 effect 中通过 DOM 测量检测溢出，如有溢出则触发修正分页
    setPages(allPages);
  };

  // 溢出检测与修正：渲染后检测是否溢出，如有则触发修正
  const [overflowCorrection, setOverflowCorrection] = useState(0);

  useEffect(() => {
    paginateContent();
  }, [data, pageMargin, config.fontSize, config.showSectionBorders, overflowCorrection]);

  // 溢出兜底检测：渲染后测量每页实际高度，如有溢出则自动修正
  useEffect(() => {
    if (pages.length === 0 || !contentRef.current) return;

    const pageEls = contentRef.current.querySelectorAll('.resume-page');
    if (pageEls.length === 0) return;

    let overflowDetected = false;
    let overflowAmount = 0;

    pageEls.forEach((pageEl) => {
      // scrollHeight includes ALL content (even clipped overflow), clientHeight is the element's set height
      const actualContentMm = pageEl.scrollHeight / PX_PER_MM;
      const elementHeightMm = pageEl.clientHeight / PX_PER_MM;

      // If scrollHeight > clientHeight, content is overflowing
      if (actualContentMm > elementHeightMm + 0.5) {
        overflowDetected = true;
        overflowAmount = Math.max(overflowAmount, actualContentMm - elementHeightMm);
      }
    });

    if (overflowDetected) {
      // 触发修正：增加一个小的惩罚值，让下次分页时更保守
      setOverflowCorrection(prev => prev + Math.ceil(overflowAmount));
    }
  }, [pages]);

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
      <PreviewErrorBoundary>
        <div ref={contentRef} id="resume-content" style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>
          {pages}
        </div>
      </PreviewErrorBoundary>

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
