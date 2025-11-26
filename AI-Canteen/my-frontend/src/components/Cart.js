import React, { useState, useEffect } from 'react';
import { Offcanvas, ListGroup, Button, Badge, Alert } from 'react-bootstrap';
import { Trash, Plus, Dash, CreditCard } from 'react-bootstrap-icons';
import { cartAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = ({ show, handleClose }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      fetchCart();
    }
  }, [show]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartAPI.getCart();
      setCart(data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    
    try {
      const data = await cartAPI.updateCartItem(itemId, quantity);
      setCart(data.data);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const data = await cartAPI.removeFromCart(itemId);
      setCart(data.data);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await cartAPI.clearCart();
        setCart({ items: [], totalPrice: 0 });
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to clear cart');
      }
    }
  };

  const handleCheckout = () => {
    handleClose();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: '400px' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Shopping Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    );
  }

  const cartItems = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;
  const isEmpty = cartItems.length === 0;

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: '400px' }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          Shopping Cart
          {!isEmpty && (
            <Badge bg="primary" className="ms-2">{cartItems.length}</Badge>
          )}
        </Offcanvas.Title>
      </Offcanvas.Header>
      
      <Offcanvas.Body className="d-flex flex-column">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {isEmpty ? (
          <div className="text-center p-5">
            <i className="bi bi-cart-x" style={{ fontSize: '4rem', color: '#ccc' }}></i>
            <h5 className="mt-3 text-muted">Your cart is empty</h5>
            <p className="text-muted">Add items from the menu to get started!</p>
            <Button variant="primary" onClick={() => { handleClose(); navigate('/menu'); }}>
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-grow-1" style={{ overflowY: 'auto' }}>
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item.menuItem._id} className="cart-item">
                    <div className="d-flex gap-3">
                      <img
                        src={item.menuItem.imageUrl || 'https://via.placeholder.com/60'}
                        alt={item.menuItem.name}
                        className="cart-item-image"
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{item.menuItem.name}</h6>
                        <div className="text-muted small mb-2">
                          ₹{item.menuItem.finalPrice} each
                        </div>
                        
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="btn-group btn-group-sm">
                            <Button
                              variant="outline-secondary"
                              onClick={() => handleUpdateQuantity(item.menuItem._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Dash />
                            </Button>
                            <Button variant="outline-secondary" disabled>
                              {item.quantity}
                            </Button>
                            <Button
                              variant="outline-secondary"
                              onClick={() => handleUpdateQuantity(item.menuItem._id, item.quantity + 1)}
                            >
                              <Plus />
                            </Button>
                          </div>
                          
                          <div className="d-flex align-items-center gap-2">
                            <strong>₹{item.totalPrice}</strong>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-danger p-0"
                              onClick={() => handleRemoveItem(item.menuItem._id)}
                            >
                              <Trash />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>

            <div className="border-top pt-3 mt-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Total</h5>
                <h4 className="mb-0 text-primary">₹{totalPrice.toFixed(2)}</h4>
              </div>

              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleCheckout}
                  className="d-flex align-items-center justify-content-center gap-2"
                >
                  <CreditCard />
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Cart;
