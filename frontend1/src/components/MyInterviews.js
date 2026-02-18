import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

const MyInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchInterviews();
  }, [user]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/candidates/my-interviews');
      setInterviews(res.data);
    } catch (error) {
      console.error('Failed to fetch interviews', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '30px',
          alignItems: 'center',
        }}
      >
        <h2 style={{ margin: 0 }}>My Interviews</h2>
        <button
          onClick={fetchInterviews}
          style={{
            padding: '8px 15px',
            background: '#f3f4f6',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          🔄 Refresh List
        </button>
      </div>

      {loading && (
        <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
      )}

      {!loading && interviews.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            color: '#9ca3af',
            padding: '40px',
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}
        >
          <p>You have no scheduled interviews yet.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '20px',
          }}
        >
          {interviews.map((interview) => (
            <div
              key={interview.id}
              style={{
                background: 'white',
                padding: '20px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                borderLeft: '5px solid #8b5cf6',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ width: '100%' }}>
                  <h3 style={{ margin: 0, color: '#111827' }}>
                    {interview.jobs?.title}
                  </h3>
                  <p
                    style={{
                      color: '#6b7280',
                      fontSize: '0.9em',
                    }}
                  >
                    Recruiter: {interview.recruiter_id?.users?.name}
                  </p>
                </div>

                <div
                  style={{
                    background: '#f0fdf4',
                    padding: '15px',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: '#065f46',
                      fontWeight: 'bold',
                    }}
                  >
                    {new Date(interview.start_time).toLocaleString()}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: '#065f46',
                      fontSize: '0.85em',
                    }}
                  >
                    Status: {interview.status}
                  </p>
                </div>

                <div
                  style={{
                    background: '#f3f4f6',
                    padding: '15px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.9em',
                      color: '#4b5563',
                    }}
                  >
                    Meeting Link:{' '}
                    <a
                      href={`https://meet.google.com/${Math.random()
                        .toString(36)
                        .slice(-7)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: '#4F46E5',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        marginLeft: '5px',
                      }}
                    >
                      Join Meeting
                    </a>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInterviews;
