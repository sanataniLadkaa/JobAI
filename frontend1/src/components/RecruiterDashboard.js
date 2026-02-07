import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const RecruiterDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- STYLING CONSTANTS ---
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // Ensure footer is pushed down
    background: '#f9fafb',
    fontFamily: "'Inter', sans-serif"
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 60px', // Wider header padding
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
    background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', 
    margin: '40px 60px 60px 60px',
    padding: '50px', // Larger hero
    borderRadius: '16px',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 20px 25px -5px rgba(14, 165, 233, 0.4)'
  };

  const sectionContainerStyle = {
    padding: '0 60px', // Padding for the card sections
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', // Slightly wider cards
    gap: '60px', // <--- CARDS FAR AWAY
    marginBottom: '80px' // Space between grid and next section
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
    margin: '0 60px 80px 60px', // Large margins to separate from cards
    borderRadius: '16px',
    textAlign: 'center',
    border: '1px solid #e5e7eb'
  };

  const footerStyle = {
    marginTop: 'auto', // Pushes footer to bottom
    background: '#1f2937',
    color: '#9ca3af',
    padding: '40px 60px',
    fontSize: '0.9em'
  };

  const handleHover = (e, isHovering) => {
    e.currentTarget.style.transform = isHovering ? 'translateY(-8px)' : 'translateY(0)'; // Higher lift
    e.currentTarget.style.boxShadow = isHovering ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={logoStyle}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
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
            Welcome to the next generation of recruiting. Manage your pipeline, automate screening, and hire the best talent faster with NexHire AI.
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

      {/* SECTION 1: CORE ACTIONS */}
      <div style={sectionContainerStyle}>
        <h2 style={{ marginBottom: '30px', color: '#111827', fontSize: '1.8rem' }}>Core Actions</h2>
        <div style={gridStyle}>
          
          {/* Card 1: AI Search */}
          <div style={cardStyle} onClick={() => navigate('/search')} onMouseEnter={(e) => handleHover(e, true)} onMouseLeave={(e) => handleHover(e, false)}>
            <div>
              <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: '#eef2ff', color: '#4f46e5', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#111827', fontSize: '1.3rem' }}>AI Search</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '1rem', lineHeight: '1.6' }}>
                Find candidates using RAG search and semantic matching.
              </p>
            </div>
            <div style={{ marginTop: '25px', color: '#4f46e5', fontWeight: '700', fontSize: '0.9em' }}>Find Talent &rarr;</div>
          </div>

          {/* Card 2: Applications */}
          <div style={cardStyle} onClick={() => navigate('/view-applications')} onMouseEnter={(e) => handleHover(e, true)} onMouseLeave={(e) => handleHover(e, false)}>
            <div>
              <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: '#f0fdf4', color: '#059669', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#111827', fontSize: '1.3rem' }}>Applications</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '1rem', lineHeight: '1.6' }}>
                Review, shortlist, and reject candidates in bulk.
              </p>
            </div>
            <div style={{ marginTop: '25px', color: '#059669', fontWeight: '700', fontSize: '0.9em' }}>Review &rarr;</div>
          </div>

          {/* Card 3: Shortlisted */}
          <div style={cardStyle} onClick={() => navigate('/shortlisted')} onMouseEnter={(e) => handleHover(e, true)} onMouseLeave={(e) => handleHover(e, false)}>
            <div>
              <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: '#fff7ed', color: '#ea580c', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#111827', fontSize: '1.3rem' }}>Shortlisted</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '1rem', lineHeight: '1.6' }}>
                Schedule interviews and give feedback to top candidates.
              </p>
            </div>
            <div style={{ marginTop: '25px', color: '#ea580c', fontWeight: '700', fontSize: '0.9em' }}>Interviews &rarr;</div>
          </div>

        </div>
      </div>

      {/* SECTION 2: PRODUCT INFO (Middle Text) */}
      <div style={infoSectionStyle}>
        <h2 style={{ margin: '0 0 15px 0', color: '#111827', fontSize: '2rem' }}>Why Use NexHire?</h2>
        <p style={{ color: '#4b5563', fontSize: '1.1rem', lineHeight: '1.7', maxWidth: '800px', margin: '0 auto' }}>
          NexHire leverages advanced Retrieval-Augmented Generation (RAG) to parse resumes deeply, not just matching keywords. 
          Our AI-driven engine understands context, ranks candidates based on real-world relevance, and automates the tedious task of manual screening.
          Spend your time talking to the right people, not reading PDFs.
        </p>
        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <span style={{ padding: '10px 20px', background: '#f3f4f6', borderRadius: '20px', color: '#374151', fontWeight: '500' }}>✨ AI Powered</span>
          <span style={{ padding: '10px 20px', background: '#f3f4f6', borderRadius: '20px', color: '#374151', fontWeight: '500' }}>⚡ 10x Faster</span>
          <span style={{ padding: '10px 20px', background: '#f3f4f6', borderRadius: '20px', color: '#374151', fontWeight: '500' }}>🛡️ Secure</span>
        </div>
      </div>

      {/* SECTION 3: MANAGEMENT TOOLS */}
      <div style={sectionContainerStyle}>
        <h2 style={{ marginBottom: '30px', color: '#111827', fontSize: '1.8rem' }}>Management</h2>
        <div style={gridStyle}>

          {/* Card 4: Manage Jobs */}
          <div style={cardStyle} onClick={() => navigate('/manage-jobs')} onMouseEnter={(e) => handleHover(e, true)} onMouseLeave={(e) => handleHover(e, false)}>
            <div>
              <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: '#fce7f3', color: '#db2777', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#111827', fontSize: '1.3rem' }}>Manage Jobs</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '1rem', lineHeight: '1.6' }}>
                Create, edit, or delete job postings in seconds.
              </p>
            </div>
            <div style={{ marginTop: '25px', color: '#db2777', fontWeight: '700', fontSize: '0.9em' }}>Edit Jobs &rarr;</div>
          </div>

          {/* Card 5: Scheduled */}
          <div style={cardStyle} onClick={() => navigate('/scheduled-interviews')} onMouseEnter={(e) => handleHover(e, true)} onMouseLeave={(e) => handleHover(e, false)}>
            <div>
              <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#111827', fontSize: '1.3rem' }}>Interviews</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '1rem', lineHeight: '1.6' }}>
                View calendar slots, meeting links, and candidate status.
              </p>
            </div>
            <div style={{ marginTop: '25px', color: '#7c3aed', fontWeight: '700', fontSize: '0.9em' }}>Calendar &rarr;</div>
          </div>

          {/* Card 6: Voice Logs */}
          <div style={cardStyle} onClick={() => navigate('/call-logs')} onMouseEnter={(e) => handleHover(e, true)} onMouseLeave={(e) => handleHover(e, false)}>
            <div>
              <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: '#ecfeff', color: '#0891b2', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .57 2.81 12.03 12.03 0 0 0 2.22 2.81 12.05 12.05 0 0 0 2.81.57A2 2 0 0 1 18.42 18Z"></path></svg>
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#111827', fontSize: '1.3rem' }}>Call Logs</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '1rem', lineHeight: '1.6' }}>
                Track automated voice outreach history and logs.
              </p>
            </div>
            <div style={{ marginTop: '25px', color: '#0891b2', fontWeight: '700', fontSize: '0.9em' }}>History &rarr;</div>
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

export default RecruiterDashboard;