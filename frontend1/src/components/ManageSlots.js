import React, { useState, useEffect } from 'react';
import api from '../api';

const ManageSlots = () => {
  const [jobs, setJobs] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [newSlot, setNewSlot] = useState({
    job_id: '',
    date: '',
    time: '09:00',
    duration: 30
  });

  // Load Jobs
  useEffect(() => {
    api.get('/api/jobs').then(res => setJobs(res.data)).catch(console.error);
    fetchMySlots();
  }, []);

  const fetchMySlots = async () => {
    try {
      const res = await api.get('/api/slots/my');
      setSlots(res.data);
    } catch(e) { console.error(e); }
  };

  const createSlot = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Combine Date + Time
    const startISO = new Date(`${newSlot.date}T${newSlot.time}`).toISOString();

    try {
      await api.post('/api/slots', {
        job_id: parseInt(newSlot.job_id),
        start_time: startISO,
        duration_minutes: parseInt(newSlot.duration)
      });
      alert("Slot created successfully");
      setNewSlot({ job_id: '', date: '', time: '09:00', duration: 30 });
      fetchMySlots();
    } catch (error) {
      if (error.response && error.response.data.detail) {
        alert(error.response.data.detail); // Catches Overlap error
      } else {
        alert("Failed to create slot");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (slotId, status) => {
    if (!window.confirm(`Mark as ${status}?`)) return;
    try {
      await api.put(`/api/slots/${slotId}/status`, { status });
      fetchMySlots();
    } catch (e) { alert("Error updating status"); }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h2>Interview Slots (Gmail Style Booking)</h2>
      </div>

      {/* Create Form */}
      <div style={{ background: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h4>Create Available Slot</h4>
        <form onSubmit={createSlot} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '15px' }}>
          <div>
            <label>Job</label>
            <select value={newSlot.job_id} onChange={e => setNewSlot({...newSlot, job_id: e.target.value})} required style={{ width: '100%', padding: '10px' }}>
              <option value="">Select Job</option>
              {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
          </div>
          <div>
            <label>Date</label>
            <input type="date" value={newSlot.date} onChange={e => setNewSlot({...newSlot, date: e.target.value})} required style={{ width: '100%', padding: '10px' }} />
          </div>
          <div>
            <label>Start Time</label>
            <input type="time" value={newSlot.time} onChange={e => setNewSlot({...newSlot, time: e.target.value})} required style={{ width: '100%', padding: '10px' }} />
          </div>
          <div>
            <label>Duration</label>
            <select value={newSlot.duration} onChange={e => setNewSlot({...newSlot, duration: e.target.value})} style={{ width: '100%', padding: '10px' }}>
              <option value="30">30 Minutes</option>
              <option value="60">1 Hour</option>
            </select>
          </div>
          <div style={{ gridColumn: 'span 3' }}>
            <button type="submit" disabled={loading} style={{ padding: '12px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '100%' }}>
              {loading ? 'Creating...' : 'Create Slot'}
            </button>
          </div>
        </form>
      </div>

      {/* My Slots List */}
      <h4>My Schedule</h4>
      {slots.length === 0 && <p style={{ color: '#666' }}>No slots created yet.</p>}
      
      <div style={{ display: 'grid', gap: '15px' }}>
        {slots.map(slot => (
          <div key={slot.id} style={{ background: 'white', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{new Date(slot.start_time).toLocaleString()}</strong>
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                Status: <span style={{ 
                  padding: '2px 6px', borderRadius: '4px', background: 
                  slot.status === 'booked' ? '#d1fae5' : (slot.status === 'completed' ? '#f3f4f6' : '#fee2e2'), 
                  color: slot.status === 'booked' ? '#065f46' : (slot.status === 'completed' ? '#374151' : '#991b1b') 
                }}>{slot.status}</span>
              </div>
              {slot.candidate_id && <div style={{ fontSize: '0.9em', marginTop: '5px' }}>Booked by Candidate ID: {slot.candidate_id}</div>}
            </div>
            
            <div style={{ display: 'flex', gap: '5px' }}>
              {slot.status === 'booked' && (
                <button onClick={() => updateStatus(slot.id, 'completed')} style={{ padding: '5px 10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Mark Complete</button>
              )}
              {slot.status !== 'cancelled' && (
                <button onClick={() => updateStatus(slot.id, 'cancelled')} style={{ padding: '5px 10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSlots;