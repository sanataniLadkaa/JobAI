import React, { useState, useEffect } from 'react';
import api from '../api';

const BookSlot = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/slots/available');
      setSlots(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const bookSlot = async (slotId) => {
    if (!window.confirm("Are you sure you want to book this interview slot?")) return;

    try {
      await api.put('/api/slots/book', { id: slotId, status: 'available' });
      alert("Slot Booked Successfully!");
      fetchSlots();
    } catch (e) {
      console.error(e);
      if(e.response && e.response.data) alert(e.response.data.detail); // Catches RLS violation or double booking
      else alert("Booking failed");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Available Interview Slots</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Select an available time slot to book your interview.</p>

      {loading ? <p>Loading slots...</p> : (
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {slots.map(slot => (
            <div key={slot.id} style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <div style={{ marginBottom: '10px' }}>
                <h3 style={{ margin: 0, color: '#0f172a' }}>{slot.jobs?.title || 'Interview'}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9em' }}>Recruiter: {slot.recruiter_id.users.name}</p>
              </div>
              
              <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
                <strong style={{ display: 'block', color: '#166534' }}>
                  {new Date(slot.start_time).toLocaleString()}
                </strong>
                <span style={{ display: 'block', fontSize: '0.85em', color: '#059669' }}>
                  Duration: {(new Date(slot.end_time) - new Date(slot.start_time)) / 60000} mins
                </span>
              </div>

              <button 
                onClick={() => bookSlot(slot.id)}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  background: '#4F46E5', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold'
                }}
              >
                Book Slot
              </button>
            </div>
          ))}
          {slots.length === 0 && !loading && <p>No available slots found.</p>}
        </div>
      )}
    </div>
  );
};

export default BookSlot;