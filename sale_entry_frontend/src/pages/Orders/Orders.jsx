import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, X, ChevronRight, FileText, Printer, History, CreditCard } from 'lucide-react';
import api from '../../services/api';
import PaymentModal from '../../components/PaymentModal/PaymentModal';
import './Orders.css';

const TABS = ["All", "Pending", "Confirmed", "Processing", "Delivered", "Cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Invoice Modal State (#31 & #32)
  const [invoiceData, setInvoiceData] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isInvoiceLoading, setIsInvoiceLoading] = useState(false);

  // Customer Purchase History Modal State (#21)
  const [customerHistory, setCustomerHistory] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // Payment Modal State (#33 - #35)
  const [paymentOrderId, setPaymentOrderId] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const fetchOrders = async (query = '') => {
    try {
      const url = query ? `/orders/search?customerName=${query}` : '/orders/viewOrders';
      const response = await api.get(url);
      const formattedOrders = (response.data.content || []).map(order => ({
        id: `ORD-${order.id}`,
        dbId: order.id,
        date: order.date,
        customerId: order.customer?.id,
        customer: order.customerName || order.customer?.name || 'Unknown',
        items: order.orderItemList ? order.orderItemList.reduce((sum, item) => sum + item.quantity, 0) : 0,
        status: order.status ? order.status.toUpperCase() : 'PENDING',
        total: order.total || 0,
        paidAmount: order.paidAmount || 0,
        paymentStatus: order.paymentStatus || 'UNPAID',
        remainingBalance: order.remainingBalance != null ? order.remainingBalance : Math.max(0, (order.total || 0) - (order.paidAmount || 0)),
        remarks: order.remarks || '',
        discountPercent: order.discountPercent || 0,
        discountAmount: order.discountAmount || 0,
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
    if(window.confirm("Are you sure you want to cancel/delete this order? Stock will be restored.")) {
      try {
        await api.put(`/orders/delete-order/${id}`);
        setSelectedOrder(null);
        fetchOrders(searchQuery);
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  const handleOpenInvoice = async (orderId) => {
    try {
      setIsInvoiceLoading(true);
      const res = await api.get(`/orders/${orderId}/invoice`);
      setInvoiceData(res.data);
      setIsInvoiceOpen(true);
    } catch (error) {
      console.error("Failed to load invoice:", error);
      alert("Failed to load invoice");
    } finally {
      setIsInvoiceLoading(false);
    }
  };

  const handleOpenCustomerHistory = async (order) => {
    try {
      setIsHistoryLoading(true);
      // We search for orders with this customer's name
      const res = await api.get(`/orders/search?customerName=${encodeURIComponent(order.customer)}`);
      setCustomerHistory({
        customerName: order.customer,
        orders: res.data.content || []
      });
      setIsHistoryOpen(true);
    } catch (error) {
      console.error("Failed to load customer history:", error);
      alert("Failed to load customer purchase history");
    } finally {
      setIsHistoryLoading(false);
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

  const getPaymentBadgeClass = (status) => {
    switch(status) {
      case 'PAID': return 'badge-green';
      case 'PARTIALLY_PAID': return 'badge-amber';
      case 'REFUNDED': return 'badge-purple';
      default: return 'badge-red';
    }
  };

  const handleOpenPayments = (orderId) => {
    setPaymentOrderId(orderId);
    setIsPaymentOpen(true);
  };

  const filteredOrders = orders.filter(order => {
    return activeTab === 'All' || order.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="orders-container">
      {/* 1. Page Header */}
      <div className="page-header">
        <div className="header-titles">
          <h2>All Orders</h2>
          <p>Monitor all sales orders & generate invoices</p>
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
              className={`filter-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Orders Table (Desktop) */}
      <div className="table-container hidden-mobile">
        <table className="data-table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>DATE</th>
              <th>CUSTOMER</th>
              <th>ITEMS</th>
              <th>TOTAL</th>
              <th>STATUS</th>
              <th>PAYMENT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td className="font-semibold text-primary">{order.id}</td>
                <td className="text-muted">{order.date}</td>
                <td className="font-medium text-dark">{order.customer}</td>
                <td>{order.items} items</td>
                <td className="font-bold text-dark">₹{order.total.toFixed(2)}</td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <span className={`badge ${getPaymentBadgeClass(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                  <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '2px' }}>
                    ₹{order.paidAmount.toFixed(2)} / ₹{order.total.toFixed(2)}
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn" title="View Details" onClick={() => setSelectedOrder(order)}>
                      <Eye size={16} />
                    </button>
                    <button className="icon-btn text-warning" title="Manage Payments" onClick={() => handleOpenPayments(order.dbId)}>
                      <CreditCard size={16} />
                    </button>
                    <button className="icon-btn text-primary" title="Generate Invoice" onClick={() => handleOpenInvoice(order.dbId)}>
                      <FileText size={16} />
                    </button>
                    <button className="icon-btn text-danger" title="Delete" onClick={() => handleDeleteOrder(order.dbId)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Mobile Order Cards */}
      <div className="mobile-cards-list hidden-desktop">
        {filteredOrders.map(order => (
          <div className="mobile-order-card" key={order.id} onClick={() => setSelectedOrder(order)}>
            <div className="order-card-header">
              <span className="order-id">{order.id}</span>
              <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="order-card-body">
              <span className="customer-name">{order.customer}</span>
              <div className="order-card-subdetails">
                <span>{order.date}</span>
                <span>•</span>
                <span>{order.items} items</span>
              </div>
            </div>
            <div className="order-card-footer">
              <span className="order-total-price">₹{order.total.toFixed(2)}</span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button 
                  className="icon-btn" 
                  onClick={(e) => { e.stopPropagation(); handleOpenInvoice(order.dbId); }}
                  title="Invoice"
                >
                  <FileText size={16} />
                </button>
                <ChevronRight size={18} className="chevron-icon" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Slide-in Detail Panel */}
      {selectedOrder && (
        <div className="slide-panel-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="slide-panel" onClick={e => e.stopPropagation()}>
            <div className="slide-panel-header">
              <h3>Order Details ({selectedOrder.id})</h3>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}><X size={20} /></button>
            </div>
            
            <div className="slide-panel-body">
              <div className="panel-order-info">
                <div className="info-row">
                  <span className="info-label">Customer</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="info-val font-bold">{selectedOrder.customer}</span>
                    <button 
                      onClick={() => handleOpenCustomerHistory(selectedOrder)}
                      style={{
                        padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px',
                        border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#475569'
                      }}
                      title="View all orders by this customer across the store"
                    >
                      <History size={12} /> History
                    </button>
                  </div>
                </div>
                <div className="info-row">
                  <span className="info-label">Date</span>
                  <span className="info-val">{selectedOrder.date}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Status</span>
                  <span className={`badge ${getStatusBadgeClass(selectedOrder.status)}`}>{selectedOrder.status}</span>
                </div>
                {selectedOrder.remarks && (
                  <div className="info-row">
                    <span className="info-label">Remarks</span>
                    <span className="info-val">{selectedOrder.remarks}</span>
                  </div>
                )}
                {selectedOrder.discountPercent > 0 && (
                  <div className="info-row">
                    <span className="info-label">Discount</span>
                    <span className="info-val text-success">{selectedOrder.discountPercent}% (-₹{selectedOrder.discountAmount.toFixed(2)})</span>
                  </div>
                )}
                <div className="info-row">
                  <span className="info-label">Payment</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${getPaymentBadgeClass(selectedOrder.paymentStatus)}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                    <button
                      onClick={() => handleOpenPayments(selectedOrder.dbId)}
                      style={{
                        padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px',
                        border: '1px solid #cbd5e1', backgroundColor: '#eff6ff', color: '#1d4ed8', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.25rem'
                      }}
                    >
                      <CreditCard size={12} /> Manage
                    </button>
                  </div>
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

            <div className="slide-panel-footer" style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                className="btn-primary" 
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onClick={() => handleOpenInvoice(selectedOrder.dbId)}
              >
                <FileText size={18} />
                View Invoice
              </button>
              <button className="btn-danger-outline" onClick={() => handleDeleteOrder(selectedOrder.dbId)}>
                <Trash2 size={18} />
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. INVOICE MODAL (#31 & #32) */}
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
                <div style={{ color: '#64748b', fontSize: '0.875rem' }}>SaleEntry Management System</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: '#3b82f6' }}>{invoiceData.invoiceNumber}</div>
                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Date: {invoiceData.invoiceDate}</div>
                <span className="badge badge-success" style={{ display: 'inline-block', marginTop: '0.25rem' }}>
                  {invoiceData.orderStatus}
                </span>
              </div>
            </div>

            {/* Customer & Salesperson details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <div style={{ padding: '0.875rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>BILLED TO:</div>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>{invoiceData.customerName}</div>
                <div style={{ color: '#64748b' }}>Phone: {invoiceData.customerPhone}</div>
                <div style={{ color: '#64748b' }}>{invoiceData.customerAddress}</div>
              </div>
              <div style={{ padding: '0.875rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>SALESPERSON:</div>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>{invoiceData.salespersonName || 'Store Counter'}</div>
                <div style={{ color: '#64748b' }}>Order ID: #{invoiceData.orderId}</div>
              </div>
            </div>

            {/* Itemized Table */}
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

            {/* Totals */}
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

            {/* Actions */}
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

      {/* 7. CUSTOMER PURCHASE HISTORY MODAL (#21) */}
      {isHistoryOpen && customerHistory && (
        <div className="modal-backdrop" onClick={() => setIsHistoryOpen(false)}>
          <div 
            className="modal-container" 
            onClick={e => e.stopPropagation()} 
            style={{ maxWidth: '600px', backgroundColor: '#ffffff', color: '#0f172a' }}
          >
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0 }}>Customer Purchase History</h3>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{customerHistory.customerName}</span>
              </div>
              <button className="close-btn" onClick={() => setIsHistoryOpen(false)}><X size={20} /></button>
            </div>
            
            <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {customerHistory.orders.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No orders found for this customer.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {customerHistory.orders.map(o => (
                    <div key={o.id} style={{
                      padding: '0.875rem', borderRadius: '8px', border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>Order #{o.id}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Date: {o.date} • {o.orderItemList?.length || 0} items</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, color: '#3b82f6' }}>₹{o.total.toFixed(2)}</div>
                        <span className={`badge ${getStatusBadgeClass(o.status)}`} style={{ fontSize: '0.7rem' }}>
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setIsHistoryOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Payment Modal (#33 - #35) */}
      <PaymentModal
        orderId={paymentOrderId}
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentUpdated={() => fetchOrders(searchQuery)}
      />
    </div>
  );
}
