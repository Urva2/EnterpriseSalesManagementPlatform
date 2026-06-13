import React, { useState, useEffect } from 'react';
import { Search, Eye, Mail, Phone, Copy, X, TrendingUp, IndianRupee, Package, UserMinus } from 'lucide-react';
import api from '../../services/api';
import './Salespersons.css';

export default function Salespersons() {
  const [salespersons, setSalespersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const colors = ['blue', 'purple', 'emerald', 'amber'];

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const fetchSalespersons = async (query = '') => {
    try {
      const url = query ? `/salesperson/search?keyword=${query}` : '/salesperson';
      const response = await api.get(url);
      const data = (response.data.content || []).map((sp, idx) => ({
        ...sp,
        phone: sp.phoneno,
        status: "Active", // Assuming all returned are active for now
        initials: getInitials(sp.name),
        color: colors[idx % colors.length]
      }));
      setSalespersons(data);
    } catch (error) {
      console.error("Error fetching salespersons:", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSalespersons(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="salespersons-container">
      {/* 1. Page Header */}
      <div className="page-header">
        <div className="header-titles">
          <h2>Salespersons</h2>
          <p>View and manage your sales team</p>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="search-section">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name..." 
            className="search-input" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 3. Data Table (Desktop) */}
      <div className="table-container hidden-mobile">
        <table className="data-table">
          <thead>
            <tr>
              <th>AVATAR</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>PHONE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {salespersons.map(person => (
              <tr key={person.id}>
                <td>
                  <div className={`avatar-circle avatar-${person.color}`}>
                    {person.initials}
                  </div>
                </td>
                <td className="font-medium text-dark">{person.name}</td>
                <td className="text-muted">{person.email}</td>
                <td className="text-muted">{person.phone}</td>
                <td>
                  <span className="badge badge-success">{person.status}</span>
                </td>
                <td>
                  <button className="icon-btn" title="View Details" onClick={() => setSelectedPerson(person)}>
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Mobile Cards */}
      <div className="mobile-cards-list hidden-desktop">
        {salespersons.map(person => (
          <div className="mobile-sp-card" key={person.id} onClick={() => setSelectedPerson(person)}>
            <div className="sp-card-header">
              <div className={`avatar-circle large avatar-${person.color}`}>
                {person.initials}
              </div>
              <span className="badge badge-success">{person.status}</span>
            </div>
            <div className="sp-card-details">
              <span className="sp-name">{person.name}</span>
              <div className="sp-contact">
                <span className="sp-email">{person.email}</span>
                <span className="sp-phone"><Phone size={12} className="inline-icon"/> {person.phone}</span>
              </div>
            </div>
            <div className="sp-card-action">
              <span>Tap to view details</span>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Pagination Bar */}
      <div className="pagination-bar">
        <span className="pagination-info">Showing {salespersons.length} salespersons</span>
        <div className="pagination-controls">
          <button className="page-btn disabled">Previous</button>
          <button className="page-btn active">1</button>
          <button className="page-btn disabled">Next</button>
        </div>
      </div>

      {/* 6. Slide-in Detail Panel */}
      {selectedPerson && (
        <div className="slide-panel-backdrop" onClick={() => setSelectedPerson(null)}>
          <div className="slide-panel" onClick={e => e.stopPropagation()}>
            <div className="slide-panel-header">
              <h3>Salesperson Details</h3>
              <button className="close-btn" onClick={() => setSelectedPerson(null)}><X size={20} /></button>
            </div>
            
            <div className="slide-panel-body">
              <div className="panel-profile">
                <div className={`avatar-circle extra-large avatar-${selectedPerson.color} glow-${selectedPerson.color}`}>
                  {selectedPerson.initials}
                </div>
                <h2>{selectedPerson.name}</h2>
                <span className="badge badge-success">{selectedPerson.status}</span>
              </div>

              <div className="panel-contact-info">
                <div className="contact-item">
                  <Mail size={18} className="contact-icon" />
                  <span>{selectedPerson.email}</span>
                  <button className="icon-btn small ml-auto" title="Copy"><Copy size={14}/></button>
                </div>
                <div className="contact-item">
                  <Phone size={18} className="contact-icon" />
                  <span>{selectedPerson.phone}</span>
                </div>
              </div>

              <div className="panel-stats-section">
                <h4 className="stats-header">PERFORMANCE STATS</h4>
                <div className="stats-list">
                  <div className="stat-row">
                    <div className="stat-label">
                      <Package size={16} /> Total Orders
                    </div>
                    <span className="stat-val font-bold">N/A</span>
                  </div>
                  <div className="stat-row">
                    <div className="stat-label">
                      <IndianRupee size={16} /> Revenue
                    </div>
                    <span className="stat-val text-success font-bold">N/A</span>
                  </div>
                  <div className="stat-row">
                    <div className="stat-label">
                      <TrendingUp size={16} /> Active Orders
                    </div>
                    <span className="stat-val text-blue font-bold">N/A</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="slide-panel-footer">
              <button className="btn-danger-outline">
                <UserMinus size={18} />
                Deactivate Salesperson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
