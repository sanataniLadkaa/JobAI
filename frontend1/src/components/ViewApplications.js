import React, { useState, useEffect } from 'react';
import api from '../api';

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]); // Store IDs of checked rows

  const fetchApplications = async () => {
    try {
      const res = await api.get('/api/applications');
      setApplications(res.data);
      setSelectedIds([]); // Clear selection on refresh
    } catch (error) {
      console.error("Failed to fetch applications");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Toggle Checkbox Selection
  const handleSelect = (id) => {
    if (selectedIds.includes(id)) {
      // Remove if already selected
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      // Add if not selected
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Select All / Deselect All Helper
  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applications.map(app => app.id));
    }
  };

  // Bulk Update Status
  const handleBulkAction = async (newStatus) => {
    if (selectedIds.length === 0) {
      alert("Please select at least one application.");
      return;
    }

    if (!window.confirm(`Are you sure you want to mark ${selectedIds.length} candidates as ${newStatus}?`)) {
      return;
    }

    try {
      // Send update requests for all selected IDs in parallel
      await Promise.all(
        selectedIds.map(id => api.put(`/api/applications/${id}/status`, { status: newStatus }))
      );

      alert(`✅ ${selectedIds.length} applications marked as ${newStatus}`);
      
      // Refresh list to see changes
      fetchApplications();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update some applications");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <h2>Received Applications</h2>
        <button onClick={fetchApplications} style={{ padding: '5px 10px', background: '#f3f4f6', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}>Refresh</button>
      </div>

      {/* Bulk Action Buttons */}
      <div style={{ background: '#e0f2fe', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', color: '#0369a1' }}>
          {selectedIds.length} Selected:
        </span>
        
        <button 
          onClick={() => handleBulkAction('Shortlisted')}
          disabled={selectedIds.length === 0}
          style={{ padding: '8px 15px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', opacity: selectedIds.length === 0 ? 0.5 : 1 }}
        >
          Shortlist Selected
        </button>
        
        <button 
          onClick={() => handleBulkAction('Rejected')}
          disabled={selectedIds.length === 0}
          style={{ padding: '8px 15px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', opacity: selectedIds.length === 0 ? 0.5 : 1 }}
        >
          Reject Selected
        </button>
      </div>

      {applications.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', padding: '40px', background: '#fff', borderRadius: '8px' }}>
          <p>No applications received yet.</p>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #eee', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb', borderBottom: '2px solid #eee' }}>
              <tr>
                <th style={{ padding: '15px', width: '40px', textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length > 0 && selectedIds.length === applications.length}
                    onChange={toggleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Candidate</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Job Title</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(app.id)}
                      onChange={() => handleSelect(app.id)}
                      style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                    />
                  </td>
                  <td style={{ padding: '15px' }}>
                    <strong>{app.candidate_name}</strong>
                  </td>
                  <td style={{ padding: '15px' }}>{app.job_title}</td>
                  <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>
                    {new Date(app.applied_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '12px', fontSize: '0.8em', fontWeight: 'bold',
                      background: app.status === 'Pending' ? '#fef3c7' : (app.status === 'Rejected' ? '#fee2e2' : '#d1fae5'),
                      color: app.status === 'Pending' ? '#92400e' : (app.status === 'Rejected' ? '#991b1b' : '#065f46')
                    }}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewApplications;