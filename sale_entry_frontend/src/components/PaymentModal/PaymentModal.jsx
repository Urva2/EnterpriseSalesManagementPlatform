import React, { useState, useEffect } from 'react';
import { X, CreditCard, DollarSign, Smartphone, RotateCcw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import './PaymentModal.css';

export default function PaymentModal({ orderId, isOpen, onClose, onPaymentUpdated }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('record'); // 'record' or 'history'

  // Form State
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [transactionRef, setTransactionRef] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Refund State
  const [refundingId, setRefundingId] = useState(null);
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    if (isOpen && orderId) {
      loadSummary();
      setErrorMessage('');
      setSuccessMessage('');
      setRefundingId(null);
      setRefundReason('');
    }
  }, [isOpen, orderId]);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/payments/orders/${orderId}/summary`);
      setSummary(res.data);
      if (res.data.remainingBalance > 0) {
        setAmount(res.data.remainingBalance.toFixed(2));
        setActiveTab('record');
      } else {
        setAmount('0');
        setActiveTab('history');
      }
    } catch (err) {
      console.error('Failed to load payment summary:', err);
      setErrorMessage(err.response?.data?.message || err.response?.data || 'Failed to load payment summary');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const payAmount = parseFloat(amount);
    if (isNaN(payAmount) || payAmount <= 0) {
      setErrorMessage('Please enter a valid amount greater than 0.');
      return;
    }

    if (summary && payAmount > summary.remainingBalance + 0.01) {
      setErrorMessage(`Payment amount cannot exceed remaining balance (₹${summary.remainingBalance.toFixed(2)}).`);
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/payments/orders/${orderId}`, {
        amount: payAmount,
        paymentMethod,
        transactionReference: transactionRef,
        remarks: remarks
      });
      setSuccessMessage(`Payment of ₹${payAmount.toFixed(2)} recorded successfully!`);
      setTransactionRef('');
      setRemarks('');
      await loadSummary();
      if (onPaymentUpdated) onPaymentUpdated();
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage(err.response?.data?.message || err.response?.data || 'Payment recording failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefund = async (paymentId) => {
    if (!window.confirm('Are you sure you want to refund this payment? The order balance will be adjusted accordingly.')) {
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await api.post(`/payments/${paymentId}/refund?reason=${encodeURIComponent(refundReason || 'Customer requested refund')}`);
      setSuccessMessage('Payment refunded successfully!');
      setRefundingId(null);
      setRefundReason('');
      await loadSummary();
      if (onPaymentUpdated) onPaymentUpdated();
    } catch (err) {
      console.error('Refund error:', err);
      setErrorMessage(err.response?.data?.message || err.response?.data || 'Refund processing failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return <span className="payment-badge badge-paid">PAID</span>;
      case 'PARTIALLY_PAID':
        return <span className="payment-badge badge-partial">PARTIALLY PAID</span>;
      case 'REFUNDED':
        return <span className="payment-badge badge-refunded">REFUNDED</span>;
      default:
        return <span className="payment-badge badge-unpaid">UNPAID</span>;
    }
  };

  return (
    <div className="payment-modal-backdrop" onClick={onClose}>
      <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="payment-modal-header">
          <div className="header-title-box">
            <CreditCard className="header-icon" size={24} />
            <div>
              <h3>Order Payments #{orderId}</h3>
              <p>Record transactions, installments & manage refunds</p>
            </div>
          </div>
          <button className="payment-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="payment-loading">
            <div className="spinner"></div>
            <p>Loading payment information...</p>
          </div>
        ) : (
          <>
            {/* Status & Balance Cards */}
            {summary && (
              <div className="payment-summary-cards">
                <div className="summary-card">
                  <span className="summary-label">Order Total</span>
                  <span className="summary-value">₹{summary.orderTotal.toFixed(2)}</span>
                </div>
                <div className="summary-card">
                  <span className="summary-label">Paid Amount</span>
                  <span className="summary-value text-success">₹{summary.paidAmount.toFixed(2)}</span>
                </div>
                <div className="summary-card">
                  <span className="summary-label">Remaining Balance</span>
                  <span className={`summary-value ${summary.remainingBalance > 0 ? 'text-warning' : 'text-success'}`}>
                    ₹{summary.remainingBalance.toFixed(2)}
                  </span>
                </div>
                <div className="summary-card">
                  <span className="summary-label">Status</span>
                  <div style={{ marginTop: '0.25rem' }}>{getStatusBadge(summary.paymentStatus)}</div>
                </div>
              </div>
            )}

            {/* Notification messages */}
            {errorMessage && (
              <div className="payment-alert alert-error">
                <AlertCircle size={18} />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="payment-alert alert-success">
                <CheckCircle size={18} />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Tabs */}
            <div className="payment-tabs">
              <button
                className={`tab-btn ${activeTab === 'record' ? 'active' : ''}`}
                onClick={() => setActiveTab('record')}
                disabled={summary && summary.remainingBalance <= 0}
              >
                Record Payment {summary && summary.remainingBalance <= 0 && '(Fully Paid)'}
              </button>
              <button
                className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                Transaction History ({summary?.payments?.length || 0})
              </button>
            </div>

            {/* Tab 1: Record Payment */}
            {activeTab === 'record' && summary && summary.remainingBalance > 0 && (
              <form className="payment-form" onSubmit={handleRecordPayment}>
                <div className="form-group">
                  <div className="label-row">
                    <label>Payment Amount (₹)</label>
                    <button
                      type="button"
                      className="btn-link"
                      onClick={() => setAmount(summary.remainingBalance.toFixed(2))}
                    >
                      Pay Full (₹{summary.remainingBalance.toFixed(2)})
                    </button>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={summary.remainingBalance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    placeholder="Enter payment amount"
                    className="payment-input"
                  />
                </div>

                {/* Payment Method Pills */}
                <div className="form-group">
                  <label>Payment Method</label>
                  <div className="method-pill-group">
                    <button
                      type="button"
                      className={`method-pill ${paymentMethod === 'CASH' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('CASH')}
                    >
                      <DollarSign size={16} /> Cash
                    </button>
                    <button
                      type="button"
                      className={`method-pill ${paymentMethod === 'CARD' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('CARD')}
                    >
                      <CreditCard size={16} /> Card
                    </button>
                    <button
                      type="button"
                      className={`method-pill ${paymentMethod === 'UPI' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('UPI')}
                    >
                      <Smartphone size={16} /> UPI / QR
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Transaction Reference / UTR (Optional)</label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g. UPI Ref #, POS Approval code, Receipt #"
                    className="payment-input"
                  />
                </div>

                <div className="form-group">
                  <label>Notes / Remarks (Optional)</label>
                  <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g. Partial advance installment, counter payment"
                    className="payment-input"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={onClose}>
                    Close
                  </button>
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Recording...' : `Confirm Payment of ₹${parseFloat(amount || 0).toFixed(2)}`}
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Transaction History */}
            {activeTab === 'history' && (
              <div className="payment-history-view">
                {!summary?.payments || summary.payments.length === 0 ? (
                  <div className="empty-history">
                    <Clock size={32} className="text-muted" />
                    <p>No payments recorded for this order yet.</p>
                  </div>
                ) : (
                  <div className="history-table-wrapper">
                    <table className="history-table">
                      <thead>
                        <tr>
                          <th>Date & Time</th>
                          <th>Method</th>
                          <th>Amount</th>
                          <th>Ref #</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.payments.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <div className="date-cell">
                                <span>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '-'}</span>
                                <small className="text-muted">
                                  {p.paymentDate ? new Date(p.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </small>
                              </div>
                            </td>
                            <td>
                              <span className="method-tag">
                                {p.paymentMethod === 'CASH' && <DollarSign size={14} />}
                                {p.paymentMethod === 'CARD' && <CreditCard size={14} />}
                                {p.paymentMethod === 'UPI' && <Smartphone size={14} />}
                                {p.paymentMethod}
                              </span>
                            </td>
                            <td className="font-bold text-dark">₹{p.amount.toFixed(2)}</td>
                            <td className="text-muted">{p.transactionReference || '-'}</td>
                            <td>
                              <span className={`status-pill ${p.paymentStatus.toLowerCase()}`}>
                                {p.paymentStatus}
                              </span>
                            </td>
                            <td>
                              {p.paymentStatus === 'COMPLETED' ? (
                                refundingId === p.id ? (
                                  <div className="refund-inline-form">
                                    <input
                                      type="text"
                                      placeholder="Refund reason..."
                                      value={refundReason}
                                      onChange={(e) => setRefundReason(e.target.value)}
                                      className="refund-reason-input"
                                    />
                                    <button
                                      type="button"
                                      className="btn-danger-small"
                                      disabled={submitting}
                                      onClick={() => handleRefund(p.id)}
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      type="button"
                                      className="btn-cancel-small"
                                      onClick={() => setRefundingId(null)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    className="btn-refund"
                                    onClick={() => setRefundingId(p.id)}
                                    title="Process Refund"
                                  >
                                    <RotateCcw size={14} /> Refund
                                  </button>
                                )
                              ) : (
                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                                  Refunded
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

