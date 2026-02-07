import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('recruiter@test.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password.');
    }
  };

  // Styles to match Signup page
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#f9fafb'
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '450px',
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    background: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    marginTop: '10px',
    transition: 'background 0.2s'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#111827' }}>Log In</h2>
        
        {error && (
          <div style={{ 
            padding: '10px', 
            background: '#fee2e2', 
            color: '#991b1b', 
            borderRadius: '5px', 
            marginBottom: '20px', 
            fontSize: '0.9em', 
            textAlign: 'center' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} onChange={e => setEmail(e.target.value)} 
            style={inputStyle}
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={password} onChange={e => setPassword(e.target.value)} 
            style={inputStyle}
          />
          
          <button 
            type="submit" 
            style={buttonStyle} 
            disabled={loading}
            onMouseEnter={(e) => !loading && (e.target.style.background = '#4338ca')}
            onMouseLeave={(e) => (e.target.style.background = '#4F46E5')}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9em', color: '#6b7280' }}>
          Don't have an account? 
          <Link to="/signup" style={{ color: '#4F46E5', textDecoration: 'none', fontWeight: '600', marginLeft: '5px' }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;