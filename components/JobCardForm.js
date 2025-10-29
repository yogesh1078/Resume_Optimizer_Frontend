import { useState, useEffect } from 'react';

export default function JobCardForm({ onSave, onCancel, initialData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    clientName: '',
    companyName: '',
    position: '',
    jobDescription: '',
    jobLink: '',
    baseResume: ''
  });

  useEffect(() => {
    const fetchBaseResume = async () => {
      if (initialData?.baseResumeId) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/resumes/${initialData.baseResumeId._id || initialData.baseResumeId}`);
          const data = await response.json();
          setFormData(prev => ({
            ...prev,
            baseResume: data.content || ''
          }));
        } catch (error) {
          console.error('Error fetching base resume:', error);
        }
      }
    };

    if (initialData) {
      setFormData({
        clientName: initialData.clientName || '',
        companyName: initialData.companyName || '',
        position: initialData.position || '',
        jobDescription: initialData.jobDescription || '',
        jobLink: initialData.jobLink || '',
        baseResume: ''  // Will be populated by fetchBaseResume if available
      });
      
      fetchBaseResume();
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
    onCancel(); // Auto-close the modal after saving
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '20px', color: '#2d3748' }}>
        {initialData ? 'Edit Job Card' : 'Create New Job Card'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Client Name *</label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Company Name *</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Position *</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Job Description *</label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Job Application Link</label>
          <input
            type="url"
            name="jobLink"
            value={formData.jobLink}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Base Resume Text *</label>
          <textarea
            name="baseResume"
            value={formData.baseResume}
            onChange={handleChange}
            required
            placeholder="Paste the base resume content here..."
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>

      <style jsx>{`
        .error-message {
          color: #dc3545;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        .form-group {
          opacity: ${isLoading ? '0.7' : '1'};
          pointer-events: ${isLoading ? 'none' : 'auto'};
          transition: opacity 0.2s;
        }
      `}</style>
    </div>
  );
}

