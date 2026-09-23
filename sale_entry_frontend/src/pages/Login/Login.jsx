import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ShoppingBag, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import './Login.css';

export default function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (name.trim() === '' || password.trim() === '') {
      setError('Invalid credentials');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/login', { name, password });
      
      const data = response.data;
      
      // Store token and user info
      localStorage.setItem('token', data.jwt);
      localStorage.setItem('userName', data.userName);
      
      // Parse role from JWT to navigate appropriately
      try {
        // const payload = JSON.parse(atob(data.jwt.split('.')[1]));
        // const roles = payload["ROLE:"];
        // const roleString = JSON.stringify(roles || "");
        //
        // if (roleString.includes('ROLE_ADMIN') || roleString.includes('ADMIN')) {
        //   navigate('/admin/dashboard');
        // } else if (roleString.includes('ROLE_SALES_PERSON') || roleString.includes('SALES_PERSON')) {
        //   navigate('/salesperson/dashboard');
        // } else {
        //   // Fallback
        //   navigate('/salesperson/dashboard');
        // }
        const payload = JSON.parse(atob(data.jwt.split('.')[1]));

        console.log(payload);

        if (payload.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (payload.role === 'SALES_PERSON') {
          navigate('/salesperson/dashboard');
        } else {
          navigate('/login');
        }
      } catch (e) {
        console.error("Failed to parse JWT role:", e);
        navigate('/salesperson/dashboard'); // fallback
      }
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Error Toast */}
      {error && (
        <div className="toast-error">
          <AlertCircle size={20} />
          <div className="toast-text">
            <strong>Invalid credentials</strong>
            <p>Please check and try again</p>
          </div>
        </div>
      )}

      <div className="login-card">
        <div className="login-header">
          <div className="logo-icon">
            <ShoppingBag size={28} color="white" />
          </div>
          <h1>SaleEntry</h1>
          <p>Manage your sales, orders & inventory</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <div className={`input-wrapper ${error ? 'input-error' : ''}`}>
              <User size={18} className="input-icon" />
              <input 
                id="username"
                type="text" 
                placeholder="Enter your username" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className={`input-wrapper ${error ? 'input-error' : ''}`}>
              <Lock size={18} className="input-icon" />
              <input 
                id="password"
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
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
            {error && <span className="error-message"><AlertCircle size={14}/> Invalid username or password</span>}
          </div>

          <button type="submit" className="login-submit" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        <div className="login-footer">
          Don't have an account? <a href="/register">Register here</a>
        </div>
      </div>
    </div>
  );
}
