import { useState, useEffect } from 'react';

function SnippetForm({ onSubmit, editingSnippet, onCancel }) {
  const getInitialCodeBlock = () => ({
    code: '',
    language: 'JavaScript'
  });

  const getInitialFormData = () => ({
    title: editingSnippet?.title || '',
    description: editingSnippet?.description || '',
    codeBlocks: editingSnippet?.codeBlocks || [getInitialCodeBlock()],
    category: editingSnippet?.category || 'Frontend',
    tags: editingSnippet?.tags || []
  });

  const [formData, setFormData] = useState(getInitialFormData);
  const [tagInput, setTagInput] = useState('');

  // Update form when editing a different snippet
  useEffect(() => {
    setFormData(getInitialFormData());
    setTagInput('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingSnippet?.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.codeBlocks.every(block => !block.code.trim())) return;
    
    const validCodeBlocks = formData.codeBlocks.filter(block => block.code.trim());
    onSubmit({ ...formData, codeBlocks: validCodeBlocks });
    setFormData(getInitialFormData());
    setTagInput('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCodeBlockChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      codeBlocks: prev.codeBlocks.map((block, i) => 
        i === index ? { ...block, [field]: value } : block
      )
    }));
  };

  const addCodeBlock = () => {
    setFormData(prev => ({
      ...prev,
      codeBlocks: [getInitialCodeBlock(), ...prev.codeBlocks]
    }));
  };

  const removeCodeBlock = (index) => {
    if (formData.codeBlocks.length === 1) return;
    setFormData(prev => ({
      ...prev,
      codeBlocks: prev.codeBlocks.filter((_, i) => i !== index)
    }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && !tagInput && formData.tags.length > 0) {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.slice(0, -1)
      }));
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };

  const categoryIcons = {
    Frontend: '🎨',
    Backend: '⚙️',
    Database: '🗄️',
    Algorithms: '🧮',
    Utilities: '🔧',
    DevOps: '🚀',
    Testing: '🧪',
    Security: '🔒'
  };

  return (
    <form onSubmit={handleSubmit} className="snippet-form">
      <h2>
        {editingSnippet ? (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit Snippet
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Snippet
          </>
        )}
      </h2>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Array Filter Function"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <div className="select-with-icon">
            <span className="select-icon">{categoryIcons[formData.category] || '📁'}</span>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="Algorithms">Algorithms</option>
              <option value="Utilities">Utilities</option>
              <option value="DevOps">DevOps</option>
              <option value="Testing">Testing</option>
              <option value="Security">Security</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of what this snippet does"
        />
      </div>

      <div className="form-group">
        <label>Tags</label>
        <div className="tag-input-wrapper">
          {formData.tags.map(tag => (
            <span key={tag} className="tag-chip">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="tag-remove" aria-label={`Remove tag ${tag}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={addTag}
            placeholder={formData.tags.length === 0 ? 'Type a tag and press Enter...' : 'Add more...'}
            className="tag-input"
          />
        </div>
      </div>
      
      <div className="code-blocks-section">
        <div className="code-blocks-header">
          <label>Code Blocks *</label>
          <button 
            type="button" 
            onClick={addCodeBlock}
            className="btn-add-code"
            title="Add another code block"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Block
          </button>
        </div>
        
        {formData.codeBlocks.map((block, index) => (
          <div key={index} className="code-block-group">
            <div className="code-block-header">
              <select
                value={block.language}
                onChange={(e) => handleCodeBlockChange(index, 'language', e.target.value)}
                className="code-block-language"
                required
              >
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="React">React</option>
                <option value="Python">Python</option>
                <option value="SQL">SQL</option>
                <option value="HTML">HTML</option>
                <option value="CSS">CSS</option>
                <option value="JSON">JSON</option>
                <option value="Bash">Bash</option>
                <option value="Go">Go</option>
                <option value="Rust">Rust</option>
                <option value="Other">Other</option>
              </select>
              
              {formData.codeBlocks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCodeBlock(index)}
                  className="btn-remove-code"
                  title="Remove this code block"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            
            <textarea
              value={block.code}
              onChange={(e) => handleCodeBlockChange(index, 'code', e.target.value)}
              placeholder={`Paste your ${block.language} code here...`}
              rows="10"
              required
              className="code-textarea"
              spellCheck="false"
            />
          </div>
        ))}
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {editingSnippet ? 'Update Snippet' : 'Save Snippet'}
        </button>
        {editingSnippet && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default SnippetForm;
