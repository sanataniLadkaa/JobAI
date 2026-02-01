import React, { useState, useEffect } from 'react';
import api from '../api';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  const fetchMyApps = async () => {
    try {
      const res = await api.get('/api/applications/mine');
      setApplications(res.data);
    } catch (error) {
      console.error("Failed to fetch applications");
    }
  };

  useEffect(() => {
    fetchMyApps();
  }, []);

  // Helper to get badge color
  const getStatusBadge = (status) => {
    let color = '#ccc'; // Default
    if (status === 'Shortlisted' || status === 'Accepted') color = '#d1fae5'; // Green
    if (status === 'Rejected') color = '#fee2e2'; // Red
    if (status === 'Pending') color = '#fef3c7'; // Yellow
    
    return {
      padding: '4px 12px', 
      borderRadius: '12px', 
      fontSize: '0.85em', 
      fontWeight: 'bold',
      background: color,
      color: status === 'Rejected' ? '#991b1b' : (status === 'Pending' ? '#92400e' : '#065f46')
    };
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>My Applications</h2>
        <button 
          onClick={fetchMyApps} 
          style={{ padding: '5px 10px', background: '#f3f4f6', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}
        >
          🔄 Refresh
        </button>
      </div>

      {applications.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', padding: '40px', background: '#fff', borderRadius: '8px' }}>
          <p>You haven't applied to any jobs yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {applications.map((app) => (
            <div key={app.id} style={{ 
              border: '1px solid #eee', 
              padding: '20px', 
              borderRadius: '8px', 
              background: '#fff',
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center' 
            }}>
              <div>
                <h3 style={{ margin: 0 }}>{app.job_title}</h3>
                <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9em' }}>
                  Applied on {new Date(app.applied_at).toLocaleDateString()}
                </p>
              </div>
              
              <div style={getStatusBadge(app.status)}>
                {app.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;