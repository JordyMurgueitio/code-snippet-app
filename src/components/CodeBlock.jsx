// Simple syntax highlighter for common languages
function CodeBlock({ code, language, isEditor = false }) {
  const highlightCode = (code) => {
    // Language-specific patterns for better highlighting
    const patterns = {
      // Comments (must be checked first to avoid false matches)
      comment: /\/\/.*$|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->|#.*$|--.*$|"""[\s\S]*?"""|'''[\s\S]*?'''/gm,
      // Strings (single, double, backticks, f-strings)
      string: /(["'`])(?:(?=(\\?))\2.)*?\1|f["'](?:(?=(\\?))\3.)*?["']/g,
      // Keywords (comprehensive list for JS, React, Python, CSS, SQL)
      keyword: /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|DATABASE|INDEX|VIEW|JOIN|INNER|LEFT|RIGHT|OUTER|ON|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|DISTINCT|AS|COUNT|SUM|AVG|MAX|MIN|AND|OR|NOT|NULL|IS|LIKE|IN|BETWEEN|EXISTS|CASE|WHEN|THEN|ELSE|END|PRIMARY|KEY|FOREIGN|REFERENCES|CONSTRAINT|DEFAULT|AUTO_INCREMENT|VARCHAR|INT|TEXT|DATE|TIMESTAMP|const|let|var|function|return|if|else|for|while|do|class|import|export|from|default|async|await|new|this|super|extends|static|public|private|protected|void|int|string|boolean|true|false|null|undefined|typeof|instanceof|delete|try|catch|throw|finally|break|continue|switch|case|def|lambda|self|None|True|False|pass|yield|with|as|assert|global|nonlocal|raise|del|in|is|not|and|or|print|input|range|len|type|list|dict|tuple|set)\b/gi,
      // JSX/HTML tags
      jsxTag: /<\/?[A-Z][a-zA-Z0-9]*(?:\s+[a-zA-Z-]+(?:=(?:{[^}]*}|"[^"]*"|'[^']*'))?)*\s*\/?>/g,
      htmlTag: /<\/?[a-z][a-z0-9]*(?:\s+[a-z-]+(?:="[^"]*"|='[^']*')?)*\s*\/?>/g,
      // Functions and methods
      function: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,
      // Numbers (integers, floats, hex, binary)
      number: /\b(?:0x[\da-fA-F]+|0b[01]+|\d+\.?\d*(?:[eE][+-]?\d+)?)\b/g,
      // Operators and punctuation
      operator: /[+\-*/%=<>!&|^~?:]+|=>|\.\.\.|\.\./g,
      // CSS properties
      cssProperty: /\b([a-z-]+)\s*(?=:)/g,
      // Template literals
      templateString: /`(?:[^`\\]|\\.)*`/g,
    };
    
    const replacements = [];

    // Match all patterns and store their positions
    Object.entries(patterns).forEach(([type, pattern]) => {
      [...code.matchAll(pattern)].forEach(match => {
        if (match[0]) {
          replacements.push({
            start: match.index,
            end: match.index + match[0].length,
            type,
            text: match[0]
          });
        }
      });
    });

    // Sort by start position
    replacements.sort((a, b) => a.start - b.start);

    // Remove overlapping matches (keep first match)
    const filtered = [];
    let lastEnd = -1;
    replacements.forEach(item => {
      if (item.start >= lastEnd) {
        filtered.push(item);
        lastEnd = item.end;
      }
    });

    // Build highlighted HTML
    if (filtered.length === 0) {
      // No matches, return plain text with default color
      return <code><span className="token-text">{code}</span></code>;
    }

    const elements = [];
    let currentPos = 0;

    filtered.forEach((item, index) => {
      // Add text before this match
      if (item.start > currentPos) {
        elements.push(
          <span key={`text-${index}`} className="token-text">
            {code.slice(currentPos, item.start)}
          </span>
        );
      }

      // Add highlighted match
      elements.push(
        <span key={`${item.type}-${index}`} className={`token-${item.type}`}>
          {item.text}
        </span>
      );

      currentPos = item.end;
    });

    // Add remaining text
    if (currentPos < code.length) {
      elements.push(
        <span key="text-end" className="token-text">
          {code.slice(currentPos)}
        </span>
      );
    }

    return <code>{elements}</code>;
  };

  return (
    <div className={`code-block ${isEditor ? 'code-block-editor' : ''}`}>
      {!isEditor && (
        <div className="code-header">
          <span className="code-language">{language}</span>
          <div className="code-actions">
            <span className="code-hint">Syntax highlighted</span>
          </div>
        </div>
      )}
      <pre>{highlightCode(code)}</pre>
    </div>
  );
}

export default CodeBlock;
