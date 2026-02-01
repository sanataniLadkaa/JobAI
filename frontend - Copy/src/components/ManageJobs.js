import React, { useState, useEffect } from 'react';
import api from '../api';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentJob, setCurrentJob] = useState({
    id: null,
    title: '',
    company: '',
    description: '',
    required_skills: ''
  });

  // Fetch Jobs
  const fetchJobs = async () => {
    try {
      const res = await api.get('/api/jobs');
      setJobs(res.data);
    } catch (error) {
      console.error("Failed to fetch jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setCurrentJob({ ...currentJob, [e.target.name]: e.target.value });
  };

  // Create or Update Job
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert comma-separated string to array
    const skillsArray = currentJob.required_skills.split(',').map(s => s.trim());

    try {
      if (currentJob.id) {
        // Update
        await api.put(`/api/jobs/${currentJob.id}`, {
          title: currentJob.title,
          company: currentJob.company,
          description: currentJob.description,
          required_skills: skillsArray
        });
      } else {
        // Create
        await api.post('/api/jobs', {
          title: currentJob.title,
          company: currentJob.company,
          description: currentJob.description,
          required_skills: skillsArray
        });
      }
      
      // Reset and Refresh
      setIsEditing(false);
      setCurrentJob({ id: null, title: '', company: '', description: '', required_skills: '' });
      fetchJobs();
    } catch (error) {
      alert("Error saving job");
    }
  };

  // Delete Job
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    
    try {
      await api.delete(`/api/jobs/${id}`);
      fetchJobs();
    } catch (error) {
      alert("Error deleting job");
    }
  };

  // Prepare Edit
  const handleEdit = (job) => {
    setCurrentJob({
      ...job,
      required_skills: job.required_skills.join(', ') // Convert array back to string
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentJob({ id: null, title: '', company: '', description: '', required_skills: '' });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Manage Jobs</h2>

      {/* Form View (Add/Edit) */}
      {isEditing && (
        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
          <h3>{currentJob.id ? 'Edit Job' : 'Post New Job'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input name="title" value={currentJob.title} onChange={handleChange} placeholder="Job Title" required style={{ padding: '10px' }} />
            <input name="company" value={currentJob.company} onChange={handleChange} placeholder="Company Name" required style={{ padding: '10px' }} />
            <textarea name="description" value={currentJob.description} onChange={handleChange} placeholder="Job Description" required style={{ padding: '10px' }} />
            <input name="required_skills" value={currentJob.required_skills} onChange={handleChange} placeholder="Skills (comma separated)" required style={{ padding: '10px' }} />
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Save Job</button>
              <button type="button" onClick={handleCancel} style={{ padding: '10px 20px', background: '#9ca3af', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* List View */}
      {!isEditing && (
        <button onClick={() => setIsEditing(true)} style={{ padding: '10px 20px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}>
          + Post New Job
        </button>
      )}

      <div style={{ display: 'grid', gap: '15px' }}>
        {jobs.map((job) => (
          <div key={job.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0 }}>{job.title}</h3>
                <p style={{ color: '#666', margin: '5px 0' }}>{job.company}</p>
                <p style={{ fontSize: '0.9em', marginTop: '10px' }}>{job.description}</p>
                <div style={{ marginTop: '10px' }}>
                  {job.required_skills.map((s, i) => (
                    <span key={i} style={{ background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8em', marginRight: '5px' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <button onClick={() => handleEdit(job)} style={{ padding: '5px 10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(job.id)} style={{ padding: '5px 10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em' }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageJobs;