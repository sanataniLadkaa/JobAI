import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api'
const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate' // Default to candidate
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Call Signup Endpoint
      const res = await api.post('/auth/signup', formData);
      
      // Store Token
      localStorage.setItem('token', res.data.access_token);
      
      // Update Global Context (Auto-login)
      login(formData.email, formData.password); // Re-using login function to set state or set manually

      // Navigate based on role
      if (res.data.user.role === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else {
        navigate('/candidate-dashboard');
      }

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Signup failed. Please try again.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ width: '100%', maxWidth: '450px', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
        
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#111827' }}>Create Account</h2>
        
        {error && (
          <div style={{ padding: '10px', background: '#fee2e2', color: '#991b1b', borderRadius: '5px', marginBottom: '20px', fontSize: '0.9em', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '0.9em' }}>Full Name</label>
            <input 
              type="text" name="name" value={formData.name} onChange={handleChange} 
              placeholder="John Doe"
              required 
              style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '1rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '0.9em' }}>Email Address</label>
            <input 
              type="email" name="email" value={formData.email} onChange={handleChange} 
              placeholder="you@example.com"
              required 
              style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '1rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '0.9em' }}>Password</label>
            <input 
              type="password" name="password" value={formData.password} onChange={handleChange} 
              placeholder="••••••••"
              required 
              style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '1rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '0.9em' }}>I am a...</label>
            <div style={{ display: 'flex', gap: '20px', marginTop: '5px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input 
                  type="radio" name="role" value="candidate" 
                  checked={formData.role === 'candidate'} onChange={handleChange} 
                  style={{ marginRight: '8px' }} 
                />
                Candidate
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input 
                  type="radio" name="role" value="recruiter" 
                  checked={formData.role === 'recruiter'} onChange={handleChange} 
                  style={{ marginRight: '8px' }} 
                />
                Recruiter
              </label>
            </div>
          </div>

          <button type="submit" style={{ padding: '14px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px' }}>
            Sign Up
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9em', color: '#6b7280' }}>
          Already have an account? <Link to="/login" style={{ color: '#4F46E5', textDecoration: 'none', fontWeight: '600' }}>Log in</Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;