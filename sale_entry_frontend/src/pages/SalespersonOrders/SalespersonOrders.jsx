import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, ChevronDown } from 'lucide-react';
import api from '../../services/api';
import './SalespersonOrders.css';

const FILTERS = ['All', 'Pending', 'Confirmed', 'Processing', 'Delivered', 'Cancelled'];

export default function SalespersonOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my-orders');
      // The backend seems to return a list of orders (recent first usually, if not we reverse)
      setOrders((res.data || []).reverse());
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const customerName = order.customerName || '';
    const matchesSearch = customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || order.status?.toUpperCase() === activeFilter.toUpperCase();
    return matchesSearch && matchesFilter;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const toggleExpand = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/updatestatus/${orderId}`, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Failed to update status');
      console.error(err);
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await api.put(`/orders/delete-order/${orderId}`);
        setOrders(orders.filter(o => o.id !== orderId));
      } catch (err) {
        alert('Failed to delete order');
        console.error(err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'status-amber';
      case 'CONFIRMED': return 'status-blue';
      case 'PROCESSING': return 'status-purple';
      case 'DELIVERED': return 'status-emerald';
      case 'CANCELLED': return 'status-red';
      default: return 'status-gray';
    }
  };

  return (
    <div className="sp-orders-container">
      <div className="sp-orders-header">
        <div className="sp-header-titles">
          <h2>My Orders</h2>
          <p>Track and manage your sales orders</p>
        </div>
      </div>

      <div className="sp-orders-toolbar">
        <div className="sp-search-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by customer name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="sp-status-filters">
          {FILTERS.map(filter => (
            <button
              key={filter}
              className={`filter-pill filter-${filter.toLowerCase()} ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-orders-state">
          <div className="empty-icon-wrapper">
            <span className="empty-icon">📦</span>
          </div>
          <h3>No orders found</h3>
          <p>You haven't created any orders matching this criteria yet.</p>
          <button className="btn-primary create-order-btn">Create New Order</button>
        </div>
      ) : (
        <div className="sp-orders-list">
          {paginatedOrders.map(order => (
            <div key={order.id} className="sp-order-card">
              
              {/* Top Row: Date and Status */}
              <div className="order-card-top">
                <span className="order-date">{order.date || 'Unknown Date'}</span>
                <span className={`order-status-badge ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Middle Row: Customer and Items */}
              <div className="order-card-middle">
                <h3 className="order-customer-name">{order.customerName || 'Unknown Customer'}</h3>
                <span className="order-items-tag">{order.orderItemList?.length || 0} items</span>
              </div>

              {/* Bottom Row: Total and Actions */}
              <div className="order-card-bottom">
                <div className="order-total-price">
                  ₹{order.total.toFixed(2)}
                </div>
                
                <div className="order-actions">
                  <button className="order-action-btn btn-view" onClick={() => toggleExpand(order.id)}>
                    <Eye size={16} /> <span className="action-label">View</span>
                  </button>
                  
                  <div className="status-dropdown-wrapper">
                    <select 
                      className="status-select"
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    <div className="select-icon-overlay">
                      <ChevronDown size={14} /> Update Status
                    </div>
                  </div>

                  <button className="order-action-btn btn-delete" onClick={() => handleDelete(order.id)}>
                    <Trash2 size={16} /> <span className="action-label hidden-mobile">Delete</span>
                  </button>
                </div>
              </div>

              {/* Expanded Table State */}
              {expandedOrderId === order.id && (
                <div className="order-expanded-section">
                  <div className="expanded-header">
                    <h4>Order Details</h4>
                  </div>
                  <p className="expanded-subtitle">Expanded view for {order.customerName || 'Unknown Customer'}</p>
                  
                  <div className="table-responsive">
                    <table className="order-items-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th className="text-center">Qty</th>
                          <th className="text-right">Price</th>
                          <th className="text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.orderItemList?.map(item => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-right">₹{item.price}</td>
                            <td className="text-right fw-bold">₹{item.subtotal}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="text-right fw-bold">Total:</td>
                          <td className="text-right fw-bold text-lg">₹{(order.total || 0).toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="sp-pagination">
          <span className="pagination-info">Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length}</span>
          <div className="pagination-controls">
            <button 
              className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page} 
                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button 
              className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
