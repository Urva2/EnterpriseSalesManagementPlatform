import React, { useState } from 'react';
import { Lock, Save } from 'lucide-react';
import './SalespersonProfile.css';

export default function SalespersonProfile() {
  const [initialData] = useState({
    fullName: 'Nidhi Kumar',
    email: 'nidhi@email.com',
    phone: '9876543210'
  });

  const [formData, setFormData] = useState({ ...initialData });

  const hasChanges = 
    formData.fullName !== initialData.fullName ||
    formData.phone !== initialData.phone;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!hasChanges) return;
    alert("Profile updated successfully!");
    // In a real app, you would make an API call here and then update the initialData state
  };

  return (
    <div className="sp-profile-container">
      <div className="sp-profile-header">
        <h2>My Profile</h2>
      </div>

      <div className="sp-profile-content">
        {/* Profile Card */}
        <div className="sp-profile-card">
          <div className="sp-profile-avatar">
            NK
          </div>
          <h3 className="sp-profile-name">Nidhi Kumar</h3>
          <span className="sp-role-badge">SALESPERSON</span>
        </div>

        {/* Edit Form */}
        <div className="sp-profile-form-card">
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon disabled">
              <input 
                type="email" 
                name="email"
                value={formData.email}
                disabled
              />
              <Lock size={16} className="lock-icon" title="Email cannot be changed" />
            </div>
            <span className="input-hint">Email cannot be changed</span>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          <button 
            className={`btn-save-changes ${hasChanges ? 'active' : 'disabled'}`}
            disabled={!hasChanges}
            onClick={handleSave}
          >
            <Save size={18} /> Save Changes
          </button>
        </div>

        {/* Security Section */}
        <div className="sp-security-section">
          <div className="security-divider">
            <span>SECURITY</span>
          </div>
          
          <div className="security-card muted">
            <div className="security-card-left">
              <div className="icon-wrapper">
                <Lock size={18} />
              </div>
              <span className="security-card-title">Change Password</span>
            </div>
            <span className="coming-soon-badge">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
