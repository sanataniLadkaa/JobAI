import React, { useState, useEffect } from 'react';
import api from '../api';

const ShortlistedCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ date: '', time: '', type: 'Zoom', notes: '', rating: '', feedback: '' });
  const [currentAction, setCurrentAction] = useState(null); // 'schedule' or 'feedback'
  const [currentAppId, setCurrentAppId] = useState(null);

  // Fetch ONLY Shortlisted
  useEffect(() => {
    const fetchShortlisted = async () => {
      try {
        // We pass status as query param
        const res = await api.get('/api/applications?status=Shortlisted');
        setCandidates(res.data);
      } catch (error) {
        console.error("Failed to fetch shortlisted candidates");
      }
    };
    fetchShortlisted();
  }, []);

  // Open Modal for specific action
  const openModal = (type, appId) => {
    setCurrentAction(type);
    setCurrentAppId(appId);
    setModalOpen(true);
    // Reset form
    setFormData({ date: '', time: '', type: 'Zoom', notes: '', rating: '', feedback: '' });
  };

  // Handle Submit (Schedule or Feedback)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Combine Date & Time for ISO string
    const scheduledAt = new Date(`${formData.date}T${formData.time}`).toISOString();

    try {
      if (currentAction === 'schedule') {
        await api.post('/api/interviews', {
          application_id: currentAppId,
          scheduled_at: scheduledAt,
          interview_type: formData.type,
          recruiter_notes: formData.notes
        });
        alert("📅 Interview Scheduled!");
      } else if (currentAction === 'feedback') {
        await api.put(`/api/interviews/${currentAppId}/feedback`, {
          rating: parseInt(formData.rating),
          text: formData.feedback
        });
        alert("✅ Feedback Saved!");
      }
      setModalOpen(false);
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Shortlisted Candidates</h2>
        <button 
          onClick={() => window.location.href='/view-applications'} 
          style={{ padding: '8px 15px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          ← Back to All
        </button>
      </div>

      {/* Action Bar */}
      <div style={{ background: '#eff6ff', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', color: '#1e40af' }}>{selectedIds.length} Selected</span>
        <button 
          onClick={() => openModal('schedule', selectedIds[0])} // Schedule first selected
          disabled={selectedIds.length !== 1} // Only allow schedule for 1 at a time
          style={{ padding: '8px 15px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', opacity: selectedIds.length === 1 ? 1 : 0.5 }}
        >
          📅 Schedule Interview
        </button>
      </div>

      {/* Candidates Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {candidates.map((app) => (
          <div key={app.id} style={{ 
            border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', background: 'white', 
            position: 'relative', display: 'flex', flexDirection: 'column', gap: '10px' 
          }}>
            
            {/* Checkbox & Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(app.id)}
                  onChange={() => setSelectedIds(prev => prev.includes(app.id) ? prev.filter(i => i !== app.id) : [...prev, app.id])}
                  style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                />
                <h3 style={{ margin: 0 }}>{app.candidate_name}</h3>
              </div>
              <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '0.9em' }}>Shortlisted</span>
            </div>

            {/* Skills & Info */}
            <div style={{ fontSize: '0.9em', color: '#4b5563' }}>
              <p><strong>Job:</strong> {app.job_title}</p>
              <p><strong>Skills:</strong> {Array.isArray(app.skills) ? app.skills.join(', ') : 'N/A'}</p>
            </div>

            {/* Buttons */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => openModal('schedule', app.id)}
                style={{ flex: 1, padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Schedule Interview
              </button>
              <button 
                onClick={() => openModal('feedback', app.id)}
                style={{ flex: 1, padding: '10px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Add Feedback
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Universal Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0 }}>{currentAction === 'schedule' ? '📅 Schedule Interview' : '📝 Give Feedback'}</h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {currentAction === 'schedule' ? (
                <>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Date</label>
                    <input 
                      type="date" 
                      required 
                      value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
                      style={{ width: '100%', padding: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Time</label>
                    <input 
                      type="time" 
                      required 
                      value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})}
                      style={{ width: '100%', padding: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Type</label>
                    <select 
                      value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                      style={{ width: '100%', padding: '8px' }}
                    >
                      <option>Zoom</option>
                      <option>In-Person</option>
                      <option>Phone</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Recruiter Notes</label>
                    <textarea 
                      value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="e.g. Mention high availability..."
                      style={{ width: '100%', padding: '8px', minHeight: '60px' }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Rating (1-5)</label>
                    <input 
                      type="number" min="1" max="5"
                      required 
                      value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})}
                      style={{ width: '100%', padding: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Feedback Text</label>
                    <textarea 
                      value={formData.feedback} onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                      placeholder="e.g. Strong portfolio..."
                      style={{ width: '100%', padding: '8px', minHeight: '60px' }}
                    />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px' }}>Save</button>
                <button type="button" onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '10px', background: '#9ca3af', color: 'white', border: 'none', borderRadius: '5px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ShortlistedCandidates;