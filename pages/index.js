import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import JobCard from '../components/JobCard';
import JobCardForm from '../components/JobCardForm';
import axios from 'axios';
import ChangesView from '../components/ChangesView';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs`);
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const handleCreateJob = async (jobData) => {
    try {
      // First, create the base resume
      const resumeResponse = await axios.post(`${API_URL}/resumes`, {
        clientName: jobData.clientName,
        content: jobData.baseResume || 'Base resume content will be uploaded here.',
        version: 'base'
      });

      // Then create the job with the resume ID
      const jobResponse = await axios.post(`${API_URL}/jobs`, {
        ...jobData,
        baseResumeId: resumeResponse.data._id
      });

      setJobs([...jobs, jobResponse.data]);
      setShowForm(false);
      alert('Job created successfully!');
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job');
    }
  };

  const handleUpdateJob = async (jobId, jobData) => {
    try {
      const response = await axios.put(`${API_URL}/jobs/${jobId}`, jobData);
      setJobs(jobs.map(job => job._id === jobId ? response.data : job));
      setEditingJob(null);
      alert('Job updated successfully!');
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Failed to update job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await axios.delete(`${API_URL}/jobs/${jobId}`);
      setJobs(jobs.filter(job => job._id !== jobId));
      alert('Job deleted successfully!');
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const handleOptimizeResume = async (jobId) => {
    if (!confirm('This will use AI to optimize the resume. Continue?')) return;

    try {
      const response = await axios.post(`${API_URL}/optimization/optimize`, {
        jobId
      });

      // Refresh jobs to get updated status
      fetchJobs();
      alert('Resume optimized successfully! Check the job card for updates.');
    } catch (error) {
      console.error('Error optimizing resume:', error);
      alert('Failed to optimize resume. Please check your API keys.');
    }
  };

  const handleViewChanges = (job) => {
    setSelectedJob(job);
  };

  const closeChangesView = () => {
    setSelectedJob(null);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', color: '#2d3748' }}>Job Dashboard</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Job Card'}
          </button>
        </div>

        {showForm && (
          <JobCardForm
            onSave={editingJob ? (data) => handleUpdateJob(editingJob._id, data) : handleCreateJob}
            onCancel={() => {
              setShowForm(false);
              setEditingJob(null);
            }}
            initialData={editingJob}
          />
        )}

        {jobs.length === 0 ? (
          <div className="card text-center">
            <p style={{ fontSize: '1.2rem', color: '#718096' }}>
              No job cards yet. Create your first job card!
            </p>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map(job => (
              <JobCard
                key={job._id}
                job={job}
                onEdit={() => {
                  setEditingJob(job);
                  setShowForm(true);
                }}
                onDelete={() => handleDeleteJob(job._id)}
                onOptimize={() => handleOptimizeResume(job._id)}
                onViewChanges={() => handleViewChanges(job)}
              />
            ))}
          </div>
        )}

        {selectedJob && (
          <ChangesView job={selectedJob} onClose={closeChangesView} />
        )}
      </div>
    </>
  );
}

