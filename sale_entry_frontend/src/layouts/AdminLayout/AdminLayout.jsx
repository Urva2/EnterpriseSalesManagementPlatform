import { useState, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ClipboardList, LogOut, ShoppingBag, Bell, Search } from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userName');
    navigate('/login');
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
  ];

  // Helper to get page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('products')) return 'Products';
    if (path.includes('salespersons')) return 'Salespersons';
    if (path.includes('orders')) return 'Orders';
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
            <div 
              className="user-avatar-small" 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              AD
            </div>
            {isProfileMenuOpen && (
              <div className="profile-dropdown">
                <button className="dropdown-logout-btn" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="admin-main">
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
            <div className="user-avatar-small" style={{marginLeft: '0.5rem'}}>AD</div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="content-scroll-area" ref={scrollRef} onScroll={handleScroll}>
          <div className="content-container">
            <Outlet />
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
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
    </div>
  );
}
