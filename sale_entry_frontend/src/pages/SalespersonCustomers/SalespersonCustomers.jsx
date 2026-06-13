import React, { useState, useEffect } from 'react';
import { Search, Phone, MapPin, Plus, UserPlus, X, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import './SalespersonCustomers.css';

export default function SalespersonCustomers() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal Form State
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/customers');
      setCustomers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch customers', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRegister = async (e) => {
    e.preventDefault();
    if(!customerName || !address || !phoneNumber) return;

    try {
      // Backend expects 'phoneno' and exactly 10 digits
      const sanitizedPhone = phoneNumber.replace(/\D/g, '').slice(-10);
      
      const payload = {
        name: customerName,
        address: address,
        phoneno: sanitizedPhone
      };
      
      const res = await api.post('/customers/register', payload);
      setCustomers([...customers, res.data]);
      setIsModalOpen(false);
      setCustomerName('');
      setAddress('');
      setPhoneNumber('');
    } catch (err) {
      console.error('Failed to register customer', err);
      let backendMsg = err.response?.data || 'Unknown error occurred.';
      if (typeof backendMsg === 'object') {
        backendMsg = JSON.stringify(backendMsg);
      }
      alert(`[DEBUG] Error: ${backendMsg}\nStatus: ${err.response?.status}\nAxiosMsg: ${err.message}\nHost: ${window.location.hostname}`);
    }
  };

  return (
    <div className="sp-customers-container">
      {/* 1. Page Header */}
      <div className="sp-page-header">
        <div className="sp-header-titles">
          <h2>My Customers</h2>
          <p>Manage your customer base</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          <span>Add Customer</span>
        </button>
      </div>

      {/* 2. Search Bar */}
      <div className="sp-search-section">
        <div className="sp-search-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 3. Empty State OR Grid */}
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading customers...</div>
      ) : customers.length === 0 ? (
        <div className="sp-empty-state">
          <div className="empty-illustration">
            <UserPlus size={48} />
          </div>
          <h3>No customers yet</h3>
          <p>Register your first customer to get started</p>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            Register Customer
          </button>
        </div>
      ) : (
        <div className="sp-customers-grid">
          {filteredCustomers.map(customer => {
            const initials = customer.name.substring(0, 2).toUpperCase();
            const color = ['blue', 'purple', 'emerald', 'amber'][customer.id % 4] || 'blue';
            return (
              <div className="sp-customer-card" key={customer.id}>
                <div className={`sp-customer-avatar gradient-${color}`}>
                  {initials}
                </div>
                <div className="sp-customer-info">
                  <h4>{customer.name}</h4>
                  <div className="sp-customer-detail">
                    <Phone size={14} className="detail-icon" />
                    <span>{customer.phoneno}</span>
                  </div>
                  <div className="sp-customer-detail">
                    <MapPin size={14} className="detail-icon" />
                    <span className="truncate-text">{customer.address}</span>
                  </div>
                </div>
                <div className="sp-customer-chevron hidden-desktop">
                  <ChevronRight size={20} color="#cbd5e1" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Registration Modal */}
      {isModalOpen && (
        <div className="sp-modal-backdrop">
          <div className="sp-modal-container">
            <div className="sp-modal-header">
              <h3>Register New Customer</h3>
              <button className="sp-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleRegister} className="sp-modal-body">
              <div className="sp-form-group">
                <label>Customer Name</label>
                <input 
                  type="text" 
                  placeholder="Enter full name" 
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="sp-form-group">
                <label>Address</label>
                <textarea 
                  rows="3" 
                  placeholder="Enter full address" 
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="sp-form-group">
                <label>Phone Number</label>
                <div className="sp-input-with-icon">
                  <Phone size={16} className="input-icon" />
                  <input 
                    type="tel" 
                    placeholder="10-digit phone number" 
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="sp-modal-footer">
                <button type="button" className="btn-ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-dark">
                  <UserPlus size={18} />
                  Register Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
