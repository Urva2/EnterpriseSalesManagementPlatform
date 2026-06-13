import React, { useState, useEffect } from 'react';
import { Package, ClipboardList, Users, IndianRupee, Plus, LineChart, TrendingUp } from 'lucide-react';
import api from '../../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSalespersons: 0,
    totalRevenue: 0
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      {/* 1. Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <h2>Welcome back, Admin 👋</h2>
          <p>{currentDate}</p>
        </div>
        <div className="welcome-decoration"></div>
      </div>

      {/* 2. Stats Cards Row */}
      <div className="stats-grid">
        {/* Card 1 */}
        <div className="stat-card">
          <div className="stat-icon blue">
            <Package size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Products</span>
            <span className="stat-value">{stats.totalProducts}</span>
            <span className="stat-trend neutral">Live</span>
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="stat-card">
          <div className="stat-icon purple">
            <ClipboardList size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{stats.totalOrders}</span>
            <span className="stat-trend neutral">All time</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="stat-card">
          <div className="stat-icon emerald">
            <Users size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Salespersons</span>
            <span className="stat-value">{stats.totalSalespersons}</span>
            <span className="stat-trend neutral">Active team</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="stat-card">
          <div className="stat-icon amber">
            <IndianRupee size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">₹{stats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            <span className="stat-trend neutral">All time</span>
          </div>
        </div>
      </div>

      {/* 3. Quick Actions */}
      <div className="quick-actions-section">
        <h3 className="section-title">Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-card">
            <Plus size={18} className="action-icon" />
            <span className="action-title">Add Product</span>
          </button>
          <button className="action-card">
            <ClipboardList size={18} className="action-icon" />
            <span className="action-title">View Orders</span>
          </button>
          <button className="action-card">
            <Users size={18} className="action-icon" />
            <span className="action-title">View Salespersons</span>
          </button>
        </div>
      </div>

      {/* 4. Chart Placeholder */}
      <div className="chart-section">
        <div className="chart-header">
          <TrendingUp size={24} className="chart-title-icon" />
          <div className="chart-title-text">
            <h3>Sales Analytics — Coming Soon</h3>
            <p>Advanced charts and performance insights will appear here.</p>
          </div>
        </div>
        <div className="chart-placeholder-box">
          <LineChart size={48} color="#cbd5e1" strokeWidth={1.5} />
          <span>Chart placeholder</span>
        </div>
      </div>
    </div>
  );
}
