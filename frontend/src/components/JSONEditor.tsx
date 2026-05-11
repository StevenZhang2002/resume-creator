import { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { FileCode, RefreshCcw, CheckCircle, AlertCircle, FormInput } from 'lucide-react';
import ResumeForm from './ResumeForm';
import type { ResumeData } from '../types/resume';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onError: (error: string | null) => void;
  onFormat: () => void;
  onReset: () => void;
  isValid: boolean;
  resumeData: ResumeData;
  onResumeDataChange: (data: ResumeData) => void;
}

export default function JSONEditor({ value, onChange, onError, onFormat, onReset, isValid, resumeData, onResumeDataChange }: EditorProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [isFormMode, setIsFormMode] = useState(false);

  const handleEditorChange = useCallback((newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange(newValue);
    }
  }, [onChange]);

  const handleEditorValidate = useCallback((markers: any[]) => {
    const error = markers.length > 0
      ? markers.map(m => m.message).join('; ')
      : null;
    setLocalError(error);
    onError(error);
  }, [onError]);

  return (
    <div className="editor-container" style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1e1e1e',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* 工具栏 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: '#252526',
        borderBottom: '1px solid #333'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
          }}>
            📄 JSON Editor
          </span>
          {isValid && !localError ? (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#4ade80',
              fontSize: '12px'
            }}>
              <CheckCircle size={14} />
              Valid JSON
            </span>
          ) : (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#f87171',
              fontSize: '12px'
            }}>
              <AlertCircle size={14} />
              Invalid JSON
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsFormMode(!isFormMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: isFormMode ? '#2563eb' : '#374151',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isFormMode ? '#1d4ed8' : '#4b5563'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isFormMode ? '#2563eb' : '#374151'}
          >
            <FormInput size={14} />
            {isFormMode ? 'JSON' : 'Form'}
          </button>
          <button
            onClick={onFormat}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: '#374151',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#374151'}
          >
            <FileCode size={14} />
            Format
          </button>
          <button
            onClick={onReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: '#374151',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#374151'}
          >
            <RefreshCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {isFormMode ? (
          <ResumeForm
            data={resumeData}
            onChange={onResumeDataChange}
          />
        ) : (
          <Editor
            key="monaco-editor"
            height="100%"
            defaultLanguage="json"
            value={value}
            onChange={handleEditorChange}
            onValidate={handleEditorValidate}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              formatOnPaste: true,
              formatOnType: true,
              quickSuggestions: true,
              wordWrap: 'on',
              renderWhitespace: 'none',
              fontFamily: '"Fira Code", "Consolas", "Courier New", monospace',
              fontLigatures: true,
            }}
          />
        )}
      </div>
    </div>
  );
}
