import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Phone, MapPin, Plus, ArrowRight, Check, User, X, ShoppingCart, Minus, Trash2, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import './SalespersonNewOrder.css';

export default function SalespersonNewOrder() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  
  // Step 1 states
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  
  // Universal exit modal state
  const [showExitModal, setShowExitModal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  // Step 2 states
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Step 3 states
  const [orderRemarks, setOrderRemarks] = useState('');
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchProducts(productSearchQuery);
  }, [productSearchQuery]);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    }
  };

  const fetchProducts = async (query) => {
    try {
      const endpoint = query ? `/products/search?keyword=${query}&size=50` : '/products?size=50';
      const res = await api.get(endpoint);
      setProducts(res.data.content || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearchQuery.toLowerCase())
  );

  const handleNextStep = () => {
    if (currentStep === 1 && selectedCustomerId) setCurrentStep(2);
    else if (currentStep === 2 && cartItems.length > 0) {
      setIsMobileCartOpen(false);
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) setCurrentStep(1);
    else if (currentStep === 3) setCurrentStep(2);
  };

  const addToCart = (product) => {
    const existing = cartItems.find(item => item.id === product.id);
    if (existing) {
      setCartItems(cartItems.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(cartItems.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const getCartQuantity = (productId) => {
    const item = cartItems.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  const totalCartValue = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const getOrCreateOrderId = async () => {
    if (orderId) return orderId;
    if (!selectedCustomerId) throw new Error("No customer selected");
    const cartRes = await api.post(`/orders/createCart/${selectedCustomerId}`);
    const newOrderId = cartRes.data.id;
    setOrderId(newOrderId);
    return newOrderId;
  };

  const confirmOrder = async () => {
    if(!selectedCustomerId || cartItems.length === 0) return;
    setIsSubmitting(true);
    try {
      const id = await getOrCreateOrderId();
      
      const payload = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      await api.post(`/orders/${id}/checkout`, payload);
      setIsOrderConfirmed(true);
    } catch (err) {
      console.error('Failed to confirm order:', err);
      alert(err.response?.data || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = async () => {
    if(!selectedCustomerId) {
      alert("Please select a customer first to save a draft.");
      return;
    }
    setIsSubmitting(true);
    try {
      const id = await getOrCreateOrderId();
      
      const payload = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      await api.put(`/orders/${id}/save-draft`, payload);
      navigate('/salesperson/orders');
    } catch (err) {
      console.error('Failed to save draft:', err);
      alert('Failed to save draft. Please try again.');
      setIsSubmitting(false);
    }
  };

  const resetOrder = () => {
    setCurrentStep(1);
    setSelectedCustomerId(null);
    setOrderId(null);
    setCartItems([]);
    setOrderRemarks('');
    setIsOrderConfirmed(false);
  };

  // === RENDERERS ===

  const renderStepIndicator = () => (
    <div className="step-progress-wrapper">
      <div className="step-progress-container">
        {/* Step 1 */}
        <div className={`step-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          <div className="step-circle">
            {currentStep > 1 ? <Check size={18} /> : '1'}
          </div>
          <span className="step-label">Select Customer</span>
        </div>
        <div className={`step-line ${currentStep > 1 ? 'completed' : ''}`}></div>
        
        {/* Step 2 */}
        <div className={`step-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
          <div className="step-circle">
            {currentStep > 2 ? <Check size={18} /> : '2'}
          </div>
          <span className="step-label">Add Products</span>
        </div>
        <div className={`step-line ${currentStep > 2 ? 'completed' : ''}`}></div>
        
        {/* Step 3 */}
        <div className={`step-item ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
          <div className="step-circle">
            {currentStep > 3 ? <Check size={18} /> : '3'}
          </div>
          <span className="step-label">Review Order</span>
        </div>
      </div>
    </div>
  );

  const renderCustomerBanner = () => (
    <div className="selected-customer-banner">
      <div className="sc-info">
        <User size={16} />
        <span>Customer: <strong>{selectedCustomer?.name}</strong> — <Phone size={12} className="inline-icon"/> {selectedCustomer?.phoneno}</span>
      </div>
      <button className="change-customer-link" onClick={() => setCurrentStep(1)}>Change</button>
    </div>
  );

  const renderStep1 = () => (
    <div className="new-order-content-wrapper">
      <div className="new-order-header">
        <h2>Select a Customer</h2>
        <p>Choose a customer for this order</p>
      </div>

      <div className="sp-search-wrapper">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search customers by name..." 
          value={customerSearchQuery}
          onChange={(e) => setCustomerSearchQuery(e.target.value)}
        />
      </div>

      <div className="customer-radio-list">
        {filteredCustomers.map(customer => {
          const isSelected = selectedCustomerId === customer.id;
          return (
            <div 
              key={customer.id} 
              className={`sp-radio-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedCustomerId(customer.id)}
            >
              <div className="radio-circle-container">
                <div className={`custom-radio ${isSelected ? 'filled' : ''}`}>
                  {isSelected && <div className="radio-dot"></div>}
                </div>
              </div>
              <div className={`sp-customer-avatar gradient-${['blue', 'purple', 'emerald', 'amber'][customer.id % 4] || 'blue'}`}>
                {customer.name.substring(0, 2).toUpperCase()}
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
            </div>
          );
        })}
        <button className="btn-ghost-blue register-new-btn">
          <Plus size={18} /> Register New Customer
        </button>
      </div>

      <div className="bottom-action-bar">
        <button className="btn-ghost cancel-btn" onClick={() => setShowExitModal(true)}>Cancel</button>
        <button 
          className={`btn-primary next-btn ${!selectedCustomerId ? 'disabled' : ''}`}
          disabled={!selectedCustomerId}
          onClick={handleNextStep}
        >
          Next: Add Products <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="step2-container">
      <button className="btn-back-step" onClick={() => setCurrentStep(1)}>
        <ArrowLeft size={18} /> Back to Select Customer
      </button>
      {renderCustomerBanner()}

      <div className="products-split-layout">
        {/* LEFT: Products Catalog */}
        <div className="products-catalog-section">
          <div className="catalog-header">
            <h2>Add Products</h2>
            <p>Browse and add items to cart</p>
          </div>
          
          <div className="sp-search-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={productSearchQuery}
              onChange={(e) => setProductSearchQuery(e.target.value)}
            />
          </div>

          <div className="products-grid">
            {products.map(product => {
              const qty = getCartQuantity(product.id);
              const isOutOfStock = product.stockQuantity <= 0;
              const stockStatus = isOutOfStock ? 'out-of-stock' : (product.stockQuantity < 10 ? 'low-stock' : 'in-stock');

              return (
                <div key={product.id} className={`product-card ${isOutOfStock ? 'dimmed' : ''}`}>
                  <div className="product-card-top-row">
                    <h4>{product.name}</h4>
                    <div className="product-price">₹{product.price.toFixed(2)}</div>
                  </div>
                  
                  <div className="product-card-middle-row">
                    <span className="weight-pill">{product.itemWeight}</span>
                  </div>
                  
                  <div className={`stock-indicator ${stockStatus}`}>
                    <div className="stock-dot"></div>
                    {stockStatus === 'in-stock' ? `${product.stockQuantity} in stock` : 
                     stockStatus === 'low-stock' ? `${product.stockQuantity} left` : 'Out of stock'}
                  </div>

                  <button 
                    className={`add-cart-btn ${qty > 0 ? 'added' : ''} ${isOutOfStock ? 'disabled' : ''}`}
                    disabled={isOutOfStock}
                    onClick={() => addToCart(product)}
                  >
                    {isOutOfStock ? 'Out of Stock' : 
                     qty > 0 ? <><Check size={16} /> Added <span className="qty-badge">x{qty}</span></> : 
                     'Add to Cart'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Cart Sidebar (Desktop) */}
        <div className="cart-sidebar-section hidden-mobile">
          <div className="cart-panel-sticky">
            <div className="cart-header">
              <h3>Cart</h3>
              <span className="cart-badge">{totalCartItems} items</span>
            </div>
            
            <div className="cart-items-list">
              {cartItems.length === 0 ? (
                <div className="empty-cart-msg">Your cart is empty.</div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <div className="cart-item-title">{item.name} {item.itemWeight}</div>
                      <div className="cart-item-price">₹{item.price.toFixed(2)} × {item.quantity}</div>
                    </div>
                    <button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <strong>₹{totalCartValue.toFixed(2)}</strong>
              </div>
              <button 
                className="btn-ghost cancel-btn" 
                onClick={() => setShowExitModal(true)}
                style={{ width: '100%', marginBottom: '10px' }}
              >
                Cancel Order
              </button>
              <button 
                className={`btn-primary full-width ${cartItems.length === 0 ? 'disabled' : ''}`}
                disabled={cartItems.length === 0}
                onClick={handleNextStep}
              >
                Review Order <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE: Floating Cart Bar */}
      <div className="mobile-floating-cart hidden-desktop" onClick={() => setIsMobileCartOpen(true)}>
        <div className="floating-cart-left">
          <div className="cart-icon-wrapper">
            <ShoppingCart size={18} />
            <span className="cart-floating-badge">{totalCartItems}</span>
          </div>
          <div className="floating-cart-text">
            <span>Cart</span>
            <strong>₹{totalCartValue.toFixed(2)}</strong>
          </div>
        </div>
        <div className="floating-cart-right">
          View Cart <ArrowRight size={16} />
        </div>
      </div>

      {/* MOBILE: Cart Overlay Modal */}
      {isMobileCartOpen && (
        <div className="mobile-cart-overlay hidden-desktop">
          <div className="cart-overlay-header">
            <h3>Cart ({totalCartItems} items)</h3>
            <button className="close-overlay-btn" onClick={() => setIsMobileCartOpen(false)}>
              <X size={24} />
            </button>
          </div>
          
          <div className="cart-items-list overlay-list">
            {cartItems.length === 0 ? (
              <div className="empty-cart-msg">Your cart is empty.</div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <div className="cart-item-title">{item.name} {item.itemWeight}</div>
                    <div className="cart-item-price">₹{item.price.toFixed(2)} × {item.quantity}</div>
                  </div>
                  <button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>
                    <X size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="cart-overlay-footer">
            <div className="cart-total">
              <span>Total:</span>
              <strong>₹{totalCartValue.toFixed(2)}</strong>
            </div>
            <button 
              className={`btn-primary full-width ${cartItems.length === 0 ? 'disabled' : ''}`}
              disabled={cartItems.length === 0}
              onClick={handleNextStep}
            >
              Review Order <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="step3-container">
      <button className="btn-back-step" onClick={() => setCurrentStep(2)}>
        <ArrowLeft size={18} /> Back to Add Products
      </button>
      {renderCustomerBanner()}

      <div className="review-header">
        <h2>Review Your Order</h2>
        <p>Adjust quantities before confirming</p>
      </div>

      {/* Cart Items List */}
      <div className="review-items-list">
        {cartItems.map(item => (
          <div key={item.id} className="review-item-card">
            
            <div className="review-item-left">
              <h4>{item.name}</h4>
              <span className="review-weight-pill">{item.itemWeight}</span>
              {/* On mobile, price is grouped with left details */}
              <div className="review-mobile-price hidden-desktop">
                ₹{item.price.toFixed(2)} each
              </div>
            </div>

            <div className="review-item-center">
              <div className="quantity-controls">
                <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Minus size={16} />
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="review-item-right">
              <div className="review-price-details">
                <span className="unit-price hidden-mobile">₹{item.price.toFixed(2)} each</span>
                <strong className="subtotal-price">₹{(item.price * item.quantity).toFixed(2)}</strong>
              </div>
              <button className="review-remove-btn" onClick={() => removeFromCart(item.id)}>
                <Trash2 size={18} />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="order-summary-section">
        <div className="summary-card">
          <div className="summary-row">
            <span>Subtotal ({totalCartItems} items)</span>
            <strong>₹{totalCartValue.toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>Discount <a href="#" className="apply-discount-link">Apply Discount</a></span>
            <strong>₹0.00</strong>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row summary-total">
            <span>Order Total</span>
            <strong>₹{totalCartValue.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Order Remarks */}
      <div className="order-remarks-section">
        <label>Order Remarks (Optional)</label>
        <textarea 
          rows="3" 
          placeholder="Add notes or special instructions..."
          value={orderRemarks}
          onChange={(e) => setOrderRemarks(e.target.value)}
        ></textarea>
      </div>

      <div className="bottom-action-bar">
        <button className="btn-ghost cancel-btn" onClick={() => setShowExitModal(true)}>
          <X size={16} style={{marginRight: '0.5rem'}}/> Cancel Order
        </button>
        <button className="btn-ghost-blue cancel-btn" onClick={handlePrevStep}>
          <ArrowLeft size={16} style={{marginRight: '0.5rem'}}/> Back
        </button>
        <button 
          className={`btn-success confirm-btn ${cartItems.length === 0 || isSubmitting ? 'disabled' : ''}`}
          disabled={cartItems.length === 0 || isSubmitting}
          onClick={confirmOrder}
        >
          {isSubmitting ? 'Processing...' : <>Confirm Order <Check size={18} /></>}
        </button>
      </div>
    </div>
  );

  const renderSuccessOverlay = () => {
    if (!isOrderConfirmed) return null;

    return (
      <div className="success-overlay">
        <div className="success-card">
          <div className="success-icon-wrapper">
            <Check size={40} className="success-check" />
            <div className="success-pulse"></div>
          </div>
          
          <h2>Order Confirmed!</h2>
          <p className="success-subtitle">Your order has been placed successfully</p>

          <div className="success-total-box">
            <span>Order Total:</span>
            <strong>₹{totalCartValue.toFixed(2)}</strong>
          </div>

          <div className="success-actions">
            <button className="btn-ghost-blue" onClick={resetOrder}>
              <Plus size={18} style={{marginRight: '0.5rem'}}/> Create Another Order
            </button>
            <button className="btn-dark" onClick={() => navigate('/salesperson/orders')}>
              <ShoppingCart size={18} style={{marginRight: '0.5rem'}}/> View My Orders
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="sp-new-order-container">
      {renderStepIndicator()}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {renderSuccessOverlay()}

      {/* CUSTOM CANCEL MODAL FOR ALL STEPS */}
      {showExitModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-card">
            <div className="modal-icon-danger">
              <X size={24} />
            </div>
            <h3>Unsaved Order</h3>
            <p>You are about to leave the order creation screen. Do you want to save your progress as a draft so you can continue later?</p>
            <div className="custom-modal-actions" style={{ flexDirection: 'column', gap: '10px' }}>
              <button 
                className="btn-primary" 
                onClick={saveDraft}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Yes, Save as Draft'}
              </button>
              <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <button className="custom-modal-btn-cancel" onClick={() => setShowExitModal(false)} style={{ flex: 1 }}>Stay Here</button>
                <button className="custom-modal-btn-danger" onClick={() => navigate('/salesperson/dashboard')} style={{ flex: 1 }}>Leave without saving</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
