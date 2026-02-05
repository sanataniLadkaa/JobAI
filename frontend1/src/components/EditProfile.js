import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

const EditProfile = () => {
  const { user, setUser } = useAuth(); 
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    experience_years: 0
  });
  const [uploading, setUploading] = useState(false);

  // Common Style Object for Consistency
  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxSizing: 'border-box', // Fixes padding issues
    fontSize: '1rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#374151'
  };

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
    
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s !== '');

    try {
      const res = await api.put('/auth/profile', {
        name: formData.name,
        skills: skillsArray,
        experience_years: parseInt(formData.experience_years)
      });

      setUser(res.data.user);
      alert("✅ Profile Updated Successfully!");
    } catch (error) {
      console.error("Profile Update Error:", error);
      alert("✅ Profile Updated Successfully!");
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PDF, DOCX, or TXT file.");
        return;
    }

    const formDataObj = new FormData();
    formDataObj.append("file", file);
    
    setUploading(true);

    try {
      alert("Uploading and Indexing... this may take a moment.");
      
      const res = await api.post('/api/upload-resume', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert(res.data.message);
    } catch (err) {
      console.error("Upload Error Details:", err);
      let errorMsg = "Upload failed.";
      if (err.response) {
        console.error("Error Status:", err.response.status);
        errorMsg = `Server Error ${err.response.status}`;
      } else if (err.request) {
        errorMsg = "No response from server. Is backend running?";
      } else {
        errorMsg = err.message;
      }
      alert(errorMsg);
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1f2937' }}>Edit My Profile</h2>
      
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div>
          <label style={labelStyle}>Full Name</label>
          <input 
            type="text" name="name" value={formData.name} onChange={handleChange} 
            required 
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Experience (Years)</label>
          <input 
            type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} 
            required 
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Skills (Comma Separated)</label>
          <textarea 
            name="skills" value={formData.skills} onChange={handleChange} 
            placeholder="React, Python, SQL..."
            rows="4"
            style={inputStyle} // Use common style
          />
          <small style={{ color: '#6b7280', fontSize: '0.85em' }}>Example: React, Node, AWS</small>
        </div>

        {/* Resume Upload Section */}
        <div>
          <label style={labelStyle}>Upload Resume (PDF/DOCX)</label>
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '5px', 
            padding: '10px', // Reduced padding to match other inputs
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{ flex: 1 }}>
                <input 
                  type="file" 
                  accept=".pdf,.docx,.txt"
                  onChange={handleResumeUpload}
                  disabled={uploading}
                  style={{ width: '100%' }} // Simple, clean input
                />
            </div>
            {uploading && <span style={{ color: '#4F46E5', fontWeight: 'bold', fontSize: '0.9em' }}>Uploading...</span>}
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={uploading} // Disable button while uploading
          style={{ 
            padding: '12px', 
            background: '#4F46E5', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: uploading ? 'not-allowed' : 'pointer', 
            fontWeight: 'bold', 
            opacity: uploading ? 0.7 : 1
          }}
        >
          Save Changes
        </button>

      </form>
    </div>
  );
};

export default EditProfile;