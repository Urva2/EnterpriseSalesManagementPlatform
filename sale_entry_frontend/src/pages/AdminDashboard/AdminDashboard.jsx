import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ClipboardList, Users, IndianRupee, Plus, LineChart, TrendingUp, AlertTriangle, Trophy, Calendar, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSalespersons: 0,
    totalRevenue: 0,
    topSalesPerson: 'N/A'
  });

  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salespersonRanking, setSalespersonRanking] = useState([]);

  // Date range for report
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [fromDate, setFromDate] = useState(thirtyDaysAgo);
  const [toDate, setToDate] = useState(today);
  const [reportData, setReportData] = useState(null);
  const [isReportLoading, setIsReportLoading] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 1. Stats
      const statsRes = await api.get('/admin/dashboard/stats');
      setStats(statsRes.data);

      // 2. Low stock alert (threshold=10)
      const lowStockRes = await api.get('/admin/products/low-stock?threshold=10&size=5');
      setLowStockProducts(lowStockRes.data.content || []);

      // 3. Top products
      const topProdRes = await api.get('/admin/reports/top-products?limit=5');
      setTopProducts(topProdRes.data || []);

      // 4. Salesperson rankings
      const rankingRes = await api.get('/admin/reports/salesperson-ranking');
      setSalespersonRanking(rankingRes.data || []);

      // 5. Initial sales report
      fetchSalesReport(thirtyDaysAgo, today);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const fetchSalesReport = async (from, to) => {
    try {
      setIsReportLoading(true);
      const res = await api.get(`/admin/reports/sales?from=${from}&to=${to}`);
      setReportData(res.data);
    } catch (error) {
      console.error("Error fetching sales report:", error);
    } finally {
      setIsReportLoading(false);
    }
  };

  const handleRunReport = (e) => {
    e.preventDefault();
    if (fromDate && toDate) {
      fetchSalesReport(fromDate, toDate);
    }
  };

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
        <div className="stat-card" onClick={() => navigate('/admin/products')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon blue">
            <Package size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Products</span>
            <span className="stat-value">{stats.totalProducts}</span>
            <span className="stat-trend neutral">Catalog Live</span>
          </div>
        </div>
        
        <div className="stat-card" onClick={() => navigate('/admin/orders')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon purple">
            <ClipboardList size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{stats.totalOrders}</span>
            <span className="stat-trend neutral">All time</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/admin/salespersons')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon emerald">
            <Users size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Salespersons</span>
            <span className="stat-value">{stats.totalSalespersons}</span>
            <span className="stat-trend neutral">Top: {stats.topSalesPerson || 'N/A'}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <IndianRupee size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">₹{(stats.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            <span className="stat-trend neutral">Gross System</span>
          </div>
        </div>
      </div>

      {/* 3. Quick Actions */}
      <div className="quick-actions-section">
        <h3 className="section-title">Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-card" onClick={() => navigate('/admin/products')}>
            <Plus size={18} className="action-icon" />
            <span className="action-title">Manage Products</span>
          </button>
          <button className="action-card" onClick={() => navigate('/admin/orders')}>
            <ClipboardList size={18} className="action-icon" />
            <span className="action-title">View All Orders</span>
          </button>
          <button className="action-card" onClick={() => navigate('/admin/salespersons')}>
            <Users size={18} className="action-icon" />
            <span className="action-title">Manage Salespersons</span>
          </button>
        </div>
      </div>

      {/* 4. Low Stock Alert Section (#6) */}
      {lowStockProducts.length > 0 && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #fed7aa',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: '#ffedd5', color: '#ea580c',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#9a3412', fontWeight: 600 }}>Low Stock Alert</h3>
                <span style={{ fontSize: '0.85rem', color: '#c2410c' }}>Products with 10 or fewer units in stock</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/admin/products')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                backgroundColor: 'transparent', border: 'none', color: '#ea580c',
                fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              Restock in Products <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {lowStockProducts.map(p => (
              <div key={p.id} style={{
                padding: '0.875rem 1rem',
                backgroundColor: '#fff7ed',
                borderRadius: '8px',
                border: '1px solid #ffedd5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.itemWeight} • ₹{p.price}</div>
                </div>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: p.stockQuantity <= 3 ? '#fee2e2' : '#fef3c7',
                  color: p.stockQuantity <= 3 ? '#dc2626' : '#d97706'
                }}>
                  {p.stockQuantity} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Sales Report & Analytics Section (#18) */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              backgroundColor: '#eff6ff', color: '#3b82f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Calendar size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: 600 }}>Sales Period Report</h3>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Filter revenue & orders across custom dates</span>
            </div>
          </div>

          <form onSubmit={handleRunReport} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>From:</span>
              <input 
                type="date" 
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                required
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>To:</span>
              <input 
                type="date" 
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                required
              />
            </div>
            <button 
              type="submit" 
              style={{
                backgroundColor: '#3b82f6', color: '#ffffff',
                border: 'none', borderRadius: '6px',
                padding: '0.45rem 1rem', fontSize: '0.875rem',
                fontWeight: 600, cursor: 'pointer'
              }}
              disabled={isReportLoading}
            >
              {isReportLoading ? 'Loading...' : 'Generate Report'}
            </button>
          </form>
        </div>

        {reportData && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>Period Revenue</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>₹{(reportData.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>Period Orders</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#6366f1' }}>{reportData.totalOrders || 0}</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>Avg Order Value</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b' }}>₹{(reportData.averageOrderValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        )}
      </div>

      {/* 6. Top Products & Salesperson Leaderboard Row (#19, #20) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Top Products Table (#19) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <TrendingUp size={20} color="#3b82f6" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>Top Selling Products</h3>
          </div>
          {topProducts.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No product order data available yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem 0' }}>PRODUCT</th>
                  <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>UNITS SOLD</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((tp, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '0.65rem 0', fontWeight: 500, color: '#1e293b' }}>
                      <span style={{ color: '#94a3b8', marginRight: '0.5rem' }}>#{idx + 1}</span>
                      {tp.productName}
                    </td>
                    <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 600, color: '#3b82f6' }}>
                      {tp.quantitySold}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Salesperson Leaderboard (#20) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Trophy size={20} color="#f59e0b" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>Salesperson Leaderboard</h3>
          </div>
          {salespersonRanking.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No salesperson rankings available yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem 0' }}>NAME</th>
                  <th style={{ padding: '0.5rem 0', textAlign: 'center' }}>ORDERS</th>
                  <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>REVENUE</th>
                </tr>
              </thead>
              <tbody>
                {salespersonRanking.map((sp, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '0.65rem 0', fontWeight: 500, color: '#1e293b' }}>
                      <span style={{
                        display: 'inline-block', width: '20px', height: '20px',
                        borderRadius: '50%', textAlign: 'center', lineHeight: '20px',
                        fontSize: '0.75rem', fontWeight: 700, marginRight: '0.5rem',
                        backgroundColor: idx === 0 ? '#fef3c7' : '#f1f5f9',
                        color: idx === 0 ? '#d97706' : '#64748b'
                      }}>
                        {idx + 1}
                      </span>
                      {sp.salesPersonName}
                    </td>
                    <td style={{ padding: '0.65rem 0', textAlign: 'center', color: '#64748b' }}>
                      {sp.orders}
                    </td>
                    <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 600, color: '#10b981' }}>
                      ₹{(sp.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
