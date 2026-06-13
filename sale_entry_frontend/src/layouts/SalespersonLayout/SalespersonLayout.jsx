import { useState, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingCart, ClipboardList, User, LogOut, ShoppingBag, Bell, Search, Menu, X } from 'lucide-react';
import './SalespersonLayout.css';

export default function SalespersonLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollRef = useRef(null);

  const isNewOrderFlow = location.pathname.includes('/new-order');

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // Consider it at bottom if within 20px of the absolute bottom
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
    { path: '/salesperson/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  // Helper to get page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('customers')) return 'Customers';
    if (path.includes('new-order')) return 'New Order';
    if (path.includes('my-orders')) return 'My Orders';
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
        
        <div className="sidebar-section-label">SALES PANEL</div>
        
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
          <div className="user-avatar">NK</div>
          <div className="user-info">
            <span className="user-name">Nidhi Kumar</span>
            <span className="user-role-badge">SALESPERSON</span>
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
          {isNewOrderFlow ? (
            <button className="mobile-back-btn" onClick={() => setShowCancelPrompt(true)}>
              <X size={24} color="#ef4444" />
            </button>
          ) : (
            <div className="mobile-logo-icon">
              <ShoppingBag size={18} color="white" />
            </div>
          )}
          <h2 className="mobile-brand-title">{isNewOrderFlow ? 'New Order' : 'SaleEntry'}</h2>
        </div>
        
        <div className="profile-menu-container">
          <div 
            className="user-avatar-small dark-avatar" 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            NK
          </div>
          {isProfileMenuOpen && (
            <div className="profile-dropdown">
              <button className="dropdown-logout-btn" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="salesperson-main">
        {/* DESKTOP TOP HEADER BAR */}
        <header className="desktop-header hidden-mobile">
          <div className="header-breadcrumbs">
            <h1>{getPageTitle()}</h1>
            <p>Home / <span className="current-path">{getPageTitle()}</span></p>
          </div>
          <div className="header-actions">
            <div className="search-bar">
              <Search size={18} color="#94a3b8" />
              <input type="text" placeholder="Search..." />
            </div>
            <button className="icon-button">
              <Bell size={20} />
            </button>
            <div className="user-avatar-small" style={{marginLeft: '0.5rem'}}>NK</div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="content-scroll-area" ref={scrollRef} onScroll={handleScroll}>
          <div className="content-container">
            <Outlet />
          </div>
        </main>
      </main>

      {/* MOBILE BOTTOM NAV */}
      {!isNewOrderFlow && (
        <nav className={`mobile-bottom-nav hidden-desktop ${isAtBottom ? 'nav-hidden' : ''}`}>
          {navLinks.map((link) => (
            <NavLink 
              key={link.path}
              to={link.path} 
              className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      )}

      {/* CUSTOM CANCEL MODAL */}
      {showCancelPrompt && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-card">
            <div className="modal-icon-danger">
              <X size={24} />
            </div>
            <h3>Cancel Order?</h3>
            <p>Are you sure you want to cancel this order? All your cart progress will be lost.</p>
            <div className="custom-modal-actions">
              <button className="custom-modal-btn-cancel" onClick={() => setShowCancelPrompt(false)}>No, Keep Editing</button>
              <button className="custom-modal-btn-danger" onClick={() => {
                setShowCancelPrompt(false);
                navigate('/salesperson/dashboard');
              }}>Yes, Cancel Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
