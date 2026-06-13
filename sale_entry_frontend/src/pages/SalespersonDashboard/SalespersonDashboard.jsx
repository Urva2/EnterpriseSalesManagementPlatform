import React, { useState, useEffect } from 'react';
import { ClipboardList, IndianRupee, Clock, ShoppingCart, Users, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './SalespersonDashboard.css';

export default function SalespersonDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: 'Salesperson' });
  const [revenue, setRevenue] = useState(0);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const profileRes = await api.get('/salesperson/me');
      setProfile(profileRes.data);

      const revenueRes = await api.get('/orders/totalrev');
      setRevenue(revenueRes.data);

      const ordersRes = await api.get('/orders/my-orders');
      setMyOrders(ordersRes.data || []);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingOrdersCount = myOrders.filter(o => o.status === 'PENDING').length;
  const recentOrders = myOrders.slice(-3).reverse(); // Last 3 orders

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading dashboard...</div>;
  }

  return (
    <div className="sp-dashboard-container">
      {/* 1. Welcome Banner */}
      <div className="sp-welcome-banner">
        <div className="welcome-content">
          <h2>Welcome back, {profile.name.split(' ')[0]} 👋</h2>
          <p>Today, {currentDateFormatted}</p>
        </div>
        <div className="welcome-decoration hidden-mobile"></div>
      </div>

      {/* 2. Stats Cards Row */}
      <div className="sp-stats-grid">
        {/* Card 1 */}
        <div className="sp-stat-card">
          <div className="stat-icon blue">
            <ClipboardList size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">My Orders</span>
            <span className="stat-value">{myOrders.length}</span>
            <span className="stat-trend neutral">All time</span>
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="sp-stat-card">
          <div className="stat-icon emerald">
            <IndianRupee size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">My Revenue</span>
            <span className="stat-value">₹{revenue.toLocaleString()}</span>
            <span className="stat-trend neutral">All time</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="sp-stat-card">
          <div className="stat-icon amber">
            <Clock size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Pending Orders</span>
            <span className="stat-value">{pendingOrdersCount}</span>
            <span className="stat-trend neutral">Needs attention</span>
          </div>
        </div>
      </div>

      {/* 3. Quick Actions */}
      <div className="sp-quick-actions">
        <button className="action-btn-primary" onClick={() => navigate('/salesperson/new-order')}>
          <ShoppingCart size={18} />
          <span>Create New Order</span>
        </button>
        <button className="action-btn-secondary" onClick={() => navigate('/salesperson/customers')}>
          <Users size={18} />
          <span>View Customers</span>
        </button>
        <button className="action-btn-secondary" onClick={() => navigate('/salesperson/dashboard')}>
          <User size={18} />
          <span>My Profile</span>
        </button>
      </div>

      {/* 4. Recent Orders Section */}
      <div className="sp-recent-orders-section">
        <div className="section-header">
          <h3>Recent Orders</h3>
          <button className="view-all-link" onClick={() => navigate('/salesperson/orders')}>
            View All <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="recent-orders-list">
          {recentOrders.length === 0 ? (
            <p style={{ color: '#64748b' }}>No recent orders.</p>
          ) : (
            recentOrders.map(order => {
              const statusColorMap = {
                'PENDING': 'amber',
                'CONFIRMED': 'blue',
                'PROCESSING': 'purple',
                'DELIVERED': 'green',
                'CANCELLED': 'red'
              };
              const color = statusColorMap[order.status] || 'gray';
              
              return (
                <div className="recent-order-item" key={order.id}>
                  <div className="order-item-left">
                    <span className="order-customer">{order.customerName || 'Unknown Customer'}</span>
                    <span className="order-items-badge">{order.orderItemList?.length || 0} items</span>
                  </div>
                  <div className="order-item-right">
                    <span className={`badge badge-${color}`}>{order.status}</span>
                    <span className="order-price">₹{order.total}</span>
                    <span className="order-date">{order.date}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
