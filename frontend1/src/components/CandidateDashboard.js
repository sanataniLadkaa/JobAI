import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CandidateDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Candidate Portal</h2>
          <p style={{ color: '#666', margin: 0 }}>Welcome, {user.name}</p>
        </div>
        <button onClick={logout} style={{ padding: '8px 15px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Logout
        </button>
      </header>

      <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Card 1: Find Jobs */}
        <div style={{ background: '#fff', padding: '20px', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer' }} onClick={() => navigate('/candidate-jobs')}>
          <h3 style={{ color: '#10b981', margin: '0 0 10px 0' }}>💼 Find Jobs</h3>
          <p style={{ color: '#666', margin: 0 }}>Browse and apply to open positions.</p>
        </div>

        {/* Card 2: My Applications */}
        <div 
  style={{ background: '#fff', padding: '20px', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer' }} 
  onClick={() => navigate('/my-applications')}
>
  <h3 style={{ color: '#f59e0b', margin: '0 0 10px 0' }}>📄 My Applications</h3>
  <p style={{ color: '#666', margin: 0 }}>Check status of applied jobs.</p>
</div>

        {/* Card 3: Profile */}
        <div 
          style={{ background: '#fff', padding: '20px', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer' }} 
          onClick={() => navigate('/edit-profile')}
        >
          <h3 style={{ color: '#6366f1', margin: '0 0 10px 0' }}>👤 My Profile</h3>
          <p style={{ color: '#666', margin: 0 }}>Update skills and resume.</p>
        </div>
        <div 
  style={{ background: '#fff', padding: '20px', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer' }} 
  onClick={() => navigate('/salary-estimator')}
>
  <h3 style={{ color: '#8b5cf6', margin: '0 0 10px 0' }}>💰 Salary Estimator</h3>
  <p style={{ color: '#666', margin: 0 }}>Check market value based on skills.</p>
</div>
      </div>
    </div>
  );
};

export default CandidateDashboard;