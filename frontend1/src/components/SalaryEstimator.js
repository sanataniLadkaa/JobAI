import React, { useState } from 'react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

const SalaryEstimator = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    role: 'Software Engineer',
    experience: 2,
    skills: [],
    locationType: 'Remote'
  });
  const [result, setResult] = useState(null);
  const [myExpectation, setMyExpectation] = useState(user?.expected_salary || '');
  const [savedMsg, setSavedMsg] = useState('');

  // Roles List
  const roles = Object.keys({
    "Software Engineer": 600000,
    "Backend Engineer": 700000,
    "Frontend Engineer": 650000,
    "Full Stack Developer": 650000,
    "Data Scientist": 800000,
    "ML Engineer": 900000,
    "DevOps Engineer": 750000,
    "Product Manager": 900000,
    "UI/UX Designer": 550000
  });

  // Skills List
  const skillsList = ["React", "Node", "Python", "Django", "FastAPI", "Flask", "AWS", "GCP", "Azure", "ML", "AI", "LLM", "DevOps", "Kubernetes", "Docker", "Java", "Spring", "C++", "Go"];

  const handleCalculate = async (e) => {
    e.preventDefault();
    setResult(null);
    try {
      const res = await api.post('/api/estimate', {
        role: formData.role,
        experience: parseInt(formData.experience),
        skills: formData.skills,
        location_type: formData.locationType
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveExpectation = async () => {
    if (!myExpectation) return;
    try {
      await api.put('/api/candidate/expectation', { expected_salary: parseFloat(myExpectation) });
      setSavedMsg('Saved!');
      setTimeout(() => setSavedMsg(''), 2000);
    } catch (err) {
      alert("Failed to save expectation");
    }
  };

  const handleSkillToggle = (skill) => {
    if (formData.skills.includes(skill)) {
      setFormData({...formData, skills: formData.skills.filter(s => s !== skill)});
    } else {
      setFormData({...formData, skills: [...formData.skills, skill]});
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
      
      {/* LEFT: Calculator Form */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
        <h3 style={{ marginTop: 0 }}>💰 Salary Estimator</h3>
        
        <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Role</label>
            <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={{ width: '100%', padding: '10px' }}>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Experience (Years)</label>
            <input 
              type="number" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} 
              min="0" max="20"
              style={{ width: '100%', padding: '10px' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Skills (Multi-Select)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {skillsList.map(s => (
                <button 
                  key={s}
                  type="button"
                  onClick={() => handleSkillToggle(s)}
                  style={{
                    padding: '5px 10px', 
                    borderRadius: '15px', 
                    border: '1px solid #ddd',
                    background: formData.skills.includes(s) ? '#4F46E5' : '#fff',
                    color: formData.skills.includes(s) ? 'white' : '#333',
                    cursor: 'pointer'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Location</label>
            <select value={formData.locationType} onChange={(e) => setFormData({...formData, locationType: e.target.value})} style={{ width: '100%', padding: '10px' }}>
              <option>Remote</option>
              <option>Tier-1 (Mumbai/Bangalore)</option>
              <option>Tier-2 (Pune/Hyderabad)</option>
              <option>Tier-3 (Jaipur/Kanpur)</option>
            </select>
          </div>

          <button type="submit" style={{ padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Estimate Salary
          </button>
        </form>
      </div>

      {/* RIGHT: Results & Comparison */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Result Card */}
        {result && (
          <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0 }}>Estimated Range</h4>
              <span style={{ 
                padding: '5px 10px', borderRadius: '5px', fontSize: '0.8em', fontWeight: 'bold',
                background: result.confidence === 'High' ? '#d1fae5' : (result.confidence === 'Medium' ? '#fcd34d' : '#9ca3af'),
                color: 'white' 
              }}>
                {result.confidence} Confidence
              </span>
            </div>
            
            <h2 style={{ fontSize: '2em', color: '#15803d' }}>{result.suggested_range}</h2>
            
            <div style={{ marginTop: '15px' }}>
              <strong>Explanation:</strong>
              <ul style={{ paddingLeft: '20px', color: '#4b5563' }}>
                {result.reasoning.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </div>
        )}

        {/* My Expectation Input */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
          <h4 style={{ marginTop: 0, marginBottom: '10px' }}>My Expected Salary (LPA)</h4>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="number" 
              value={myExpectation} 
              onChange={(e) => setMyExpectation(e.target.value)}
              placeholder="e.g. 8"
              style={{ flex: 1, padding: '10px' }} 
            />
            <button onClick={handleSaveExpectation} style={{ padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              {savedMsg || 'Save'}
            </button>
          </div>

          {/* Comparison Logic */}
          {result && myExpectation && (
            <div style={{ marginTop: '15px', padding: '10px', borderRadius: '5px', background: '#f3f4f6', color: 'white' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Analysis:</div>
              {parseFloat(myExpectation) > result.estimated_mid * 1.15 ? (
                <p style={{ margin: 0, color: '#fca5a5' }}>⚠️ Expectation is above market range.</p>
              ) : parseFloat(myExpectation) < result.estimated_mid * 0.9 ? (
                <p style={{ margin: 0, color: '#fcd34d' }}>⚠️ Expectation is below market range.</p>
              ) : (
                <p style={{ margin: 0, color: '#10b981' }}>✅ Expectation aligns with market range.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryEstimator;