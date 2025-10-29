import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function OptimizePage() {
  const router = useRouter();
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [clientName, setClientName] = useState('');
  const [optimizedResume, setOptimizedResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleOptimize = async () => {
    if (!resumeText || !jobDescription || !clientName) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/optimization/direct`, {
        baseResume: resumeText,
        jobDescription,
        clientName
      });

      setOptimizedResume(response.data.optimizedResume);
      setResult({
        changes: response.data.changes,
        success: true
      });
    } catch (error) {
      console.error('Error optimizing resume:', error);
      setResult({
        error: error.response?.data?.error || 'Failed to optimize resume',
        success: false
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 style={{ marginBottom: '30px', color: '#2d3748' }}>Resume Optimizer</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Input Section */}
          <div className="card">
            <h2 style={{ marginBottom: '20px', color: '#2d3748' }}>Input</h2>

            <div className="form-group">
              <label>Client Name *</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name"
              />
            </div>

            <div className="form-group">
              <label>Job Description *</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows="8"
              />
            </div>

            <div className="form-group">
              <label>Base Resume *</label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here..."
                rows="12"
              />
            </div>

            <button 
              className="btn btn-primary" 
              onClick={handleOptimize}
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Optimizing...' : 'Optimize Resume'}
            </button>
          </div>

          {/* Output Section */}
          <div className="card">
            <h2 style={{ marginBottom: '20px', color: '#2d3748' }}>Optimized Resume</h2>

            {loading && <div className="spinner"></div>}

            {result && result.success && (
              <div className="changes-summary">
                <h4>Changes Made</h4>
                <p>{result.changes}</p>
              </div>
            )}

            {result && !result.success && (
              <div style={{ 
                padding: '15px', 
                background: '#fed7d7', 
                color: '#c53030',
                borderRadius: '5px',
                marginBottom: '20px'
              }}>
                <strong>Error:</strong> {result.error}
              </div>
            )}

            {optimizedResume && (
              <div style={{ 
                background: '#f7fafc',
                padding: '20px',
                borderRadius: '5px',
                maxHeight: '500px',
                overflowY: 'auto'
              }}>
                <pre style={{ 
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit',
                  color: '#2d3748'
                }}>
                  {optimizedResume}
                </pre>
              </div>
            )}

            {!optimizedResume && !loading && (
              <p style={{ color: '#718096', textAlign: 'center' }}>
                Optimized resume will appear here
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

