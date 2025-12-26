import { useRef, useEffect } from 'react';
import CodeBlock from './CodeBlock';

function CodeEditor({ value, onChange, language, placeholder, rows = 10 }) {
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);

  // Sync scroll between textarea and highlight
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  useEffect(() => {
    handleScroll();
  }, [value]);

  return (
    <div className="code-editor">
      <div className="code-editor-container">
        {/* Highlighted code preview (behind) */}
        <div 
          ref={highlightRef}
          className="code-editor-highlight"
          aria-hidden="true"
        >
          <CodeBlock 
            code={value || ''} 
            language={language}
            isEditor={true}
          />
        </div>

        {/* Actual textarea (on top, transparent text) */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onScroll={handleScroll}
          placeholder={placeholder}
          rows={rows}
          className="code-editor-textarea"
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  );
}

export default CodeEditor;
