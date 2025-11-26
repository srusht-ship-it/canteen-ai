import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { cartAPI, orderAPI } from '../services/api';
import OrderAnimation from '../components/OrderAnimation';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(30);
  
  const [formData, setFormData] = useState({
    deliveryType: 'dine-in',
    tableNumber: '',
    deliveryAddress: {
      building: '',
      room: '',
      instructions: ''
    },
    paymentMethod: 'cash',
    specialInstructions: ''
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartAPI.getCart();
      
      if (!data.data || data.data.items.length === 0) {
        navigate('/menu');
        return;
      }
      
      setCart(data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        deliveryAddress: {
          ...formData.deliveryAddress,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.deliveryType === 'dine-in' && !formData.tableNumber) {
      setError('Please enter a table number for dine-in orders');
      return;
    }
    
    if (formData.deliveryType === 'delivery') {
      if (!formData.deliveryAddress.building || !formData.deliveryAddress.room) {
        setError('Please provide complete delivery address');
        return;
      }
    }

    try {
      setSubmitting(true);
      setError('');
      
      const orderData = {
        deliveryType: formData.deliveryType,
        paymentMethod: formData.paymentMethod,
        specialInstructions: formData.specialInstructions
      };

      if (formData.deliveryType === 'dine-in') {
        orderData.tableNumber = formData.tableNumber;
      } else if (formData.deliveryType === 'delivery') {
        orderData.deliveryAddress = formData.deliveryAddress;
      }

      const response = await orderAPI.createOrder(orderData);
      
      // Generate random estimated time (15-60 seconds for demo)
      const randomTime = Math.floor(Math.random() * 46) + 15; // 15-60 seconds
      setEstimatedTime(randomTime);
      
      // Store order details and show animation
      setOrderDetails(response.data);
      setShowAnimation(true);
      setSubmitting(false);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setSubmitting(false);
    }
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    // Clear cart count
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    // Navigate to order confirmation
    navigate(`/order-confirmation/${orderDetails._id}`);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Checkout</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Row>
        <Col lg={7}>
          <Form onSubmit={handleSubmit}>
            {/* Delivery Type */}
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">Delivery Type</h5>
                <Form.Check
                  type="radio"
                  id="dine-in"
                  name="deliveryType"
                  value="dine-in"
                  label="Dine In"
                  checked={formData.deliveryType === 'dine-in'}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  id="takeaway"
                  name="deliveryType"
                  value="takeaway"
                  label="Takeaway"
                  checked={formData.deliveryType === 'takeaway'}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  id="delivery"
                  name="deliveryType"
                  value="delivery"
                  label="Delivery"
                  checked={formData.deliveryType === 'delivery'}
                  onChange={handleInputChange}
                />
              </Card.Body>
            </Card>

            {/* Dine-in Details */}
            {formData.deliveryType === 'dine-in' && (
              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3">Table Details</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Table Number *</Form.Label>
                    <Form.Control
                      type="text"
                      name="tableNumber"
                      value={formData.tableNumber}
                      onChange={handleInputChange}
                      placeholder="Enter table number"
                      required
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            )}

            {/* Delivery Address */}
            {formData.deliveryType === 'delivery' && (
              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3">Delivery Address</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Building/Block *</Form.Label>
                    <Form.Control
                      type="text"
                      name="address.building"
                      value={formData.deliveryAddress.building}
                      onChange={handleInputChange}
                      placeholder="e.g., Academic Block A"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Room/Floor *</Form.Label>
                    <Form.Control
                      type="text"
                      name="address.room"
                      value={formData.deliveryAddress.room}
                      onChange={handleInputChange}
                      placeholder="e.g., Room 204"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Delivery Instructions</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="address.instructions"
                      value={formData.deliveryAddress.instructions}
                      onChange={handleInputChange}
                      placeholder="Any specific instructions for delivery..."
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            )}

            {/* Payment Method */}
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">Payment Method</h5>
                <Form.Check
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  value="cash"
                  label="Cash on Delivery/Pickup"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  id="upi"
                  name="paymentMethod"
                  value="upi"
                  label="UPI Payment"
                  checked={formData.paymentMethod === 'upi'}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  label="Credit/Debit Card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleInputChange}
                />
              </Card.Body>
            </Card>

            {/* Special Instructions */}
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">Special Instructions</h5>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="Any special requests for your order..."
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => navigate('/menu')}
                disabled={submitting}
              >
                Back to Menu
              </Button>
            </div>
          </Form>
        </Col>

        {/* Order Summary */}
        <Col lg={5}>
          <Card className="checkout-summary sticky-top" style={{ top: '20px' }}>
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {cart.items.map((item) => (
                  <ListGroup.Item key={item.menuItem._id} className="px-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{item.menuItem.name}</h6>
                        <small className="text-muted">
                          ₹{item.menuItem.finalPrice} × {item.quantity}
                        </small>
                      </div>
                      <strong>₹{item.totalPrice}</strong>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <strong>₹{(cart.totalPrice || 0).toFixed(2)}</strong>
              </div>

              {formData.deliveryType === 'delivery' && (
                <div className="d-flex justify-content-between mb-2 text-muted">
                  <span>Delivery Fee</span>
                  <span>₹20.00</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-2 text-muted">
                <span>GST (5%)</span>
                <span>₹{((cart.totalPrice || 0) * 0.05).toFixed(2)}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Total</h5>
                <h4 className="mb-0 text-primary">
                  ₹{(
                    (cart.totalPrice || 0) +
                    (formData.deliveryType === 'delivery' ? 20 : 0) +
                    (cart.totalPrice || 0) * 0.05
                  ).toFixed(2)}
                </h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Order Animation Modal */}
      {showAnimation && orderDetails && (
        <OrderAnimation
          show={showAnimation}
          orderNumber={orderDetails.orderNumber}
          estimatedTime={estimatedTime}
          onComplete={handleAnimationComplete}
        />
      )}
    </Container>
  );
};

export default Checkout;
