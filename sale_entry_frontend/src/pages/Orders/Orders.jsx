import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, X, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import './Orders.css';

const TABS = ["All", "Pending", "Confirmed", "Processing", "Delivered", "Cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async (query = '') => {
    try {
      const url = query ? `/orders/search?customerName=${query}` : '/orders/viewOrders';
      const response = await api.get(url);
      // Format backend orders
      const formattedOrders = (response.data.content || []).map(order => ({
        id: `ORD-${order.id}`,
        dbId: order.id,
        date: order.date, // might need formatting
        customer: order.customer?.name || 'Unknown',
        items: order.orderItemList ? order.orderItemList.reduce((sum, item) => sum + item.quantity, 0) : 0,
        status: order.status ? order.status.toUpperCase() : 'PENDING',
        total: order.total || 0,
        details: order.orderItemList ? order.orderItemList.map(item => ({
          name: item.name || item.product?.name,
          qty: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        })) : []
      }));
      setOrders(formattedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleDeleteOrder = async (id) => {
    if(window.confirm("Are you sure you want to delete this order?")) {
      try {
        await api.put(`/orders/delete-order/${id}`);
        setSelectedOrder(null);
        fetchOrders(searchQuery);
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'PENDING': return 'badge-amber';
      case 'CONFIRMED': return 'badge-blue';
      case 'PROCESSING': return 'badge-purple';
      case 'DELIVERED': return 'badge-green';
      case 'CANCELLED': return 'badge-red';
      default: return '';
    }
  };

  // Status is still filtered client-side since API doesn't have a combined endpoint
  const filteredOrders = orders.filter(order => {
    return activeTab === 'All' || order.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="orders-container">
      {/* 1. Page Header */}
      <div className="page-header">
        <div className="header-titles">
          <h2>All Orders</h2>
          <p>Monitor all sales orders</p>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by customer name..." 
            className="search-input" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {TABS.map(tab => (
            <button 
              key={tab} 
              className={`pill-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Data Table (Desktop) */}
      <div className="table-container hidden-mobile">
        <table className="data-table">
          <thead>
            <tr>
              <th>ORDER DATE</th>
              <th>CUSTOMER</th>
              <th>ITEMS</th>
              <th>STATUS</th>
              <th>TOTAL (₹)</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td className="text-dark font-medium">{order.date}</td>
                <td className="text-dark font-medium">{order.customer}</td>
                <td className="text-muted">{order.items} {order.items === 1 ? 'item' : 'items'}</td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(order.status)}`}>{order.status}</span>
                </td>
                <td className="text-dark font-bold">₹{order.total.toFixed(2)}</td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn" title="View Details" onClick={() => setSelectedOrder(order)}>
                      <Eye size={16} />
                    </button>
                    <button className="icon-btn danger" title="Delete" onClick={() => handleDeleteOrder(order.dbId)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Mobile Cards */}
      <div className="mobile-cards-list hidden-desktop">
        {filteredOrders.map(order => (
          <div className="mobile-order-card" key={order.id} onClick={() => setSelectedOrder(order)}>
            <div className="order-card-header">
              <span className="order-customer">{order.customer}</span>
              <span className="order-date">{order.date}</span>
            </div>
            <div className="order-card-status-row">
              <span className={`badge ${getStatusBadgeClass(order.status)}`}>{order.status}</span>
            </div>
            <div className="order-card-bottom">
              <span className="order-total">₹{order.total.toFixed(2)}</span>
              <div className="order-items-tag">
                {order.items} {order.items === 1 ? 'item' : 'items'}
                <ChevronRight size={16} className="expand-arrow"/>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Pagination Bar */}
      <div className="pagination-bar">
        <span className="pagination-info">Showing {filteredOrders.length} orders</span>
        <div className="pagination-controls">
          <button className="page-btn disabled">Previous</button>
          <button className="page-btn active">1</button>
          <button className="page-btn disabled">Next</button>
        </div>
      </div>

      {/* 6. Slide-in Detail Panel */}
      {selectedOrder && (
        <div className="slide-panel-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="slide-panel" onClick={e => e.stopPropagation()}>
            <div className="slide-panel-header">
              <h3>Order Details</h3>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}><X size={20} /></button>
            </div>
            
            <div className="slide-panel-body">
              <div className="panel-order-info">
                <div className="info-row">
                  <span className="info-label">Customer</span>
                  <span className="info-val font-bold">{selectedOrder.customer}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Date</span>
                  <span className="info-val">{selectedOrder.date}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Status</span>
                  <span className={`badge ${getStatusBadgeClass(selectedOrder.status)}`}>{selectedOrder.status}</span>
                </div>
              </div>

              <div className="panel-items-section">
                <h4>Items Ordered</h4>
                <div className="items-table-wrapper">
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.details && selectedOrder.details.length > 0 ? (
                        selectedOrder.details.map((item, idx) => (
                          <tr key={idx}>
                            <td className="item-name">{item.name}</td>
                            <td>{item.qty}</td>
                            <td>₹{item.price.toFixed(2)}</td>
                            <td>₹{item.subtotal.toFixed(2)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center text-muted py-4">No detailed items found for this order.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="order-total-line">
                  <span>Order Total:</span>
                  <span className="total-amount">₹{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="slide-panel-footer">
              <button className="btn-danger-outline" onClick={() => handleDeleteOrder(selectedOrder.dbId)}>
                <Trash2 size={18} />
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
