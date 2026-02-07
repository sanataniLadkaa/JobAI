import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CandidateDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- STYLING CONSTANTS ---
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', 
    background: '#f9fafb',
    fontFamily: "'Inter', sans-serif"
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 60px', 
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
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
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Green Gradient for Candidate/Growth
    margin: '40px 60px 60px 60px',
    padding: '50px', 
    borderRadius: '16px',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.4)'
  };

  const sectionContainerStyle = {
    padding: '0 60px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
    gap: '60px', // <--- CARDS FAR AWAY
    marginBottom: '80px' 
  };

  const cardStyle = {
    background: 'white',
    padding: '35px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  };

  const infoSectionStyle = {
    background: 'white',
    padding: '60px',
    margin: '0 60px 80px 60px', 
    borderRadius: '16px',
    textAlign: 'center',
    border: '1px solid #e5e7eb'
  };

  const footerStyle = {
    marginTop: 'auto', 
    background: '#1f2937',
    color: '#9ca3af',
    padding: '40px 60px',
    fontSize: '0.9em'
  };

  const handleHover = (e, isHovering) => {
    e.currentTarget.style.transform = isHovering ? 'translateY(-8px)' : 'translateY(0)'; 
    e.currentTarget.style.boxShadow = isHovering ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={logoStyle}>
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
          <h1 style={{ margin: '0 0 15px 0', fontSize: '2.5rem', fontWeight: '800' }}>
            Welcome, {user.name.split(' ')[0]}! 👋
          </h1>
          <p style={{ margin: 0, fontSize: '1.2rem', opacity: 0.95, lineHeight: '1.6' }}>
            Your next career opportunity is just a click away. Build your profile, get matched by AI, and land your dream job with NexHire.
          </p>
        </div>
        <div style={{
            width: '90px', height: '90px', borderRadius: '50%', 
            background: 'rgba(255,255,255,0.2)', display: 'flex', 
            justifyContent: 'center', alignItems: 'center', fontSize: '2.5rem',
            border: '4px solid rgba(255,255,255,0.3)'
        }}>
          {user.name.charAt(0)}
        </div>
      </div>

      {/* SECTION 1: JOB SEARCH & APPLICATIONS */}
      <div style={sectionContainerStyle}>
        <h2 style={{ marginBottom: '30px', color: '#111827', fontSize: '1.8rem' }}>Job Hunt</h2>
        <div style={gridStyle}>
          
          {/* Card 1: Find Jobs */}
          <div style={cardStyle} onClick={() => navigate('/candidate-jobs')} onMouseEnter={(e) => handleHover(e, true)} onMouseLeave={(e) => handleHover(e, false)}>
            <div>
              <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#111827', fontSize: '1.3rem' }}>Find Jobs</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '1rem', lineHeight: '1.6' }}>
                Browse open positions that match your skills and experience.
              </p>
            </div>
            <div style={{ marginTop: '25px', color: '#059669', fontWeight: '700', fontSize: '0.9em' }}>Start Search &rarr;</div>
          </div>

          {/* Card 2: My Applications */}
          <div style={cardStyle} onClick={() => navigate('/my-applications')} onMouseEnter={(e) => handleHover(e, true)} onMouseLeave={(e) => handleHover(e, false)}>
            <div>
              <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: '#fff7ed', color: '#d97706', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#111827', fontSize: '1.3rem' }}>My Applications</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '1rem', lineHeight: '1.6' }}>
                Track your application status and interview schedules in real-time.
              </p>
            </div>
            <div style={{ marginTop: '25px', color: '#d97706', fontWeight: '700', fontSize: '0.9em' }}>Track Status &rarr;</div>
          </div>

        </div>
      </div>

      {/* SECTION 2: PRODUCT INFO (Middle Text) */}
      <div style={infoSectionStyle}>
        <h2 style={{ margin: '0 0 15px 0', color: '#111827', fontSize: '2rem' }}>Why NexHire?</h2>
        <p style={{ color: '#4b5563', fontSize: '1.1rem', lineHeight: '1.7', maxWidth: '800px', margin: '0 auto' }}>
          Stop sending your resume into the void. NexHire uses advanced AI matching to connect you with roles where you will truly thrive.
          Our system highlights your potential to recruiters, not just your keywords, ensuring you get the opportunities you deserve.
        </p>
        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <span style={{ padding: '10px 20px', background: '#f3f4f6', borderRadius: '20px', color: '#374151', fontWeight: '500' }}>🚀 Career Growth</span>
          <span style={{ padding: '10px 20px', background: '#f3f4f6', borderRadius: '20px', color: '#374151', fontWeight: '500' }}>🤖 AI Matched</span>
          <span style={{ padding: '10px 20px', background: '#f3f4f6', borderRadius: '20px', color: '#374151', fontWeight: '500' }}>🔒 Private & Secure</span>
        </div>
      </div>

      {/* SECTION 3: PROFILE & TOOLS */}
      <div style={sectionContainerStyle}>
        <h2 style={{ marginBottom: '30px', color: '#111827', fontSize: '1.8rem' }}>Your Profile</h2>
        <div style={gridStyle}>

          {/* Card 3: My Profile */}
          <div style={cardStyle} onClick={() => navigate('/edit-profile')} onMouseEnter={(e) => handleHover(e, true)} onMouseLeave={(e) => handleHover(e, false)}>
            <div>
              <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: '#eef2ff', color: '#4f46e5', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#111827', fontSize: '1.3rem' }}>My Profile</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '1rem', lineHeight: '1.6' }}>
                Update your skills, experience, and upload your resume for AI matching.
              </p>
            </div>
            <div style={{ marginTop: '25px', color: '#4f46e5', fontWeight: '700', fontSize: '0.9em' }}>Edit Profile &rarr;</div>
          </div>

          {/* Card 4: Salary Estimator */}
          <div style={cardStyle} onClick={() => navigate('/salary-estimator')} onMouseEnter={(e) => handleHover(e, true)} onMouseLeave={(e) => handleHover(e, false)}>
            <div>
              <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: '#f5f3ff', color: '#8b5cf6', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#111827', fontSize: '1.3rem' }}>Salary Estimator</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '1rem', lineHeight: '1.6' }}>
                Check your market value based on your role, skills, and location.
              </p>
            </div>
            <div style={{ marginTop: '25px', color: '#8b5cf6', fontWeight: '700', fontSize: '0.9em' }}>Check Value &rarr;</div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <div>
            <strong style={{ color: 'white', fontSize: '1.2em', display: 'block', marginBottom: '5px' }}>NexHire</strong>
            <p style={{ margin: 0, fontSize: '0.85em' }}>Empowering Recruitment with AI.</p>
          </div>
          <div style={{ display: 'flex', gap: '30px' }}>
            <a href="#" style={{ color: '#d1d5db', textDecoration: 'none', hoverColor: 'white' }}>About Us</a>
            <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>Contact Support</a>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #374151', fontSize: '0.8em' }}>
          &copy; 2023 NexHire Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default CandidateDashboard;