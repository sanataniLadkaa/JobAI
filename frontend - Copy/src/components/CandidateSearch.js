import React, { useState } from 'react';
import api from '../api';

const CandidateSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 1. AI Search Function
  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setMessage('');
    try {
      // Call backend with query as parameter
      const res = await api.post('/api/ai-search', null, { params: { query } });
      setResults(res.data);
    } catch (error) {
      console.error("Search failed", error);
      alert("Error searching candidates");
    }
    setLoading(false);
  };

  // 2. Voice Call Function
  const initiateCall = async (candidateId, candidateName) => {
    if (!window.confirm(`Initiate AI Voice Call to ${candidateName}?`)) return;
    
    try {
      const res = await api.post('/api/schedule-call', { candidate_id: candidateId });
      alert(`✅ ${res.data.message}`);
    } catch (error) {
      alert("❌ Failed to schedule call");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🔍 AI Candidate Search (RAG)</h2>
      <p style={{ color: '#666' }}>Try: "React + Node + 3 years exp"</p>
      
      <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <input 
          value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe ideal candidate..."
          style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleSearch} 
          disabled={loading} 
          style={{ padding: '10px 20px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {loading ? 'Analyzing...' : 'Search'}
        </button>
      </div>

      {/* Results List */}
      {results.map((candidate) => (
        <div key={candidate.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0 }}>{candidate.name}</h3>
            <p style={{ margin: '5px 0', color: '#555', fontSize: '0.9em' }}>Exp: {candidate.experience_years} years</p>
            
            {/* Match Score Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
              <strong style={{ color: '#4F46E5' }}>{candidate.match_score}% Match</strong>
              <div style={{ width: '100px', height: '8px', background: '#eee', borderRadius: '4px' }}>
                <div style={{ width: `${candidate.match_score}%`, height: '100%', background: '#10b981', borderRadius: '4px' }}></div>
              </div>
            </div>

            <div style={{ marginTop: '8px' }}>
              {candidate.skills.map(skill => (
                <span key={skill} style={{ background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8em', marginRight: '5px' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => initiateCall(candidate.id, candidate.name)} 
            style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            📞 AI Call
          </button>
        </div>
      ))}
    </div>
  );
};

export default CandidateSearch;