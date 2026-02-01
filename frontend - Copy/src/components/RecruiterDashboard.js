import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const RecruiterDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#4F46E5' }}>Recruiter Dashboard</h2>
          <p style={{ color: '#666', margin: 0 }}>Welcome, {user.name}</p>
        </div>
        <button onClick={logout} style={{ padding: '8px 15px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Logout
        </button>
      </header>

      <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recruiter Specific Actions */}
        <div style={{ background: '#fff', padding: '20px', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer' }} onClick={() => navigate('/search')}>
          <h3 style={{ color: '#4F46E5', margin: '0 0 10px 0' }}>🔍 AI Candidate Search</h3>
          <p style={{ color: '#666', margin: 0 }}>Search & Rank candidates using RAG.</p>
        </div>
        
        <div style={{ background: '#fff', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
          <h3 style={{ color: '#6366f1', margin: '0 0 10px 0' }}>📞 Voice Call Logs</h3>
          <p style={{ color: '#666', margin: 0 }}>Track automated calls.</p>
        </div>

        <div 
          style={{ background: '#fff', padding: '20px', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer' }} 
          onClick={() => navigate('/shortlisted')}
        >
          <h3 style={{ color: '#10b981', margin: '0 0 10px 0' }}>⭐ Shortlisted Candidates</h3>
          <p style={{ color: '#666', margin: 0 }}>Process interviews & feedback.</p>
        </div>

        <div 
          style={{ background: '#fff', padding: '20px', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer' }} 
          onClick={() => navigate('/scheduled-interviews')}
        >
          <h3 style={{ color: '#7c3aed', margin: '0 0 10px 0' }}>📅 Scheduled Interviews</h3>
          <p style={{ color: '#666', margin: 0 }}>View calendar and upcoming meetings.</p>
        </div>


        {/* Change this section inside RecruiterDashboard.js */}

<div 
  style={{ background: '#fff', padding: '20px', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer' }} 
  onClick={() => navigate('/manage-jobs')} // <--- ADD NAVIGATE
>
  <h3 style={{ color: '#ec4899', margin: '0 0 10px 0' }}>📝 Manage Jobs</h3>
  <p style={{ color: '#666', margin: 0 }}>Post, Edit, or Delete jobs.</p>
</div>
<div 
  style={{ background: '#fff', padding: '20px', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer' }} 
  onClick={() => navigate('/view-applications')}
>
  <h3 style={{ color: '#10b981', margin: '0 0 10px 0' }}>📬 View Applications</h3>
  <p style={{ color: '#666', margin: 0 }}>See who applied for your jobs.</p>
</div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;