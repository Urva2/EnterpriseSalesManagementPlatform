import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, ChevronDown, FileText, Printer, X, Tag, CreditCard } from 'lucide-react';
import api from '../../services/api';
import PaymentModal from '../../components/PaymentModal/PaymentModal';
import './SalespersonOrders.css';

const FILTERS = ['All', 'Pending', 'Confirmed', 'Processing', 'Delivered', 'Cancelled'];

export default function SalespersonOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Invoice Modal State (#31 & #32)
  const [invoiceData, setInvoiceData] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Payment Modal State (#33 - #35)
  const [paymentOrderId, setPaymentOrderId] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Discount inline state
  const [editingDiscountOrderId, setEditingDiscountOrderId] = useState(null);
  const [discountVal, setDiscountVal] = useState('');

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

  // State Machine Validation (#22)
  const isValidTransition = (current, target) => {
    const c = current ? current.toUpperCase() : 'PENDING';
    const t = target ? target.toUpperCase() : '';
    if (c === t) return true;
    if (c === 'PENDING') return t === 'CONFIRMED' || t === 'CANCELLED';
    if (c === 'CONFIRMED') return t === 'PROCESSING' || t === 'CANCELLED';
    if (c === 'PROCESSING') return t === 'DELIVERED' || t === 'CANCELLED';
    return false; // DELIVERED and CANCELLED are terminal
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    if (!isValidTransition(order.status, newStatus)) {
      alert(`Invalid state transition: Cannot change status from ${order.status} to ${newStatus}. Valid transitions are: PENDING → CONFIRMED → PROCESSING → DELIVERED (or CANCELLED).`);
      return;
    }

    try {
      await api.put(`/orders/updatestatus/${orderId}`, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      const msg = err.response?.data || err.message || 'Failed to update status';
      alert(typeof msg === 'string' ? msg : JSON.stringify(msg));
      console.error(err);
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order? All product quantities will be restored back to stock.')) {
      try {
        await api.put(`/orders/delete-order/${orderId}`);
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
        alert('Order cancelled and inventory restored successfully.');
      } catch (err) {
        alert('Failed to cancel order');
        console.error(err);
      }
    }
  };

  // Dedicated Remove Item from Cart (#12)
  const handleRemoveOrderItem = async (orderItemId) => {
    if (window.confirm("Remove this item from order? Stock will be restored.")) {
      try {
        await api.delete(`/orders/removeItem/${orderItemId}`);
        fetchOrders();
      } catch (err) {
        alert("Failed to remove item: " + (err.response?.data || err.message));
      }
    }
  };

  // Apply Discount (#23)
  const handleApplyDiscount = async (orderId) => {
    const percent = parseFloat(discountVal);
    if (isNaN(percent) || percent < 0 || percent > 100) {
      alert("Discount must be between 0 and 100%");
      return;
    }
    try {
      const res = await api.put(`/orders/${orderId}/discount?percent=${percent}`);
      setOrders(orders.map(o => o.id === orderId ? {
        ...o,
        total: res.data.total,
        discountPercent: res.data.discountPercent,
        discountAmount: res.data.discountAmount
      } : o));
      setEditingDiscountOrderId(null);
      setDiscountVal('');
    } catch (err) {
      alert("Failed to apply discount: " + (err.response?.data || err.message));
    }
  };

  // Invoice Modal (#31 & #32)
  const handleOpenInvoice = async (orderId) => {
    try {
      const res = await api.get(`/orders/${orderId}/invoice`);
      setInvoiceData(res.data);
      setIsInvoiceOpen(true);
    } catch (err) {
      console.error("Failed to load invoice:", err);
      alert("Failed to load invoice");
    }
  };

  const getStatusColor = (status) => {
    switch(status ? status.toUpperCase() : '') {
      case 'PENDING': return 'status-amber';
      case 'CONFIRMED': return 'status-blue';
      case 'PROCESSING': return 'status-purple';
      case 'DELIVERED': return 'status-emerald';
      case 'CANCELLED': return 'status-red';
      default: return 'status-gray';
    }
  };

  const getPaymentColor = (paymentStatus) => {
    switch (paymentStatus ? paymentStatus.toUpperCase() : '') {
      case 'PAID': return 'status-emerald';
      case 'PARTIALLY_PAID': return 'status-amber';
      case 'REFUNDED': return 'status-purple';
      default: return 'status-red';
    }
  };

  const handleOpenPayments = (orderId) => {
    setPaymentOrderId(orderId);
    setIsPaymentOpen(true);
  };

  return (
    <div className="sp-orders-container">
      <div className="sp-orders-header">
        <div className="sp-header-titles">
          <h2>My Orders</h2>
          <p>Track, manage, and invoice your sales orders</p>
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
        </div>
      ) : (
        <div className="sp-orders-list">
          {paginatedOrders.map(order => (
            <div key={order.id} className="sp-order-card">
              
              {/* Top Row: Date and Status */}
              <div className="order-card-top">
                <span className="order-date">{order.date || 'Unknown Date'}</span>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span className={`order-status-badge ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className={`order-status-badge ${getPaymentColor(order.paymentStatus)}`}>
                    {order.paymentStatus || 'UNPAID'}
                  </span>
                </div>
              </div>

              {/* Middle Row: Customer and Items */}
              <div className="order-card-middle">
                <h3 className="order-customer-name">{order.customerName || 'Unknown Customer'}</h3>
                <span className="order-items-tag">{order.orderItemList?.length || 0} items</span>
              </div>

              {/* Bottom Row: Total and Actions */}
              <div className="order-card-bottom">
                <div>
                  <div className="order-total-price">
                    ₹{order.total.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                    ₹{(order.paidAmount || 0).toFixed(2)} paid • ₹{Math.max(0, order.total - (order.paidAmount || 0)).toFixed(2)} due
                  </div>
                  {order.discountPercent > 0 && (
                    <span style={{ fontSize: '0.75rem', color: '#10b981' }}>
                      ({order.discountPercent}% off applied)
                    </span>
                  )}
                </div>
                
                <div className="order-actions">
                  <button className="order-action-btn btn-view" onClick={() => toggleExpand(order.id)}>
                    <Eye size={16} /> <span className="action-label">View</span>
                  </button>

                  <button className="order-action-btn" title="Record & Manage Payments" onClick={() => handleOpenPayments(order.id)}>
                    <CreditCard size={16} /> <span className="action-label">Payments</span>
                  </button>

                  <button className="order-action-btn" title="View & Print Invoice" onClick={() => handleOpenInvoice(order.id)}>
                    <FileText size={16} /> <span className="action-label">Invoice</span>
                  </button>
                  
                  <div className="status-dropdown-wrapper">
                    <select 
                      className="status-select"
                      value={order.status ? order.status.toUpperCase() : 'PENDING'}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}
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

                  {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                    <button className="order-action-btn btn-delete" title="Cancel Order" onClick={() => handleDelete(order.id)}>
                      <Trash2 size={16} /> <span className="action-label hidden-mobile">Cancel</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Table State */}
              {expandedOrderId === order.id && (
                <div className="order-expanded-section">
                  <div className="expanded-header">
                    <h4>Order Details #{order.id}</h4>
                  </div>
                  <p className="expanded-subtitle">Expanded view for {order.customerName || 'Unknown Customer'}</p>
                  
                  {order.remarks && (
                    <div style={{
                      padding: '0.65rem 0.85rem', backgroundColor: '#f8fafc',
                      borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem',
                      border: '1px solid #e2e8f0'
                    }}>
                      <strong>Remarks:</strong> {order.remarks}
                    </div>
                  )}

                  <div className="table-responsive">
                    <table className="order-items-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th className="text-center">Qty</th>
                          <th className="text-right">Price</th>
                          <th className="text-right">Subtotal</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.orderItemList?.map(item => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-right">₹{item.price}</td>
                            <td className="text-right fw-bold">₹{item.subtotal}</td>
                            <td className="text-center">
                              {order.status === 'PENDING' && (
                                <button 
                                  onClick={() => handleRemoveOrderItem(item.id)}
                                  style={{
                                    border: 'none', background: 'transparent',
                                    color: '#ef4444', cursor: 'pointer', padding: '0.2rem'
                                  }}
                                  title="Remove item & restore stock"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        {order.discountAmount > 0 && (
                          <tr>
                            <td colSpan="3" className="text-right" style={{ color: '#10b981' }}>
                              Discount ({order.discountPercent}%):
                            </td>
                            <td className="text-right" style={{ color: '#10b981', fontWeight: 600 }}>
                              -₹{order.discountAmount.toFixed(2)}
                            </td>
                            <td></td>
                          </tr>
                        )}
                        <tr>
                          <td colSpan="3" className="text-right fw-bold">Total:</td>
                          <td className="text-right fw-bold text-lg">₹{(order.total || 0).toFixed(2)}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Discount Update Section (#23) */}
                  <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {editingDiscountOrderId === order.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input 
                          type="number"
                          placeholder="Discount %"
                          min="0"
                          max="100"
                          value={discountVal}
                          onChange={e => setDiscountVal(e.target.value)}
                          style={{ width: '120px', padding: '0.35rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                        />
                        <button 
                          onClick={() => handleApplyDiscount(order.id)}
                          style={{
                            padding: '0.35rem 0.75rem', backgroundColor: '#3b82f6', color: '#fff',
                            border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem'
                          }}
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingDiscountOrderId(null)}
                          style={{
                            padding: '0.35rem 0.5rem', backgroundColor: 'transparent',
                            border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => { setEditingDiscountOrderId(order.id); setDiscountVal(order.discountPercent || ''); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.35rem',
                          background: 'none', border: '1px dashed #94a3b8', borderRadius: '4px',
                          padding: '0.35rem 0.65rem', color: '#475569', fontSize: '0.8rem', cursor: 'pointer'
                        }}
                      >
                        <Tag size={13} /> {order.discountPercent > 0 ? `Change Discount (${order.discountPercent}%)` : 'Apply Discount'}
                      </button>
                    )}
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

      {/* INVOICE MODAL (#31 & #32) */}
      {isInvoiceOpen && invoiceData && (
        <div className="modal-backdrop" onClick={() => setIsInvoiceOpen(false)}>
          <div 
            className="modal-container" 
            onClick={e => e.stopPropagation()} 
            style={{ maxWidth: '640px', padding: '2rem', backgroundColor: '#ffffff', color: '#0f172a' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.5rem' }}>TAX INVOICE</h2>
                <div style={{ color: '#64748b', fontSize: '0.875rem' }}>SaleEntry Order Receipt</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: '#3b82f6' }}>{invoiceData.invoiceNumber}</div>
                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Date: {invoiceData.invoiceDate}</div>
                <span className="badge badge-success" style={{ display: 'inline-block', marginTop: '0.25rem' }}>
                  {invoiceData.orderStatus}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <div style={{ padding: '0.875rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>CUSTOMER:</div>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>{invoiceData.customerName}</div>
                <div style={{ color: '#64748b' }}>Phone: {invoiceData.customerPhone}</div>
                <div style={{ color: '#64748b' }}>{invoiceData.customerAddress}</div>
              </div>
              <div style={{ padding: '0.875rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>ISSUED BY:</div>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>{invoiceData.salespersonName || 'Salesperson'}</div>
                <div style={{ color: '#64748b' }}>Order ID: #{invoiceData.orderId}</div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                  <th style={{ padding: '0.6rem' }}>ITEM</th>
                  <th style={{ padding: '0.6rem', textAlign: 'center' }}>QTY</th>
                  <th style={{ padding: '0.6rem', textAlign: 'right' }}>PRICE</th>
                  <th style={{ padding: '0.6rem', textAlign: 'right' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items && invoiceData.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 500 }}>{item.productName}</td>
                    <td style={{ padding: '0.6rem', textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ padding: '0.6rem', textAlign: 'right' }}>₹{item.unitPrice.toFixed(2)}</td>
                    <td style={{ padding: '0.6rem', textAlign: 'right', fontWeight: 600 }}>₹{item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <span style={{ color: '#64748b' }}>Subtotal:</span>
                <span style={{ fontWeight: 600 }}>₹{invoiceData.subtotal.toFixed(2)}</span>
              </div>
              {invoiceData.discountAmount > 0 && (
                <div style={{ display: 'flex', gap: '2rem', color: '#10b981' }}>
                  <span>Discount ({invoiceData.discountPercent}%):</span>
                  <span>-₹{invoiceData.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: '2rem', fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', borderTop: '2px solid #e2e8f0', paddingTop: '0.5rem' }}>
                <span>Grand Total:</span>
                <span style={{ color: '#3b82f6' }}>₹{invoiceData.grandTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', gap: '2rem', color: '#16a34a', fontWeight: 600 }}>
                <span>Paid Amount:</span>
                <span>₹{(invoiceData.paidAmount || 0).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', gap: '2rem', color: (invoiceData.remainingBalance > 0 ? '#d97706' : '#16a34a'), fontWeight: 700 }}>
                <span>Balance Due:</span>
                <span>₹{(invoiceData.remainingBalance != null ? invoiceData.remainingBalance : Math.max(0, invoiceData.grandTotal - (invoiceData.paidAmount || 0))).toFixed(2)} ({invoiceData.paymentStatus || 'UNPAID'})</span>
              </div>
            </div>

            {invoiceData.remarks && (
              <div style={{ padding: '0.75rem', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.5rem', color: '#475569' }}>
                <strong>Remarks:</strong> {invoiceData.remarks}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn-ghost" onClick={() => setIsInvoiceOpen(false)}>
                Close
              </button>
              <button 
                className="btn-primary" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onClick={() => window.print()}
              >
                <Printer size={16} /> Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal (#33 - #35) */}
      <PaymentModal
        orderId={paymentOrderId}
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentUpdated={fetchOrders}
      />
    </div>
  );
}
