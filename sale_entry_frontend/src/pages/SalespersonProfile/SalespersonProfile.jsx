import React, { useState, useEffect } from 'react';
import { Lock, Save, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import './SalespersonProfile.css';

export default function SalespersonProfile() {
  const [initialData, setInitialData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState({ text: '', type: '' });

  // Password change states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/salesperson/me');
      const data = {
        fullName: res.data.name || '',
        email: res.data.email || '',
        phone: res.data.phoneno || ''
      };
      setInitialData(data);
      setFormData(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = 
    formData.fullName !== initialData.fullName ||
    formData.phone !== initialData.phone;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!hasChanges) return;
    setSaveMessage({ text: '', type: '' });
    try {
      const res = await api.patch('/salesperson/me', {
        name: formData.fullName,
        phone: formData.phone
      });
      const updated = {
        fullName: res.data.name || formData.fullName,
        email: res.data.email || formData.email,
        phone: res.data.phoneno || formData.phone
      };
      setInitialData(updated);
      setFormData(updated);
      localStorage.setItem('userName', updated.fullName);
      setSaveMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      console.error('Failed to update profile:', err);
      setSaveMessage({ text: err.response?.data || 'Failed to update profile', type: 'error' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ text: '', type: '' });

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ text: 'All password fields are required', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }

    try {
      setIsChangingPassword(true);
      await api.put('/auth/change-password', {
        oldPassword,
        newPassword
      });
      setPasswordMessage({ text: 'Password changed successfully!', type: 'success' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setShowPasswordChange(false), 2000);
    } catch (err) {
      console.error('Failed to change password:', err);
      setPasswordMessage({ text: err.response?.data || 'Failed to change password', type: 'error' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'SP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading profile...</div>;
  }

  return (
    <div className="sp-profile-container">
      <div className="sp-profile-header">
        <h2>My Profile</h2>
      </div>

      <div className="sp-profile-content">
        {/* Profile Card */}
        <div className="sp-profile-card">
          <div className="sp-profile-avatar">
            {getInitials(formData.fullName)}
          </div>
          <h3 className="sp-profile-name">{formData.fullName || 'Salesperson'}</h3>
          <span className="sp-role-badge">SALESPERSON</span>
        </div>

        {/* Edit Form */}
        <div className="sp-profile-form-card">
          {saveMessage.text && (
            <div style={{
              padding: '0.75rem',
              borderRadius: '6px',
              marginBottom: '1rem',
              backgroundColor: saveMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: saveMessage.type === 'success' ? '#10b981' : '#ef4444'
            }}>
              {saveMessage.text}
            </div>
          )}

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
          
          <div 
            className="security-card" 
            style={{ cursor: 'pointer' }}
            onClick={() => setShowPasswordChange(!showPasswordChange)}
          >
            <div className="security-card-left">
              <div className="icon-wrapper">
                <Lock size={18} />
              </div>
              <span className="security-card-title">Change Password</span>
            </div>
            <span style={{ color: '#3b82f6', fontSize: '0.875rem' }}>
              {showPasswordChange ? 'Hide' : 'Update'}
            </span>
          </div>

          {showPasswordChange && (
            <form onSubmit={handleChangePassword} style={{
              marginTop: '1rem',
              padding: '1.25rem',
              background: 'rgba(30, 41, 59, 0.6)',
              borderRadius: '8px',
              border: '1px solid rgba(148, 163, 184, 0.15)'
            }}>
              {passwordMessage.text && (
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '6px',
                  marginBottom: '1rem',
                  backgroundColor: passwordMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: passwordMessage.type === 'success' ? '#10b981' : '#ef4444'
                }}>
                  {passwordMessage.text}
                </div>
              )}

              <div className="form-group">
                <label>Current Password</label>
                <input 
                  type="password" 
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-save-changes active"
                disabled={isChangingPassword}
                style={{ marginTop: '0.5rem' }}
              >
                <KeyRound size={16} /> {isChangingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
