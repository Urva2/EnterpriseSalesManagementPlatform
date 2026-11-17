import { useState, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingCart, ClipboardList, User, LogOut, ShoppingBag, Bell, Search, Menu, X, CreditCard } from 'lucide-react';
import api from '../../services/api';
import './SalespersonLayout.css';

export default function SalespersonLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollRef = useRef(null);

  const isNewOrderFlow = location.pathname.includes('/new-order');

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.warn("Logout request failed:", e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('jwt');
      localStorage.removeItem('userName');
      navigate('/login');
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollHeight - scrollTop - clientHeight < 20) {
      setIsAtBottom(true);
    } else {
      setIsAtBottom(false);
    }
  };

  const navLinks = [
    { path: '/salesperson/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/salesperson/customers', icon: <Users size={20} />, label: 'Customers' },
    { path: '/salesperson/new-order', icon: <ShoppingCart size={20} />, label: 'New Order' },
    { path: '/salesperson/orders', icon: <ClipboardList size={20} />, label: 'My Orders' },
    { path: '/salesperson/payments', icon: <CreditCard size={20} />, label: 'Payments' },
    { path: '/salesperson/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('customers')) return 'Customers';
    if (path.includes('new-order')) return 'New Order';
    if (path.includes('orders')) return 'My Orders';
    if (path.includes('payments')) return 'Payments';
    if (path.includes('profile')) return 'Profile';
    return 'Dashboard';
  };

  return (
    <div className="salesperson-layout">
      {/* DESKTOP SIDEBAR */}
      <aside className="salesperson-sidebar hidden-mobile">
        <div className="sidebar-header">
          <div className="logo-icon">
            <ShoppingBag size={24} color="#ffffff" />
          </div>
          <h2 className="brand-title">SaleEntry</h2>
        </div>
        
        <div className="sidebar-section-label">SALES PORTAL</div>
        
        <nav className="sidebar-nav">
          {navLinks.map((link) => (
            <NavLink 
              key={link.path}
              to={link.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="nav-icon-wrapper">
                {link.icon}
              </div>
              <span className="nav-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-spacer"></div>

        <div className="sidebar-user-card" onClick={() => navigate('/salesperson/profile')} style={{ cursor: 'pointer' }}>
          <div className="user-avatar sp">SP</div>
          <div className="user-info">
            <span className="user-name">{localStorage.getItem('userName') || 'Salesperson'}</span>
            <span className="user-role-badge sp">SALESPERSON</span>
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {/* MOBILE TOP HEADER */}
      <header className="mobile-header hidden-desktop">
        <div className="mobile-logo-group">
          <div className="mobile-logo-icon">
            <ShoppingBag size={18} color="white" />
          </div>
          <h2 className="mobile-brand-title">SaleEntry</h2>
        </div>
        <div className="mobile-actions">
          <div className="profile-menu-container">
            <button 
              className="mobile-avatar-btn"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              SP
            </button>
            {isProfileMenuOpen && (
              <div className="mobile-profile-dropdown">
                <div className="dropdown-user-info">
                  <span className="user-name">{localStorage.getItem('userName') || 'Salesperson'}</span>
                  <span className="user-role-badge sp">SALESPERSON</span>
                </div>
                <hr className="dropdown-divider" />
                <button className="dropdown-logout-btn" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="salesperson-main">
        {/* DESKTOP TOP HEADER */}
        <header className="salesperson-header hidden-mobile">
          <div className="header-breadcrumbs">
            <span className="breadcrumb-root">Salesperson</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-active">{getPageTitle()}</span>
          </div>
        </header>

        {/* PAGE CONTENT ROUTE OUTLET */}
        <main className="salesperson-content-scroll" ref={scrollRef} onScroll={handleScroll}>
          <div className="content-inner">
            <Outlet />
          </div>
        </main>

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <nav className={`mobile-bottom-nav hidden-desktop ${isAtBottom ? 'nav-hidden' : ''}`}>
          {navLinks.map((link) => (
            <NavLink 
              key={link.path}
              to={link.path} 
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="mobile-nav-icon">
                {link.icon}
              </div>
              <span className="mobile-nav-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
