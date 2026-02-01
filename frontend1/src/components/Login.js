import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('recruiter@test.com');
  const [password, setPassword] = useState('password');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/dashboard');
    else alert('Login Failed: Check credentials');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <form onSubmit={handleSubmit} style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2 style={{ textAlign: 'center' }}>NexHire Login</h2>
        <input 
          placeholder="Email" 
          value={email} onChange={e => setEmail(e.target.value)} 
          style={{ padding: '10px' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} onChange={e => setPassword(e.target.value)} 
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#4F46E5', color: 'white', border: 'none', cursor: 'pointer' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;