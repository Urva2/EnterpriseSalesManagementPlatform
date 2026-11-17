import { useState, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ClipboardList, LogOut, ShoppingBag, Bell, Search, CreditCard } from 'lucide-react';
import api from '../../services/api';
import './AdminLayout.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollRef = useRef(null);

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
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/products', icon: <Package size={20} />, label: 'Products' },
    { path: '/admin/salespersons', icon: <Users size={20} />, label: 'Salespersons' },
    { path: '/admin/orders', icon: <ClipboardList size={20} />, label: 'Orders' },
    { path: '/admin/payments', icon: <CreditCard size={20} />, label: 'Payments' },
  ];

  // Helper to get page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('products')) return 'Products';
    if (path.includes('salespersons')) return 'Salespersons';
    if (path.includes('orders')) return 'Orders';
    if (path.includes('payments')) return 'Payments';
    return 'Dashboard';
  };

  return (
    <div className="admin-layout">
      {/* DESKTOP SIDEBAR */}
      <aside className="admin-sidebar hidden-mobile">
        <div className="sidebar-header">
          <div className="logo-icon">
            <ShoppingBag size={24} color="#ffffff" />
          </div>
          <h2 className="brand-title">SaleEntry</h2>
        </div>
        
        <div className="sidebar-section-label">ADMIN PANEL</div>
        
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

        <div className="sidebar-user-card">
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role-badge">ADMIN</span>
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {/* MOBILE TOP HEADER (Sticky) */}
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
              AD
            </button>
            {isProfileMenuOpen && (
              <div className="mobile-profile-dropdown">
                <div className="dropdown-user-info">
                  <span className="user-name">Admin User</span>
                  <span className="user-role-badge">ADMIN</span>
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
      <div className="admin-main">
        {/* DESKTOP TOP HEADER */}
        <header className="admin-header hidden-mobile">
          <div className="header-breadcrumbs">
            <span className="breadcrumb-root">Admin</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-active">{getPageTitle()}</span>
          </div>
        </header>

        {/* PAGE CONTENT ROUTE OUTLET */}
        <main className="admin-content-scroll" ref={scrollRef} onScroll={handleScroll}>
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
