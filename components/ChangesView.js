import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const downloadAsPdf = async (content, filename) => {
  try {
    // Dynamically import html2pdf only on client side
    const html2pdf = (await import('html2pdf.js')).default;
    
    const element = document.createElement('div');
    element.innerHTML = content.replace(/\*\*/g, '');
    element.style.padding = '20px';
    element.style.fontSize = '12pt';
    element.style.lineHeight = '1.6';

    const opt = {
      margin: 1,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('There was an error generating the PDF. Please try again.');
  }
};

export default function ChangesView({ job, onClose }) {
  const [baseResume, setBaseResume] = useState('');
  const [optimizedResume, setOptimizedResume] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        if (job.baseResumeId) {
          const baseResponse = await axios.get(`${API_URL}/resumes/${job.baseResumeId._id || job.baseResumeId}`);
          setBaseResume(baseResponse.data.content);
        }

        if (job.optimizedResumeId) {
          const optResponse = await axios.get(`${API_URL}/resumes/${job.optimizedResumeId._id || job.optimizedResumeId}`);
          setOptimizedResume(optResponse.data.content);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching resumes:', error);
        setLoading(false);
      }
    };

    fetchResumes();
  }, [job]);

  if (loading) {
    return (
      <div className="modal active">
        <div className="modal-content">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Resume Changes</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="changes-summary">
          <h4>Summary of Changes</h4>
          {job.changes ? (
            <div className="changes-categories">
              {console.log('Changes content:', job.changes)}
              {job.changes.split('* **').filter(Boolean).map((change, index) => {
                // Handle cases where the split doesn't result in two parts
                const parts = change.split(':**');
                const title = parts[0] || 'Changes';
                const content = parts[1] || change;
                
                return (
                  <div key={index} className="change-category">
                    <h5>{title}</h5>
                    <p>{content ? content.replace(/\*/g, '').trim() : 'No specific changes recorded.'}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>Changes were made to optimize the resume for this position.</p>
          )}
        </div>

        <style jsx>{`
          .changes-categories {
            display: grid;
            gap: 1rem;
            padding: 1rem;
          }
          .change-category {
            background: #f5f5f5;
            border-radius: 8px;
            padding: 1rem;
          }
          .change-category h5 {
            color: #2c3e50;
            margin: 0 0 0.5rem 0;
            font-size: 1rem;
          }
          .change-category p {
            margin: 0;
            color: #34495e;
            line-height: 1.5;
          }
        `}</style>

        {baseResume && optimizedResume && (
          <div className="comparison-container">
            <div className="comparison-panel">
              <div className="comparison-title">
                Original Resume
                <button 
                  className="download-btn"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      downloadAsPdf(baseResume, 'original_resume.pdf');
                    }
                  }}
                >
                  Download PDF
                </button>
              </div>
              <div className="comparison-content">{baseResume.replace(/\*\*/g, '')}</div>
            </div>
            <div className="comparison-panel">
              <div className="comparison-title">
                Optimized Resume
                <button 
                  className="download-btn"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      downloadAsPdf(optimizedResume, 'optimized_resume.pdf');
                    }
                  }}
                >
                  Download PDF
                </button>
              </div>
              <div className="comparison-content">{optimizedResume.replace(/\*\*/g, '')}</div>
            </div>
          </div>
        )}

        <style jsx>{`
          .comparison-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            padding: 1rem;
            margin-top: 1rem;
            max-height: 60vh;
            overflow-y: auto;
          }
          .comparison-panel {
            border: 1px solid #e1e4e8;
            border-radius: 8px;
            background: white;
          }
          .comparison-title {
            padding: 1rem;
            font-weight: 600;
            background: #f6f8fa;
            border-bottom: 1px solid #e1e4e8;
            border-radius: 8px 8px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .download-btn {
            padding: 0.4rem 0.8rem;
            background-color: #0366d6;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .download-btn:hover {
            background-color: #0256b4;
          }
          .comparison-content {
            padding: 1.5rem;
            white-space: pre-wrap;
            font-size: 0.95rem;
            line-height: 1.6;
            overflow-y: auto;
            max-height: 50vh;
          }
          .comparison-content::-webkit-scrollbar {
            width: 8px;
          }
          .comparison-content::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .comparison-content::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 4px;
          }
        `}</style>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

