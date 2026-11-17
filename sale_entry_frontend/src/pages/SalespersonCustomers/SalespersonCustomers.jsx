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
    (c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.phoneno && c.phoneno.includes(searchQuery.trim()))
  );

  const handleRegister = async (e) => {
    e.preventDefault();
    if(!customerName || !address || !phoneNumber) return;

    try {
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
      alert(`Error: ${backendMsg}`);
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
            placeholder="Search customers by name or phone..." 
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
          <p>Add your first customer to start creating sales orders.</p>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            <span>Add Customer</span>
          </button>
        </div>
      ) : (
        <div className="sp-customers-grid">
          {filteredCustomers.map(c => (
            <div key={c.id} className="sp-customer-card">
              <div className="card-top">
                <div className="customer-avatar-small">
                  {c.name ? c.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="customer-main-info">
                  <h4>{c.name}</h4>
                  <div className="customer-phone">
                    <Phone size={13} />
                    <span>{c.phoneno}</span>
                  </div>
                </div>
              </div>
              <div className="customer-address">
                <MapPin size={13} className="pin-icon" />
                <span>{c.address}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Add Customer Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Register Customer</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleRegister}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Customer Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number (10 digits)</label>
                  <input 
                    type="tel" 
                    placeholder="e.g. 9876543210" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea 
                    placeholder="Enter full address" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    rows="3"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
