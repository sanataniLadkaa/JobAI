import React, { useState, useEffect } from 'react';
import api from '../api';

const ScheduledInterviews = () => {
  const [interviews, setInterviews] = useState([]);

  const fetchInterviews = async () => {
    try {
      const res = await api.get('/api/interviews');
      setInterviews(res.data);
    } catch (error) {
      console.error("Failed to fetch interviews");
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const getStatusBadge = (interview) => {
    if (interview.feedback_rating) {
      return { text: "Completed", bg: "#d1fae5", color: "#065f46" };
    }
    return { text: "Upcoming", bg: "#e0f2fe", color: "#1e40af" };
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>📅 Scheduled Interviews</h2>
        <button onClick={fetchInterviews} style={{ padding: '5px 10px', background: '#f3f4f6', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}>Refresh</button>
      </div>

      {interviews.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', padding: '40px', background: '#fff', borderRadius: '8px' }}>
          <p>No interviews scheduled yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {interviews.map((interview) => {
            const status = getStatusBadge(interview);
            const dateObj = new Date(interview.scheduled_at);

            return (
              <div key={interview.id} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                padding: '20px', 
                background: 'white',
                display: 'flex', 
                flexDirection: 'column', 
                gap: '10px',
                borderTop: `4px solid ${status.bg}`
              }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '12px', 
                    fontSize: '0.8em', 
                    fontWeight: 'bold',
                    background: status.bg, 
                    color: status.color 
                  }}>
                    {status.text}
                  </span>
                  <span style={{ fontSize: '1.2em' }}>📞</span>
                </div>

                <div>
                  <h3 style={{ margin: '0' }}>{interview.applications.candidate_name}</h3>
                  <p style={{ color: '#666', margin: '5px 0' }}>Applied for: <strong>{interview.applications.job_title}</strong></p>
                </div>

                <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '5px', fontSize: '0.9em' }}>
                  <div><strong>📅 Date:</strong> {dateObj.toLocaleDateString()}</div>
                  <div><strong>⏰ Time:</strong> {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div><strong>📍 Type:</strong> {interview.interview_type}</div>
                </div>

                {interview.recruiter_notes && (
                  <div style={{ fontSize: '0.9em', color: '#4b5563', fontStyle: 'italic' }}>
                    📝 "{interview.recruiter_notes}"
                  </div>
                )}

                {interview.feedback_rating && (
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #ddd' }}>
                    <div style={{ fontSize: '0.9em', color: '#059669' }}>
                      ⭐ Rated: {interview.feedback_rating}/5
                    </div>
                    <div style={{ fontSize: '0.9em', color: '#666' }}>
                      💬 {interview.feedback_text || 'No notes provided.'}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScheduledInterviews;