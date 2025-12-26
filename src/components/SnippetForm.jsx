import { useState, useEffect } from 'react';

function SnippetForm({ onSubmit, editingSnippet, onCancel }) {
  const getInitialFormData = () => ({
    title: editingSnippet?.title || '',
    description: editingSnippet?.description || '',
    code: editingSnippet?.code || '',
    language: editingSnippet?.language || 'JavaScript',
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
    if (!formData.title.trim() || !formData.code.trim()) return;
    
    onSubmit(formData);
    setFormData(getInitialFormData());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="language">Language *</label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
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
      </div>
      
      <div className="form-group">
        <label htmlFor="code">Code *</label>
        <textarea
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="Paste your code here..."
          rows="12"
          required
          className="code-textarea"
        />
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
