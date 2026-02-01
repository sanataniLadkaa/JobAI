import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

const CandidateJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const { user } = useAuth(); // Get current user to send ID

  const fetchJobs = async () => {
    try {
      const res = await api.get('/api/jobs');
      setJobs(res.data);
    } catch (error) {
      console.error("Failed to fetch jobs");
      setJobs([]);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle Apply
  const handleApply = async (job) => {
    if (!window.confirm(`Apply for ${job.title}?`)) return;

    try {
      const res = await api.post('/api/apply', {
        candidate_id: user.id,
        candidate_name: user.name,
        job_id: job.id,
        job_title: job.title
      });
      
      alert(res.data.message);
      // Mark as applied locally to disable button
      setAppliedJobIds([...appliedJobIds, job.id]);
    } catch (error) {
      console.error(error);
      if(error.response && error.response.status === 400) {
        alert(error.response.data.detail);
      } else {
        alert("Error applying for job");
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Available Positions</h2>
        <button onClick={fetchJobs} style={{ padding: '5px 10px', background: '#f3f4f6', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}>🔄 Refresh</button>
      </div>

      {jobs.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No jobs posted yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {jobs.map((job) => (
            <div key={job.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
              <div>
                <h3 style={{ margin: 0 }}>{job.title}</h3>
                <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9em' }}>{job.company}</p>
                <div style={{ marginTop: '10px' }}>
                  {job.required_skills.map((s, i) => (
                    <span key={i} style={{ background: '#e0e7ff', color: '#3730a3', padding: '3px 8px', borderRadius: '12px', fontSize: '0.8em', marginRight: '5px' }}>{s}</span>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => handleApply(job)}
                disabled={appliedJobIds.includes(job.id)}
                style={{ 
                  padding: '10px 25px', 
                  background: appliedJobIds.includes(job.id) ? '#9ca3af' : '#10b981', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: appliedJobIds.includes(job.id) ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold' 
                }}
              >
                {appliedJobIds.includes(job.id) ? 'Applied' : 'Apply Now'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateJobs;