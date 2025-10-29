import { useState, useEffect, useRef } from 'react';

export default function JobCard({ job, onEdit, onDelete, onOptimize, onViewChanges }) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [needsReoptimization, setNeedsReoptimization] = useState(false);
  const [optimizationError, setOptimizationError] = useState('');
  const previousJobDescription = useRef(job.jobDescription);

  useEffect(() => {
    // Check if job description has changed
    if (previousJobDescription.current !== job.jobDescription) {
      if (job.status === 'Optimized') {
        setNeedsReoptimization(true);
      }
      previousJobDescription.current = job.jobDescription;
    }
  }, [job.jobDescription, job.status]);

  const handleOptimize = async () => {
    try {
      setOptimizationError('');
      setIsOptimizing(true);
      setNeedsReoptimization(false);
      await onOptimize();
    } catch (error) {
      setOptimizationError(error.response?.data?.error || 'Failed to optimize resume');
      setNeedsReoptimization(true); // Keep reoptimization flag if there's an error
    } finally {
      setIsOptimizing(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Optimized':
        return 'status-optimized';
      case 'In Progress':
        return 'status-progress';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">{job.position}</div>
        <span className={`card-status ${getStatusClass(job.status)}`}>
          {job.status}
        </span>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Client:</strong> {job.clientName}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Company:</strong> {job.companyName}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Job Description:</strong>
        <p style={{ 
          marginTop: '5px', 
          fontSize: '0.9rem', 
          color: '#4a5568',
          whiteSpace: 'pre-wrap',
          maxHeight: '100px',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {job.jobDescription.substring(0, 150)}...
        </p>
      </div>

      {job.optimizedOn && (
        <div style={{ marginBottom: '15px', fontSize: '0.9rem', color: '#718096' }}>
          <strong>Optimized On:</strong> {new Date(job.optimizedOn).toLocaleString()}
        </div>
      )}
      
      {optimizationError && (
        <div style={{ 
          marginBottom: '15px', 
          padding: '10px', 
          backgroundColor: '#fff5f5', 
          color: '#c53030',
          border: '1px solid #feb2b2',
          borderRadius: '4px',
          fontSize: '0.9rem'
        }}>
          {optimizationError}
        </div>
      )}

      <style jsx>{`
        .reoptimization-notice {
          width: 100%;
          margin-bottom: 10px;
          padding: 8px;
          background-color: #fff3cd;
          color: #856404;
          border: 1px solid #ffeeba;
          border-radius: 4px;
          font-size: 0.9rem;
          text-align: center;
        }
        .btn-warning {
          background-color: #ffc107;
          color: #000;
        }
        .btn-warning:hover {
          background-color: #e0a800;
        }
      `}</style>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${needsReoptimization ? 'btn-warning' : 'btn-primary'} ${optimizationError ? 'btn-error' : ''}`}
          onClick={handleOptimize}
          disabled={isOptimizing}
          style={{ opacity: isOptimizing ? 0.7 : 1 }}
        >
          {isOptimizing ? 'Optimizing...' : 
           needsReoptimization ? 'Reoptimize Resume' : 'Optimize Resume'}
        </button>
        
        {job.status === 'Optimized' && (
          <>
            {needsReoptimization && (
              <div className="reoptimization-notice">
                Job description has changed. Reoptimization recommended.
              </div>
            )}
            <button 
              className="btn btn-success" 
              onClick={onViewChanges}
            >
              View Changes
            </button>
          </>
        )}
        
        <button 
          className="btn btn-outline" 
          onClick={onEdit}
        >
          Edit
        </button>
        
        <button 
          className="btn btn-danger" 
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

