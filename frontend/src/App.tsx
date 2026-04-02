import { useState, useCallback, useEffect } from 'react';
import { defaultResumeData } from './types/resume';
import type { ResumeData } from './types/resume';
import JSONEditor from './components/JSONEditor';
import ResumePreview from './components/ResumePreview';
import html2pdf from 'html2pdf.js';
import { HelpCircle } from 'lucide-react';
import './App.css';

function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [jsonString, setJsonString] = useState<string>(
    JSON.stringify(defaultResumeData, null, 2)
  );
  const [isValid, setIsValid] = useState(true);
  const [showGuidance, setShowGuidance] = useState(false);

  const handleJsonChange = useCallback((newJson: string) => {
    setJsonString(newJson);
    try {
      const parsed = JSON.parse(newJson);
      setResumeData(parsed);
      setIsValid(true);
    } catch (e) {
      setIsValid(false);
    }
  }, []);

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonString);
      setJsonString(JSON.stringify(parsed, null, 2));
    } catch {
      // Skip if JSON is invalid
    }
  }, [jsonString]);

  const handleReset = useCallback(() => {
    if (window.confirm('确定要重置为默认模板吗？当前的编辑将丢失。')) {
      const defaultJson = JSON.stringify(defaultResumeData, null, 2);
      setJsonString(defaultJson);
      setResumeData(defaultResumeData);
      setIsValid(true);
    }
  }, []);

  const handleExportPDF = useCallback(async () => {
    const element = document.getElementById('resume-content');
    if (!element) return;

    const pages = element.querySelectorAll('.resume-page');
    if (pages.length === 0) return;

    // 临时移除 gap 样式
    const originalGap = element.style.gap;
    element.style.gap = '0';

    const opt = {
      margin: 0,
      filename: `${resumeData.personalInfo.name.toLowerCase().replace(/\s+/g, '_')}_CV.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
      pagebreak: { mode: 'avoid-all' }
    };

    try {
      await html2pdf().set(opt).from(element).toPdf().get('pdf').then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        // 如果有多页，删除最后一页（空白页）
        if (totalPages > 1) {
          pdf.deletePage(totalPages);
        }
        pdf.save(opt.filename);
      });
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('导出 PDF 失败，请重试');
    } finally {
      element.style.gap = originalGap;
    }
  }, [resumeData.personalInfo.name]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleFormat();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleExportPDF();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFormat, handleExportPDF]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1e1e1e',
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        backgroundColor: '#252526',
        borderBottom: '1px solid #333',
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: '18px',
            color: '#fff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
          }}>
            Academic CV Editor
          </h1>
          <p style={{
            margin: '4px 0 0',
            fontSize: '12px',
            color: '#888',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
          }}>
            Ctrl+S Format | Ctrl+Enter Export PDF
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button
            onClick={() => setShowGuidance(!showGuidance)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: showGuidance ? '#3b82f6' : '#374151',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
              fontWeight: 500,
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = showGuidance ? '#3b82f6' : '#374151'}
          >
            <HelpCircle size={14} />
            Guidance
          </button>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#aaa',
            fontSize: '12px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
          }}>
            <input
              type="checkbox"
              checked={resumeData.config.showSectionBorders}
              onChange={(e) => {
                const newData = {
                  ...resumeData,
                  config: { ...resumeData.config, showSectionBorders: e.target.checked }
                };
                setResumeData(newData);
                setJsonString(JSON.stringify(newData, null, 2));
              }}
              style={{ cursor: 'pointer' }}
            />
            Borders
          </label>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#aaa',
            fontSize: '12px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
          }}>
            Font:
            <select
              value={resumeData.config.fontSize}
              onChange={(e) => {
                const newData = {
                  ...resumeData,
                  config: { ...resumeData.config, fontSize: e.target.value as 'small' | 'medium' | 'large' }
                };
                setResumeData(newData);
                setJsonString(JSON.stringify(newData, null, 2));
              }}
              style={{
                padding: '4px 8px',
                backgroundColor: '#374151',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              <option value="small">S</option>
              <option value="medium">M</option>
              <option value="large">L</option>
            </select>
          </label>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#aaa',
            fontSize: '12px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
          }}>
            Margin:
            <select
              value={resumeData.config.pageMargin}
              onChange={(e) => {
                const newData = {
                  ...resumeData,
                  config: { ...resumeData.config, pageMargin: Number(e.target.value) }
                };
                setResumeData(newData);
                setJsonString(JSON.stringify(newData, null, 2));
              }}
              style={{
                padding: '4px 8px',
                backgroundColor: '#374151',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              <option value="15">Narrow</option>
              <option value="20">Medium</option>
              <option value="25">Wide</option>
            </select>
          </label>
        </div>
      </header>

      {/* Guidance Panel */}
      {showGuidance && (
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#2d2d30',
          borderBottom: '1px solid #333',
          fontSize: '13px',
          color: '#ccc',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
          lineHeight: '1.6',
        }}>
          <h3 style={{ margin: '0 0 12px', color: '#fff', fontSize: '14px' }}>使用指南</h3>
          <div style={{ display: 'flex', gap: '32px' }}>
            <div>
              <strong style={{ color: '#fff' }}>编辑简历：</strong>
              <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                <li>在左侧编辑器中修改 JSON 数据</li>
                <li>按 <kbd style={{ padding: '2px 6px', backgroundColor: '#374151', borderRadius: '3px' }}>Ctrl+S</kbd> 格式化 JSON</li>
                <li>支持的所有字段均可编辑</li>
              </ul>
            </div>
            <div>
              <strong style={{ color: '#fff' }}>导出 PDF：</strong>
              <ul style={{ margin: '4px 0 0', paddingLeft: '20px' }}>
                <li>按 <kbd style={{ padding: '2px 6px', backgroundColor: '#374151', borderRadius: '3px' }}>Ctrl+Enter</kbd> 或点击右上角 Export PDF 按钮</li>
                <li>内容超出一页时会自动分页</li>
                <li>每个模块保持完整，不会被切断</li>
              </ul>
            </div>
            <div>
              <strong style={{ color: '#fff' }}>排版设置：</strong>
              <ul style={{ margin: '4px 0 0', paddingLeft: '20px' }}>
                <li><strong>Borders:</strong> 显示/隐藏章节分隔线</li>
                <li><strong>Font:</strong> S/M/L 调整字体大小</li>
                <li><strong>Margin:</strong> Narrow/Medium/Wide 调整页边距</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <main style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        gap: '1px',
        backgroundColor: '#333',
      }}>
        <div style={{
          flex: '0 0 50%',
          minWidth: '400px',
          padding: '16px',
          boxSizing: 'border-box',
        }}>
          <JSONEditor
            value={jsonString}
            onChange={handleJsonChange}
            onError={() => {}}
            onFormat={handleFormat}
            onReset={handleReset}
            isValid={isValid}
            resumeData={resumeData}
            onResumeDataChange={(newData) => {
              setResumeData(newData);
              setJsonString(JSON.stringify(newData, null, 2));
            }}
          />
        </div>

        <div style={{
          flex: '0 0 50%',
          minWidth: '400px',
          padding: '0',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}>
          <ResumePreview
            data={resumeData}
            onExportPDF={handleExportPDF}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
