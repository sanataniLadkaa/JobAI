import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CandidateDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- STYLING CONSTANTS ---
  const containerStyle = {
    padding: '0',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Inter', sans-serif",
    background: '#f9fafb',
    minHeight: '100vh'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#111827',
    letterSpacing: '-0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const heroStyle = {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    margin: '30px 40px',
    padding: '40px',
    borderRadius: '16px',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '25px',
    padding: '0 40px 40px 40px'
  };

  const cardStyle = {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
  };

  // Hover effect handler
  const handleHover = (e, isHovering) => {
    e.currentTarget.style.transform = isHovering ? 'translateY(-5px)' : 'translateY(0)';
    e.currentTarget.style.boxShadow = isHovering ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none';
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={logoStyle}>
          {/* Simple Logo Icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
          </svg>
          NexHire
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontWeight: '500', color: '#374151' }}>{user.name}</span>
          <button 
            onClick={logout} 
            style={{ 
              padding: '8px 16px', 
              background: '#fee2e2', 
              color: '#991b1b', 
              border: '1px solid #fecaca', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontWeight: '600', 
              fontSize: '0.9em',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#fecaca'}
            onMouseLeave={(e) => e.target.style.background = '#fee2e2'}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div style={heroStyle}>
        <div style={{ maxWidth: '600px' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2rem', fontWeight: '700' }}>
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>
            Ready to take the next step in your career? Update your profile or browse new opportunities below.
          </p>
        </div>
        {/* Decorative Circle/Avatar */}
        <div style={{
            width: '80px', height: '80px', borderRadius: '50%', 
            background: 'rgba(255,255,255,0.2)', display: 'flex', 
            justifyContent: 'center', alignItems: 'center', fontSize: '2rem'
        }}>
          {user.name.charAt(0)}
        </div>
      </div>

      {/* Dashboard Grid */}
      <div style={gridStyle}>
        
        {/* Card 1: Find Jobs */}
        <div 
          style={cardStyle} 
          onClick={() => navigate('/candidate-jobs')}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          <div>
            <div style={{ 
                width: '50px', height: '50px', borderRadius: '10px', 
                background: '#ecfdf5', color: '#059669', 
                display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' 
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <h3 style={{ margin: '0 0 5px 0', color: '#111827', fontSize: '1.2rem' }}>Find Jobs</h3>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Browse and apply to open positions matching your skills.
            </p>
          </div>
          <div style={{ marginTop: '20px', color: '#059669', fontWeight: '600', fontSize: '0.9em', display: 'flex', alignItems: 'center', gap: '5px' }}>
            Explore &rarr;
          </div>
        </div>

        {/* Card 2: My Applications */}
        <div 
          style={cardStyle} 
          onClick={() => navigate('/my-applications')}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          <div>
            <div style={{ 
                width: '50px', height: '50px', borderRadius: '10px', 
                background: '#fff7ed', color: '#d97706', 
                display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' 
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3 style={{ margin: '0 0 5px 0', color: '#111827', fontSize: '1.2rem' }}>My Applications</h3>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Track the status of your applications and interviews.
            </p>
          </div>
          <div style={{ marginTop: '20px', color: '#d97706', fontWeight: '600', fontSize: '0.9em', display: 'flex', alignItems: 'center', gap: '5px' }}>
            Track &rarr;
          </div>
        </div>

        {/* Card 3: My Profile */}
        <div 
          style={cardStyle} 
          onClick={() => navigate('/edit-profile')}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          <div>
            <div style={{ 
                width: '50px', height: '50px', borderRadius: '10px', 
                background: '#eef2ff', color: '#4f46e5', 
                display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' 
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3 style={{ margin: '0 0 5px 0', color: '#111827', fontSize: '1.2rem' }}>My Profile</h3>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Update your skills, experience, and upload your resume.
            </p>
          </div>
          <div style={{ marginTop: '20px', color: '#4f46e5', fontWeight: '600', fontSize: '0.9em', display: 'flex', alignItems: 'center', gap: '5px' }}>
            Edit &rarr;
          </div>
        </div>

        {/* Card 4: Salary Estimator */}
        <div 
          style={cardStyle} 
          onClick={() => navigate('/salary-estimator')}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          <div>
            <div style={{ 
                width: '50px', height: '50px', borderRadius: '10px', 
                background: '#f5f3ff', color: '#8b5cf6', 
                display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' 
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <h3 style={{ margin: '0 0 5px 0', color: '#111827', fontSize: '1.2rem' }}>Salary Estimator</h3>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Check your market value based on role and skills.
            </p>
          </div>
          <div style={{ marginTop: '20px', color: '#8b5cf6', fontWeight: '600', fontSize: '0.9em', display: 'flex', alignItems: 'center', gap: '5px' }}>
            Calculate &rarr;
          </div>
        </div>

      </div>
    </div>
  );
};

export default CandidateDashboard;