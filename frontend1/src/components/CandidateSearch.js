import React, { useState, useEffect } from 'react';
import api from '../api';

const CandidateSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [loadingRag, setLoadingRag] = useState(false);

  // Booking State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [slotDate, setSlotDate] = useState('');
  const [slotTime, setSlotTime] = useState('09:00');
  const [bookingResult, setBookingResult] = useState(null);

  // Jobs State
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // 🔹 NEW: Scheduled Interviews (for recruiter visibility)
  const [scheduledInterviews, setScheduledInterviews] = useState([]);

  // Load jobs
  useEffect(() => {
    api.get('/api/jobs').then(res => setJobs(res.data)).catch(console.error);
  }, []);

  // 🔹 NEW: Load scheduled interviews
  useEffect(() => {
    api.get('/api/interviews')
      .then(res => setScheduledInterviews(res.data))
      .catch(console.error);
  }, []);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setAiSummary('');
    try {
      const res = await api.post('/api/ai-search', null, { params: { query } });
      setResults(res.data);
    } catch {
      alert('Search failed');
    }
    setLoading(false);
  };

  const handleRagSearch = async () => {
    if (!query) return;
    setLoadingRag(true);
    try {
      const res = await api.post('/api/rag-search', null, { params: { query } });
      setAiSummary(res.data.summary);
    } catch {
      setAiSummary('Failed to generate summary.');
    }
    setLoadingRag(false);
  };

  const openBookingModal = (candidate) => {
    setSelectedCandidate(candidate);
    if (jobs.length > 0 && !selectedJobId) setSelectedJobId(jobs[0].id);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSlotDate(tomorrow.toISOString().split('T')[0]);
    setShowBookingModal(true);
  };

  const handleBookInterview = async (e) => {
    e.preventDefault();
    setBookingResult(null);

    const token = localStorage.getItem('token');

    try {
      const jobIdToUse = selectedJobId || jobs[0]?.id;

      await api.post(
        '/api/applications/direct',
        {
          candidate_id: selectedCandidate.id,
          candidate_name: selectedCandidate.name,
          job_id: jobIdToUse,
          job_title: jobs.find(j => j.id === jobIdToUse)?.title || 'Interview',
          status: 'Shortlisted'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const bookingResult = {
        success: true,
        link: 'https://meet.google.com/' + Math.random().toString(36).substring(7),
        time: `${slotDate} at ${slotTime}`
      };

      setBookingResult(bookingResult);
    } catch {
      alert('Booking failed');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>🔍 AI Candidate Search</h2>

      <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe ideal candidate..."
          style={{ flex: 1, padding: '10px' }}
        />
        <button onClick={handleSearch}>{loading ? '...' : 'Search'}</button>
        <button onClick={handleRagSearch}>AI Summary</button>
      </div>

      {aiSummary && (
        <div style={{ background: '#f3f4f6', padding: '15px' }}>
          <strong>AI Analysis:</strong>
          <p>{aiSummary}</p>
        </div>
      )}

      {results.map(candidate => (
        <div key={candidate.id} style={{ border: '1px solid #ddd', padding: '15px', marginTop: '15px' }}>
          <h3>{candidate.name}</h3>
          <p>Experience: {candidate.experience_years} yrs</p>
          <button onClick={() => openBookingModal(candidate)}>
            📅 Book Interview
          </button>
        </div>
      ))}

      {/* MODAL */}
      {showBookingModal && selectedCandidate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: '30px', width: '480px', borderRadius: '10px' }}>

            <h3>Schedule Interview</h3>
            <p>Candidate: <strong>{selectedCandidate.name}</strong></p>

            {/* 🔹 NEW: SHOW EXISTING INTERVIEWS */}
            <div style={{ background: '#f9fafb', padding: '10px', marginBottom: '15px' }}>
              <strong>Already Scheduled</strong>
              {scheduledInterviews.length === 0 && <p>No interviews yet</p>}
              {scheduledInterviews.map(i => (
                <div key={i.id} style={{ fontSize: '0.9em', marginTop: '5px' }}>
                  📌 {new Date(i.scheduled_at).toLocaleDateString()}{" "}
                  {new Date(i.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} —{" "}
                  {i.applications?.candidate_name}
                </div>
              ))}
            </div>

            {bookingResult ? (
              <div>
                <p>🎉 Interview Scheduled</p>
                <input readOnly value={bookingResult.link} style={{ width: '100%' }} />
              </div>
            ) : (
              <form onSubmit={handleBookInterview}>
                <input type="date" value={slotDate} onChange={e => setSlotDate(e.target.value)} required />
                <input type="time" value={slotTime} onChange={e => setSlotTime(e.target.value)} required />
                <button type="submit">Confirm</button>
              </form>
            )}

            <button onClick={() => setShowBookingModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateSearch;
