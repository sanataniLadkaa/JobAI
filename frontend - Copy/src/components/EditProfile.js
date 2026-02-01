import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

const EditProfile = () => {
  const { user, setUser } = useAuth(); // Use setUser to update global state
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    experience_years: 0
  });

  // Pre-fill form when component loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : '',
        experience_years: user.experience_years || 0
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Convert skills string to array
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s !== '');

    try {
      const res = await api.put('/auth/profile', {
        name: formData.name,
        skills: skillsArray,
        experience_years: parseInt(formData.experience_years)
      });

      // Update Global State
      setUser(res.data.user);
      alert("✅ Profile Updated Successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update profile");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Edit My Profile</h2>
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Name</label>
          <input 
            type="text" name="name" value={formData.name} onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Experience (Years)</label>
          <input 
            type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Skills (Comma Separated)</label>
          <textarea 
            name="skills" value={formData.skills} onChange={handleChange} 
            placeholder="React, Python, SQL..."
            rows="4"
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
          <small style={{ color: '#666' }}>Example: React, Node, AWS</small>
        </div>

        {/* Mock Resume Upload (Visual Only) */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Resume</label>
          <div style={{ padding: '10px', border: '2px dashed #ccc', borderRadius: '5px', textAlign: 'center', color: '#666' }}>
            Click to upload PDF/DOCX (Mocked)
          </div>
        </div>

        <button 
          type="submit" 
          style={{ padding: '12px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}
        >
          Save Changes
        </button>

      </form>
    </div>
  );
};

export default EditProfile;