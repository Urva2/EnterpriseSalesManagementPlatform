import React, { useState, useEffect, useMemo } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Smartphone, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Filter, 
  RotateCcw, 
  Eye, 
  Plus, 
  Calendar, 
  X, 
  Receipt, 
  FileText, 
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import paymentService from '../../services/paymentService';
import './Payments.css';

export default function Payments({ role = 'ADMIN' }) {
  // Navigation tab: 'dashboard' | 'record' | 'history'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Core Data
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Record Payment Form State
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [transactionRef, setTransactionRef] = useState('');
  const [remarks, setRemarks] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Alerts
  const [successToast, setSuccessToast] = useState('');
  const [errorToast, setErrorToast] = useState('');

  // Payment Details Modal State
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Refund Dialog State
  const [refundTargetPayment, setRefundTargetPayment] = useState(null);
  const [refundReason, setRefundReason] = useState('');
  const [refundSubmitting, setRefundSubmitting] = useState(false);

  // History Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMethod, setFilterMethod] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Initial Data Fetch
  useEffect(() => {
    loadData();
  }, [role]);

  const loadData = async () => {
    try {
      setLoading(true);
      const ordersData = await paymentService.getOrders(role);
      setOrders(ordersData);

      const allPayments = await paymentService.getAllPayments(ordersData);
      setPayments(allPayments);
    } catch (err) {
      console.error('Failed to load payments data:', err);
      setErrorToast('Failed to load financial records. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setErrorToast('');
    setSuccessToast('');
    await loadData();
    setRefreshing(false);
  };

  // Selected Order for Record Payment
  const activeOrder = useMemo(() => {
    if (!selectedOrderId) return null;
    return orders.find(o => String(o.id) === String(selectedOrderId)) || null;
  }, [selectedOrderId, orders]);

  // Derived financial figures for selected order
  const orderTotal = activeOrder?.total || 0;
  const orderPaid = activeOrder?.paidAmount || 0;
  const orderRemaining = Math.max(0, orderTotal - orderPaid);

  // Dynamic remaining balance after entered payment amount
  const parsedAmount = parseFloat(paymentAmount) || 0;
  const remainingAfterPayment = Math.max(0, orderRemaining - parsedAmount);

  // Overall Financial Dashboard Metrics
  const metrics = useMemo(() => {
    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalReceived = orders.reduce((sum, o) => sum + (o.paidAmount || 0), 0);
    const pendingAmount = Math.max(0, totalSales - totalReceived);
    const completedPayments = payments.filter(p => p.paymentStatus === 'COMPLETED');
    const totalTransactions = payments.length;
    const collectionRate = totalSales > 0 ? ((totalReceived / totalSales) * 100).toFixed(1) : '0.0';

    return {
      totalSales,
      totalReceived,
      pendingAmount,
      totalTransactions,
      completedCount: completedPayments.length,
      collectionRate
    };
  }, [orders, payments]);

  // Form Validation
  const validatePaymentForm = () => {
    if (!selectedOrderId) {
      setErrorToast('Please select a sale order.');
      return false;
    }
    if (parsedAmount <= 0) {
      setErrorToast('Payment amount must be greater than ₹0.00.');
      return false;
    }
    if (parsedAmount > orderRemaining + 0.01) {
      setErrorToast(`Payment amount (₹${parsedAmount.toFixed(2)}) cannot exceed the remaining balance (₹${orderRemaining.toFixed(2)}).`);
      return false;
    }
    return true;
  };

  // Handle Form Pre-submit (triggers confirmation dialog)
  const handlePreSubmit = (e) => {
    e.preventDefault();
    setErrorToast('');
    if (validatePaymentForm()) {
      setShowConfirmModal(true);
    }
  };

  // Execute Payment Submission
  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setFormSubmitting(true);
    setErrorToast('');
    setSuccessToast('');

    try {
      await paymentService.recordPayment(activeOrder.id, {
        amount: parsedAmount,
        paymentMethod,
        transactionReference: transactionRef,
        remarks: remarks || `Manual payment recorded on ${paymentDate}`
      });

      setSuccessToast(`Payment of ₹${parsedAmount.toFixed(2)} recorded successfully for Order #${activeOrder.id}!`);
      
      // Reset form
      setPaymentAmount('');
      setTransactionRef('');
      setRemarks('');
      setSelectedOrderId('');

      // Reload fresh data
      await loadData();
      setActiveTab('history');
    } catch (err) {
      console.error('Payment record failed:', err);
      const msg = err.response?.data?.message || err.response?.data || err.message || 'Payment submission failed';
      setErrorToast(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Refund Submission
  const handleProcessRefund = async () => {
    if (!refundTargetPayment) return;
    setRefundSubmitting(true);
    setErrorToast('');
    try {
      await paymentService.refundPayment(refundTargetPayment.id, refundReason);
      setSuccessToast(`Payment #${refundTargetPayment.id} refunded successfully.`);
      setRefundTargetPayment(null);
      setRefundReason('');
      setIsDetailsOpen(false);
      await loadData();
    } catch (err) {
      console.error('Refund failed:', err);
      const msg = err.response?.data?.message || err.response?.data || 'Refund processing failed';
      setErrorToast(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setRefundSubmitting(false);
    }
  };

  // Filtered Payments History
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      // Search
      const q = searchQuery.toLowerCase();
      const matchSearch = 
        String(p.id).includes(q) ||
        String(p.orderId).includes(q) ||
        (p.customerName || '').toLowerCase().includes(q) ||
        (p.transactionReference || '').toLowerCase().includes(q);

      // Method
      const matchMethod = filterMethod === 'ALL' || p.paymentMethod === filterMethod;

      // Status
      const matchStatus = filterStatus === 'ALL' || p.paymentStatus === filterStatus;

      // Date Range
      let matchDate = true;
      if (filterFromDate && p.paymentDate) {
        matchDate = matchDate && new Date(p.paymentDate) >= new Date(filterFromDate);
      }
      if (filterToDate && p.paymentDate) {
        matchDate = matchDate && new Date(p.paymentDate) <= new Date(filterToDate + 'T23:59:59');
      }

      return matchSearch && matchMethod && matchStatus && matchDate;
    });
  }, [payments, searchQuery, filterMethod, filterStatus, filterFromDate, filterToDate]);

  // Paginated History
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage) || 1;
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(start, start + itemsPerPage);
  }, [filteredPayments, currentPage, itemsPerPage]);

  // Helpers
  const formatCurrency = (val) => `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="status-pill-badge status-completed"><CheckCircle2 size={12} /> Completed</span>;
      case 'REFUNDED':
        return <span className="status-pill-badge status-refunded"><RotateCcw size={12} /> Refunded</span>;
      case 'PENDING':
        return <span className="status-pill-badge status-pending"><Clock size={12} /> Pending</span>;
      case 'FAILED':
      default:
        return <span className="status-pill-badge status-failed"><AlertCircle size={12} /> Failed</span>;
    }
  };

  const getMethodBadge = (method) => {
    switch (method) {
      case 'CASH':
        return <span className="method-badge method-cash"><DollarSign size={13} /> Cash</span>;
      case 'UPI':
        return <span className="method-badge method-upi"><Smartphone size={13} /> UPI / QR</span>;
      case 'CARD':
      default:
        return <span className="method-badge method-card"><CreditCard size={13} /> Card (POS)</span>;
    }
  };

  return (
    <div className="payments-page-container">
      {/* 1. Page Header */}
      <div className="payments-header">
        <div className="payments-title-group">
          <h2>
            <span>Payment Management</span>
            <span className={`role-badge ${role === 'ADMIN' ? 'admin-badge' : ''}`}>
              {role === 'ADMIN' ? 'Store Master Ledger' : 'My Settlements'}
            </span>
          </h2>
          <p>
            {role === 'ADMIN' 
              ? 'Complete financial oversight across store sales, customer receivables, and payment audits' 
              : 'Track collections, record customer payments, and manage order balances'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
          <button 
            className="btn-secondary" 
            onClick={handleRefresh} 
            disabled={refreshing}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
            <span>Refresh</span>
          </button>

          <button 
            className="header-action-btn"
            onClick={() => setActiveTab('record')}
          >
            <Plus size={15} />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Toast Alerts */}
      {successToast && (
        <div className="alert-toast alert-toast-success">
          <CheckCircle2 size={16} />
          <span>{successToast}</span>
          <button onClick={() => setSuccessToast('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}><X size={15} /></button>
        </div>
      )}
      {errorToast && (
        <div className="alert-toast alert-toast-error">
          <AlertCircle size={16} />
          <span>{errorToast}</span>
          <button onClick={() => setErrorToast('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}><X size={15} /></button>
        </div>
      )}

      {/* 2. Navigation Tabs */}
      <div className="payments-nav-tabs">
        <button 
          className={`payments-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <TrendingUp size={15} />
          <span>Overview</span>
        </button>
        <button 
          className={`payments-tab-btn ${activeTab === 'record' ? 'active' : ''}`}
          onClick={() => setActiveTab('record')}
        >
          <CreditCard size={15} />
          <span>Record Payment</span>
        </button>
        <button 
          className={`payments-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Receipt size={15} />
          <span>Transactions Ledger</span>
          <span className="tab-badge">{payments.length}</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: FINTECH OVERVIEW DASHBOARD
         ========================================================================= */}
      {activeTab === 'dashboard' && (
        <>
          {/* Summary KPI Cards */}
          <div className="fintech-summary-grid">
            {/* Card 1: Total Sales */}
            <div className="fintech-kpi-card">
              <div className="kpi-card-header">
                <span className="kpi-label">Total Sales Volume</span>
                <div className="kpi-icon-bubble bubble-blue">
                  <Receipt size={16} />
                </div>
              </div>
              <div>
                <div className="kpi-value">{formatCurrency(metrics.totalSales)}</div>
                <div className="kpi-subtext">
                  <span>Across {orders.length} total orders</span>
                </div>
              </div>
            </div>

            {/* Card 2: Received */}
            <div className="fintech-kpi-card">
              <div className="kpi-card-header">
                <span className="kpi-label">Settled Amount</span>
                <div className="kpi-icon-bubble bubble-emerald">
                  <ArrowDownLeft size={16} />
                </div>
              </div>
              <div>
                <div className="kpi-value" style={{ color: '#15803d' }}>
                  {formatCurrency(metrics.totalReceived)}
                </div>
                <div className="kpi-subtext">
                  <span className="highlight-good">{metrics.collectionRate}% collected</span>
                  <span>of total volume</span>
                </div>
                <div className="collection-progress-bar">
                  <div 
                    className="collection-progress-fill" 
                    style={{ width: `${Math.min(100, Math.max(0, metrics.collectionRate))}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Card 3: Pending */}
            <div className="fintech-kpi-card">
              <div className="kpi-card-header">
                <span className="kpi-label">Outstanding Receivables</span>
                <div className="kpi-icon-bubble bubble-amber">
                  <Clock size={16} />
                </div>
              </div>
              <div>
                <div className="kpi-value" style={{ color: '#b45309' }}>
                  {formatCurrency(metrics.pendingAmount)}
                </div>
                <div className="kpi-subtext">
                  <span className="highlight-warning">
                    {orders.filter(o => (o.total - (o.paidAmount || 0)) > 0).length} orders pending
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Total Transactions */}
            <div className="fintech-kpi-card">
              <div className="kpi-card-header">
                <span className="kpi-label">Total Ledger Entries</span>
                <div className="kpi-icon-bubble bubble-purple">
                  <CreditCard size={16} />
                </div>
              </div>
              <div>
                <div className="kpi-value">{metrics.totalTransactions}</div>
                <div className="kpi-subtext">
                  <span>{metrics.completedCount} completed successfully</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Split Widgets: Recent Activity + Settlement Health */}
          <div className="dashboard-widgets-grid">
            {/* Widget 1: Recent Activity */}
            <div className="fintech-card">
              <div className="card-title-bar">
                <h3>
                  <Clock size={16} />
                  <span>Recent Payment Activity</span>
                </h3>
                <button 
                  className="btn-link" 
                  onClick={() => setActiveTab('history')}
                >
                  View All →
                </button>
              </div>

              {payments.length === 0 ? (
                <div className="empty-state-box">
                  <CreditCard size={36} style={{ color: '#a1a1aa' }} />
                  <h4>No payment transactions yet</h4>
                  <p>Record your first payment against an active order to populate this ledger.</p>
                  <button className="header-action-btn" onClick={() => setActiveTab('record')}>
                    <Plus size={15} /> Record First Payment
                  </button>
                </div>
              ) : (
                <div className="fintech-table-container">
                  <table className="fintech-data-table">
                    <thead>
                      <tr>
                        <th>PAYMENT ID</th>
                        <th>ORDER #</th>
                        <th>CUSTOMER</th>
                        <th>AMOUNT</th>
                        <th>METHOD</th>
                        <th>STATUS</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.slice(0, 5).map(p => (
                        <tr key={p.id}>
                          <td className="payment-id-tag">#PAY-{p.id}</td>
                          <td>
                            <span className="order-link-tag">#ORD-{p.orderId}</span>
                          </td>
                          <td className="font-medium">{p.customerName || 'Customer'}</td>
                          <td className="amount-text">{formatCurrency(p.amount)}</td>
                          <td>{getMethodBadge(p.paymentMethod)}</td>
                          <td>{getStatusBadge(p.paymentStatus)}</td>
                          <td>
                            <button 
                              className="icon-action-btn" 
                              title="View Details"
                              onClick={() => { setSelectedPayment(p); setIsDetailsOpen(true); }}
                            >
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Widget 2: Settlement Health & Receivables Breakdown */}
            <div className="fintech-card">
              <div className="card-title-bar">
                <h3>
                  <ShieldCheck size={16} />
                  <span>Settlement Health</span>
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="admin-insight-box">
                  <div className="insight-metric-row">
                    <span>Fully Settled Orders</span>
                    <strong>{orders.filter(o => o.total > 0 && Math.max(0, o.total - (o.paidAmount || 0)) <= 0.01).length} / {orders.length}</strong>
                  </div>
                  <div className="insight-metric-row">
                    <span>Partially Paid</span>
                    <strong style={{ color: '#b45309' }}>{orders.filter(o => (o.paidAmount || 0) > 0 && (o.total - (o.paidAmount || 0)) > 0.01).length}</strong>
                  </div>
                  <div className="insight-metric-row">
                    <span>Unpaid Orders</span>
                    <strong style={{ color: '#b91c1c' }}>{orders.filter(o => (o.paidAmount || 0) <= 0.01 && o.total > 0).length}</strong>
                  </div>
                </div>

                <div className="admin-insight-box">
                  <div className="insight-metric-row">
                    <span>Collection Efficiency</span>
                    <strong style={{ color: '#15803d' }}>{metrics.collectionRate}%</strong>
                  </div>
                  <div className="insight-metric-row">
                    <span>Average Ticket</span>
                    <strong>{formatCurrency(payments.length > 0 ? (metrics.totalReceived / payments.length) : 0)}</strong>
                  </div>
                </div>

                <button 
                  className="header-action-btn" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => setActiveTab('record')}
                >
                  <Plus size={15} /> Collect New Payment
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          TAB 2: RECORD PAYMENT PAGE / FORM
         ========================================================================= */}
      {activeTab === 'record' && (
        <div className="fintech-card">
          <div className="card-title-bar">
            <div>
              <h3>
                <CreditCard size={20} className="text-primary" />
                <span>Record Manual Payment</span>
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                Collect customer installments or mark orders fully settled (Cash, UPI, Card)
              </p>
            </div>
          </div>

          <form onSubmit={handlePreSubmit}>
            <div className="record-payment-layout">
              {/* Left Column: Order Selection & Snapshot */}
              <div className="order-selector-panel">
                <div className="form-group">
                  <label>Select Sale Order <span className="required">*</span></label>
                  <select
                    className="fintech-select"
                    value={selectedOrderId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedOrderId(id);
                      const target = orders.find(o => String(o.id) === String(id));
                      if (target) {
                        const rem = Math.max(0, (target.total || 0) - (target.paidAmount || 0));
                        setPaymentAmount(rem.toFixed(2));
                      } else {
                        setPaymentAmount('');
                      }
                    }}
                    required
                  >
                    <option value="">-- Choose an order to pay --</option>
                    {orders.map(o => {
                      const rem = Math.max(0, (o.total || 0) - (o.paidAmount || 0));
                      const isPaid = rem <= 0;
                      return (
                        <option key={o.id} value={o.id}>
                          #ORD-{o.id} — {o.customerName || 'Customer'} (Total: ₹{o.total?.toFixed(2)} | Due: ₹{rem.toFixed(2)}) {isPaid ? '✓ PAID' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Selected Order Snapshot Box */}
                {activeOrder ? (
                  <div className="order-snapshot-box">
                    <div className="snapshot-header">
                      <div>
                        <span className="snapshot-order-id">#ORD-{activeOrder.id}</span>
                        <div className="snapshot-customer">{activeOrder.customerName || 'Customer'}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="status-pill-badge" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                          {activeOrder.status || 'ACTIVE'}
                        </span>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                          Date: {activeOrder.date || 'Today'}
                        </div>
                      </div>
                    </div>

                    <div className="snapshot-metrics-row">
                      <div className="snapshot-metric">
                        <span className="snapshot-metric-label">Order Total</span>
                        <span className="snapshot-metric-value">{formatCurrency(orderTotal)}</span>
                      </div>
                      <div className="snapshot-metric">
                        <span className="snapshot-metric-label">Previously Paid</span>
                        <span className="snapshot-metric-value" style={{ color: '#16a34a' }}>
                          {formatCurrency(orderPaid)}
                        </span>
                      </div>
                      <div className="snapshot-metric">
                        <span className="snapshot-metric-label">Remaining Due</span>
                        <span className="snapshot-metric-value" style={{ color: orderRemaining > 0 ? '#d97706' : '#16a34a' }}>
                          {formatCurrency(orderRemaining)}
                        </span>
                      </div>
                    </div>

                    {orderRemaining <= 0 && (
                      <div style={{ background: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={16} />
                        <span>This order is already 100% fully settled! No outstanding balance.</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#94a3b8' }}>
                    <Receipt size={32} style={{ marginBottom: '0.5rem' }} />
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Select an order from the dropdown above to view its live balance and record payment.</p>
                  </div>
                )}
              </div>

              {/* Right Column: Payment Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Payment Amount Input */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>Payment Amount (₹) <span className="required">*</span></label>
                    {activeOrder && orderRemaining > 0 && (
                      <button
                        type="button"
                        className="btn-link"
                        onClick={() => setPaymentAmount(orderRemaining.toFixed(2))}
                      >
                        Pay Full Due (₹{orderRemaining.toFixed(2)})
                      </button>
                    )}
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={orderRemaining}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount to pay"
                    className="fintech-input"
                    disabled={!activeOrder || orderRemaining <= 0}
                    required
                  />

                  {/* Quick percentage helper pills */}
                  {activeOrder && orderRemaining > 0 && (
                    <div className="quick-amount-buttons">
                      <button 
                        type="button" 
                        className="quick-btn"
                        onClick={() => setPaymentAmount(orderRemaining.toFixed(2))}
                      >
                        100% (Full)
                      </button>
                      <button 
                        type="button" 
                        className="quick-btn"
                        onClick={() => setPaymentAmount((orderRemaining * 0.5).toFixed(2))}
                      >
                        50% (Half)
                      </button>
                      <button 
                        type="button" 
                        className="quick-btn"
                        onClick={() => setPaymentAmount((orderRemaining * 0.25).toFixed(2))}
                      >
                        25%
                      </button>
                    </div>
                  )}
                </div>

                {/* Live Dynamic Balance Preview */}
                {activeOrder && parsedAmount > 0 && (
                  <div className="live-calc-box">
                    <div className="live-calc-text">
                      <span className="live-calc-label">Balance After This Payment:</span>
                      <span className="live-calc-sub">
                        {remainingAfterPayment <= 0 ? 'Order will be fully settled!' : 'Remaining customer installment'}
                      </span>
                    </div>
                    <div className="live-calc-amount">
                      {formatCurrency(remainingAfterPayment)}
                    </div>
                  </div>
                )}

                {/* Payment Method Cards */}
                <div className="form-group">
                  <label>Payment Method <span className="required">*</span></label>
                  <div className="method-card-grid">
                    <div 
                      className={`method-select-card ${paymentMethod === 'CASH' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('CASH')}
                    >
                      <div className="method-icon-wrap">
                        <DollarSign size={18} />
                      </div>
                      <span>Cash</span>
                    </div>

                    <div 
                      className={`method-select-card ${paymentMethod === 'UPI' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('UPI')}
                    >
                      <div className="method-icon-wrap">
                        <Smartphone size={18} />
                      </div>
                      <span>UPI / QR</span>
                    </div>

                    <div 
                      className={`method-select-card ${paymentMethod === 'CARD' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('CARD')}
                    >
                      <div className="method-icon-wrap">
                        <CreditCard size={18} />
                      </div>
                      <span>Card (POS)</span>
                    </div>
                  </div>
                </div>

                {/* Payment Date & Reference */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Payment Date</label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="fintech-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Transaction Ref / UTR</label>
                    <input
                      type="text"
                      placeholder="e.g. UTR1289382, POS-99"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      className="fintech-input"
                    />
                  </div>
                </div>

                {/* Remarks */}
                <div className="form-group">
                  <label>Remarks / Notes (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Advance counter payment, cash received by cashier"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="fintech-input"
                  />
                </div>

                {/* Form Action Buttons */}
                <div className="form-submit-row">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => {
                      setSelectedOrderId('');
                      setPaymentAmount('');
                      setTransactionRef('');
                      setRemarks('');
                    }}
                  >
                    Clear Form
                  </button>

                  <button 
                    type="submit" 
                    className="btn-primary-action"
                    disabled={!activeOrder || orderRemaining <= 0 || parsedAmount <= 0 || formSubmitting}
                  >
                    <CheckCircle2 size={16} />
                    <span>{formSubmitting ? 'Recording...' : `Record Payment of ${formatCurrency(parsedAmount)}`}</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB 3: PAYMENT HISTORY & AUDIT LEDGER
         ========================================================================= */}
      {activeTab === 'history' && (
        <div className="fintech-card">
          <div className="card-title-bar">
            <div>
              <h3>
                <Receipt size={20} className="text-primary" />
                <span>Payment Transactions Ledger</span>
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                Complete audit history of received installments, manual settlement records & processed refunds
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="history-filter-bar">
            <div className="filter-left-group">
              {/* Search */}
              <div className="history-search-input">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search Payment ID, Order #, Customer..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                />
              </div>

              {/* Method Filter */}
              <select
                className="filter-select"
                value={filterMethod}
                onChange={(e) => { setFilterMethod(e.target.value); setCurrentPage(1); }}
              >
                <option value="ALL">All Methods</option>
                <option value="CASH">Cash</option>
                <option value="UPI">UPI / QR</option>
                <option value="CARD">Card (POS)</option>
              </select>

              {/* Status Filter */}
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="REFUNDED">Refunded</option>
                <option value="PENDING">Pending</option>
              </select>

              {/* Date Filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <input
                  type="date"
                  className="filter-select"
                  value={filterFromDate}
                  onChange={(e) => { setFilterFromDate(e.target.value); setCurrentPage(1); }}
                  title="From Date"
                />
                <span style={{ color: '#94a3b8' }}>-</span>
                <input
                  type="date"
                  className="filter-select"
                  value={filterToDate}
                  onChange={(e) => { setFilterToDate(e.target.value); setCurrentPage(1); }}
                  title="To Date"
                />
              </div>

              {(searchQuery || filterMethod !== 'ALL' || filterStatus !== 'ALL' || filterFromDate || filterToDate) && (
                <button
                  className="btn-reset-filters"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterMethod('ALL');
                    setFilterStatus('ALL');
                    setFilterFromDate('');
                    setFilterToDate('');
                    setCurrentPage(1);
                  }}
                >
                  Reset
                </button>
              )}
            </div>

            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Showing {filteredPayments.length} transactions
            </div>
          </div>

          {/* History Data Table */}
          {filteredPayments.length === 0 ? (
            <div className="empty-state-box">
              <Receipt size={40} style={{ color: '#94a3b8' }} />
              <h4>No matching payment records found</h4>
              <p>Try resetting the search keywords or filters to see all recorded transactions.</p>
            </div>
          ) : (
            <div className="fintech-table-container">
              <table className="fintech-data-table">
                <thead>
                  <tr>
                    <th>PAYMENT ID</th>
                    <th>ORDER #</th>
                    <th>CUSTOMER</th>
                    <th>PAYMENT AMOUNT</th>
                    <th>METHOD</th>
                    <th>DATE & TIME</th>
                    <th>STATUS</th>
                    <th>REFERENCE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPayments.map(p => (
                    <tr key={p.id}>
                      <td className="payment-id-tag">#PAY-{p.id}</td>
                      <td>
                        <span className="order-link-tag">#ORD-{p.orderId}</span>
                      </td>
                      <td className="font-semibold text-dark">{p.customerName || 'Customer'}</td>
                      <td className="amount-text">{formatCurrency(p.amount)}</td>
                      <td>{getMethodBadge(p.paymentMethod)}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 500 }}>
                            {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '-'}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            {p.paymentDate ? new Date(p.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                      </td>
                      <td>{getStatusBadge(p.paymentStatus)}</td>
                      <td className="text-muted" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {p.transactionReference || '—'}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className="icon-action-btn"
                            title="View Payment Details"
                            onClick={() => { setSelectedPayment(p); setIsDetailsOpen(true); }}
                          >
                            <Eye size={15} />
                          </button>

                          {p.paymentStatus === 'COMPLETED' && (
                            <button
                              className="icon-action-btn refund-btn"
                              title="Process Refund"
                              onClick={() => setRefundTargetPayment(p)}
                            >
                              <RotateCcw size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="table-pagination-bar">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="pagination-buttons">
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODAL: PAYMENT DETAILS DRAWER / MODAL
         ========================================================================= */}
      {isDetailsOpen && selectedPayment && (
        <div className="details-drawer-overlay" onClick={() => setIsDetailsOpen(false)}>
          <div className="details-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="details-modal-header">
              <div>
                <h3>Transaction Record #PAY-{selectedPayment.id}</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Recorded on {selectedPayment.paymentDate ? new Date(selectedPayment.paymentDate).toLocaleString() : '-'}
                </span>
              </div>
              <button className="modal-close-icon" onClick={() => setIsDetailsOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="details-modal-body">
              {/* Hero Amount */}
              <div className="detail-amount-hero">
                <div className="hero-label">Payment Amount</div>
                <div className="hero-val">{formatCurrency(selectedPayment.amount)}</div>
                <div style={{ marginTop: '0.5rem' }}>{getStatusBadge(selectedPayment.paymentStatus)}</div>
              </div>

              {/* Grid 1: Payment Info */}
              <div className="detail-grid-sections">
                <div className="detail-cell">
                  <div className="detail-cell-label">Payment Method</div>
                  <div className="detail-cell-val">{getMethodBadge(selectedPayment.paymentMethod)}</div>
                </div>

                <div className="detail-cell">
                  <div className="detail-cell-label">Transaction Ref / UTR</div>
                  <div className="detail-cell-val" style={{ fontFamily: 'monospace' }}>
                    {selectedPayment.transactionReference || 'None provided'}
                  </div>
                </div>
              </div>

              {/* Grid 2: Associated Order Info */}
              <div className="detail-grid-sections">
                <div className="detail-cell">
                  <div className="detail-cell-label">Associated Sale Order</div>
                  <div className="detail-cell-val" style={{ color: '#2563eb' }}>
                    #ORD-{selectedPayment.orderId}
                  </div>
                </div>

                <div className="detail-cell">
                  <div className="detail-cell-label">Customer Name</div>
                  <div className="detail-cell-val">
                    {selectedPayment.customerName || 'Customer'}
                  </div>
                </div>
              </div>

              {/* Grid 3: Order Financial Context */}
              <div className="detail-grid-sections">
                <div className="detail-cell">
                  <div className="detail-cell-label">Order Total Value</div>
                  <div className="detail-cell-val">{formatCurrency(selectedPayment.orderTotal)}</div>
                </div>

                <div className="detail-cell">
                  <div className="detail-cell-label">Remaining Balance on Order</div>
                  <div className="detail-cell-val" style={{ color: '#d97706' }}>
                    {formatCurrency(selectedPayment.remainingBalance)}
                  </div>
                </div>
              </div>

              {/* Remarks */}
              {selectedPayment.remarks && (
                <div className="detail-cell">
                  <div className="detail-cell-label">Remarks & Notes</div>
                  <div className="detail-cell-val" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    {selectedPayment.remarks}
                  </div>
                </div>
              )}

              {/* Action buttons inside details */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button className="btn-secondary" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </button>
                {selectedPayment.paymentStatus === 'COMPLETED' && (
                  <button 
                    className="btn-primary-action" 
                    style={{ background: '#dc2626' }}
                    onClick={() => {
                      setRefundTargetPayment(selectedPayment);
                    }}
                  >
                    <RotateCcw size={15} />
                    <span>Refund Payment</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: RECORD PAYMENT CONFIRMATION DIALOG
         ========================================================================= */}
      {showConfirmModal && activeOrder && (
        <div className="details-drawer-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="confirm-dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-wrap">
              <CreditCard size={28} />
            </div>
            <h4>Confirm Payment Record</h4>
            <p>
              Please verify the payment details before committing this transaction to the ledger:
            </p>

            <div className="confirm-breakdown">
              <div className="confirm-row">
                <span className="text-muted">Sale Order:</span>
                <strong>#ORD-{activeOrder.id}</strong>
              </div>
              <div className="confirm-row">
                <span className="text-muted">Customer:</span>
                <strong>{activeOrder.customerName || 'Customer'}</strong>
              </div>
              <div className="confirm-row">
                <span className="text-muted">Payment Amount:</span>
                <strong style={{ color: '#059669', fontSize: '1.05rem' }}>{formatCurrency(parsedAmount)}</strong>
              </div>
              <div className="confirm-row">
                <span className="text-muted">Payment Method:</span>
                <strong>{paymentMethod}</strong>
              </div>
              <div className="confirm-row">
                <span className="text-muted">Balance After Payment:</span>
                <strong>{formatCurrency(remainingAfterPayment)}</strong>
              </div>
            </div>

            <div className="confirm-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setShowConfirmModal(false)}
              >
                Go Back
              </button>
              <button 
                type="button" 
                className="btn-primary-action"
                onClick={handleConfirmSubmit}
                disabled={formSubmitting}
              >
                <CheckCircle2 size={16} />
                <span>{formSubmitting ? 'Recording...' : 'Confirm & Save'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: REFUND CONFIRMATION & REASON DIALOG
         ========================================================================= */}
      {refundTargetPayment && (
        <div className="details-drawer-overlay" onClick={() => setRefundTargetPayment(null)}>
          <div className="confirm-dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-wrap" style={{ background: '#fee2e2', color: '#dc2626' }}>
              <AlertTriangle size={28} />
            </div>
            <h4>Process Payment Refund</h4>
            <p>
              Are you sure you want to refund <strong>{formatCurrency(refundTargetPayment.amount)}</strong> for Payment #PAY-{refundTargetPayment.id}?
              The order's balance due will be reinstated immediately.
            </p>

            <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
              <label>Reason for Refund (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Customer cancelled order, duplicate charge"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="fintech-input"
              />
            </div>

            <div className="confirm-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setRefundTargetPayment(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-primary-action"
                style={{ background: '#dc2626' }}
                onClick={handleProcessRefund}
                disabled={refundSubmitting}
              >
                <RotateCcw size={16} />
                <span>{refundSubmitting ? 'Processing...' : 'Confirm Refund'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

