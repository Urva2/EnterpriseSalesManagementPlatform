import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Package, IndianRupee, Hash, Scale } from 'lucide-react';
import api from '../../services/api';
import './Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [itemWeight, setItemWeight] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async (query = '') => {
    try {
      const url = query ? `/products/search?keyword=${query}` : '/products';
      const response = await api.get(url);
      setProducts(response.data.content || []);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleAddClick = () => {
    setEditingProduct(null);
    setName('');
    setItemWeight('');
    setPrice('');
    setStockQuantity('');
    setIsModalOpen(true);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setItemWeight(product.itemWeight);
    setPrice(product.price);
    setStockQuantity(product.stockQuantity);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      setIsLoading(true);
      const payload = {
        name,
        itemWeight,
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity),
        isActive: true
      };

      if (editingProduct) {
        await api.put(`/products/update/${editingProduct.id}`, payload);
      } else {
        await api.post('/products/register', payload);
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      setName('');
      setItemWeight('');
      setPrice('');
      setStockQuantity('');
      fetchProducts(searchQuery);
    } catch (error) {
      console.error("Error saving product", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts(searchQuery);
      } catch (error) {
        console.error("Error deleting product", error);
      }
    }
  };

  const getCalculatedStatus = (stock) => {
    if (stock <= 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'In Stock';
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'In Stock': return <span className="badge badge-success">In Stock</span>;
      case 'Low Stock': return <span className="badge badge-warning">Low Stock</span>;
      case 'Out of Stock': return <span className="badge badge-danger">Out of Stock</span>;
      default: return <span className="badge">Unknown</span>;
    }
  };

  const getMobileStatusColor = (status) => {
    switch(status) {
      case 'In Stock': return 'text-success';
      case 'Low Stock': return 'text-warning';
      case 'Out of Stock': return 'text-danger';
      default: return '';
    }
  };

  return (
    <div className="products-container">
      {/* 1. Page Header Row */}
      <div className="page-header">
        <div className="header-titles">
          <h2>Product Catalog</h2>
          <p>Manage your inventory</p>
        </div>
        <button className="btn-primary" onClick={handleAddClick}>
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      {/* 2. Search Bar */}
      <div className="search-section">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search products by name..." 
            className="search-input" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 3. Product Data Table (Desktop) */}
      <div className="table-container hidden-mobile">
        <table className="data-table">
          <thead>
            <tr>
              <th>PRODUCT NAME</th>
              <th>WEIGHT</th>
              <th>PRICE (₹)</th>
              <th>STOCK</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const status = getCalculatedStatus(product.stockQuantity);
              return (
                <tr key={product.id}>
                  <td className="font-medium text-dark">{product.name}</td>
                  <td className="text-muted">{product.itemWeight}</td>
                  <td>₹{product.price.toFixed(2)}</td>
                  <td>{product.stockQuantity}</td>
                  <td>{getStatusBadge(status)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn" title="Edit" onClick={() => handleEditClick(product)}><Edit2 size={16} /></button>
                      <button className="icon-btn danger" title="Delete" onClick={() => handleDeleteProduct(product.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Product Cards (Mobile) */}
      <div className="mobile-cards-list hidden-desktop">
        {products.map(product => {
          const status = getCalculatedStatus(product.stockQuantity);
          return (
            <div className="mobile-product-card" key={product.id}>
              <div className="card-top-row">
                <span className="card-title">{product.name}</span>
                {getStatusBadge(status)}
              </div>
              <div className="card-weight-price">
                <span className="card-weight">{product.itemWeight}</span>
                <span className="card-price-label">Price</span>
                <span className="card-price-value">₹{product.price.toFixed(2)}</span>
              </div>
              <div className="card-bottom-row">
                <div className={`card-stock-indicator ${getMobileStatusColor(status)}`}>
                  <div className="stock-dot"></div>
                  <span>{product.stockQuantity} in stock</span>
                </div>
                <div className="card-actions">
                  <button className="icon-btn" onClick={() => handleEditClick(product)}><Edit2 size={16} /></button>
                  <button className="icon-btn danger" onClick={() => handleDeleteProduct(product.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 5. Pagination Bar */}
      <div className="pagination-bar">
        <span className="pagination-info">Showing {products.length} products</span>
        <div className="pagination-controls">
          <button className="page-btn disabled">Previous</button>
          <button className="page-btn active">1</button>
          <button className="page-btn disabled">Next</button>
        </div>
      </div>

      {/* 6. Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Product Name</label>
                <div className="input-with-icon">
                  <Package size={18} className="input-icon" />
                  <input type="text" placeholder="Enter product name" value={name} onChange={e => setName(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label>Weight</label>
                <div className="input-with-icon">
                  <Scale size={18} className="input-icon" />
                  <input type="text" placeholder="e.g., 5 kg" value={itemWeight} onChange={e => setItemWeight(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label>Price (₹)</label>
                <div className="input-with-icon">
                  <IndianRupee size={18} className="input-icon" />
                  <input type="number" placeholder="Enter price" value={price} onChange={e => setPrice(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label>Stock Quantity</label>
                <div className="input-with-icon">
                  <Hash size={18} className="input-icon" />
                  <input type="number" placeholder="Enter stock quantity" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveProduct} disabled={isLoading}>
                {isLoading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Save Product')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
