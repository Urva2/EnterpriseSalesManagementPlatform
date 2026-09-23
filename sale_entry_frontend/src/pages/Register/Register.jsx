import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Eye, EyeOff, ShoppingBag, AlertCircle } from 'lucide-react';
import './Register.css';

export default function Register() {
  const [role, setRole] = useState('Admin'); // 'Admin' or 'Sales Person'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic Validation
    if (!name || !email || !password || !confirmPassword || (role === 'Sales Person' && !phone)) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = role === 'Admin' 
        ? `http://${window.location.hostname}:8080/admin/register` 
        : `http://${window.location.hostname}:8080/salesperson/register`;
      
      const bodyPayload = role === 'Admin' 
        ? { name, email, password } 
        : { name, email, password, phoneno: phone };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || 'Registration failed');
      }

      // Navigate to login after successful registration
      navigate('/login');
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      {error && (
        <div className="toast-error">
          <AlertCircle size={20} />
          <div className="toast-text">
            <strong>Registration Failed</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="register-card">
        <div className="register-header">
          <div className="logo-icon-small">
            <ShoppingBag size={20} color="white" />
          </div>
          <h2>SaleEntry</h2>
        </div>
        
        <div className="register-title-section">
          <h1>Create Account</h1>
          <p>Join SaleEntry to start managing sales</p>
        </div>

        <div className="role-toggle">
          <button 
            type="button" 
            className={`toggle-btn ${role === 'Admin' ? 'active' : ''}`}
            onClick={() => setRole('Admin')}
          >
            Admin
          </button>
          <button 
            type="button" 
            className={`toggle-btn ${role === 'Sales Person' ? 'active' : ''}`}
            onClick={() => setRole('Sales Person')}
          >
            Sales Person
          </button>
        </div>

        <form onSubmit={handleRegister} className="register-form">
          <div className="input-group">
            <label htmlFor="fullname">Full Name</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input 
                id="fullname"
                type="text" 
                placeholder="Enter your full name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input 
                id="email"
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                id="password"
                type={showPassword ? "text" : "password"} 
                placeholder="Create a password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                id="confirmPassword"
                type={showPassword ? "text" : "password"} 
                placeholder="Confirm your password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {role === 'Sales Person' && (
            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="input-wrapper">
                <Phone size={18} className="input-icon" />
                <input 
                  id="phone"
                  type="tel" 
                  placeholder="10-digit phone number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          )}

          <button type="submit" className="register-submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="register-footer">
          Already have an account? <a href="/login">Sign In</a>
        </div>
      </div>
    </div>
  );
}
