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
    category: editingSnippet?.category || 'Frontend'
  });

  const [formData, setFormData] = useState(getInitialFormData);

  // Update form when editing a different snippet
  useEffect(() => {
    setFormData(getInitialFormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingSnippet?.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.codeBlocks.every(block => !block.code.trim())) return;
    
    // Filter out empty code blocks
    const validCodeBlocks = formData.codeBlocks.filter(block => block.code.trim());
    onSubmit({ ...formData, codeBlocks: validCodeBlocks });
    setFormData(getInitialFormData());
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

  return (
    <form onSubmit={handleSubmit} className="snippet-form">
      <h2>{editingSnippet ? 'Edit Snippet' : 'Add New Snippet'}</h2>
      
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
          </select>
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
          placeholder="Brief description"
        />
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
            + Add Code Block
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
                <option value="Other">Other</option>
              </select>
              
              {formData.codeBlocks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCodeBlock(index)}
                  className="btn-remove-code"
                  title="Remove this code block"
                >
                  ✕
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
            />
          </div>
        ))}
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {editingSnippet ? 'Update Snippet' : 'Add Snippet'}
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
