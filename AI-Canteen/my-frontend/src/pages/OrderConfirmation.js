import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Badge, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircleFill, Clock, GeoAlt, CreditCard } from 'react-bootstrap-icons';
import { orderAPI } from '../services/api';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrder(orderId);
      setOrder(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      preparing: 'primary',
      ready: 'success',
      completed: 'success',
      cancelled: 'danger'
    };
    return colors[status] || 'secondary';
  };

  const getEstimatedTime = (deliveryType) => {
    const times = {
      'dine-in': '15-20 minutes',
      'takeaway': '10-15 minutes',
      'delivery': '25-30 minutes'
    };
    return times[deliveryType] || '15-20 minutes';
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

  if (error || !order) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error || 'Order not found'}
        </Alert>
        <Button variant="primary" onClick={() => navigate('/menu')}>
          Back to Menu
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <CheckCircleFill className="text-success mb-3" size={80} />
        <h2 className="mb-2">Order Placed Successfully!</h2>
        <p className="text-muted">Thank you for your order</p>
      </div>

      <Row className="justify-content-center">
        <Col lg={8}>
          {/* Order Details Card */}
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h5 className="mb-1">Order #{order.orderNumber}</h5>
                  <small className="text-muted">
                    {new Date(order.createdAt).toLocaleString()}
                  </small>
                </div>
                <Badge bg={getStatusColor(order.status)} className="text-uppercase">
                  {order.status}
                </Badge>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center mb-2">
                  <Clock className="me-2 text-muted" />
                  <strong>Estimated Time:</strong>
                  <span className="ms-2">{getEstimatedTime(order.deliveryType)}</span>
                </div>

                {order.deliveryType === 'dine-in' && order.tableNumber && (
                  <div className="d-flex align-items-center mb-2">
                    <GeoAlt className="me-2 text-muted" />
                    <strong>Table Number:</strong>
                    <span className="ms-2">{order.tableNumber}</span>
                  </div>
                )}

                {order.deliveryType === 'delivery' && order.deliveryAddress && (
                  <div className="d-flex align-items-start mb-2">
                    <GeoAlt className="me-2 text-muted mt-1" />
                    <div>
                      <strong>Delivery Address:</strong>
                      <div className="ms-2">
                        {order.deliveryAddress.building}, {order.deliveryAddress.room}
                        {order.deliveryAddress.instructions && (
                          <div className="text-muted small">
                            {order.deliveryAddress.instructions}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="d-flex align-items-center">
                  <CreditCard className="me-2 text-muted" />
                  <strong>Payment Method:</strong>
                  <span className="ms-2 text-capitalize">{order.paymentMethod}</span>
                </div>
              </div>

              {order.specialInstructions && (
                <Alert variant="info" className="mb-0">
                  <strong>Special Instructions:</strong> {order.specialInstructions}
                </Alert>
              )}
            </Card.Body>
          </Card>

          {/* Order Items Card */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Order Items</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {order.items.map((item) => (
                  <ListGroup.Item key={item.menuItem._id} className="px-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex gap-3 flex-grow-1">
                        <img
                          src={item.menuItem.imageUrl || 'https://via.placeholder.com/60'}
                          alt={item.menuItem.name}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                        <div>
                          <h6 className="mb-1">{item.menuItem.name}</h6>
                          <small className="text-muted">
                            ₹{item.price} × {item.quantity}
                          </small>
                        </div>
                      </div>
                      <strong>₹{item.totalPrice}</strong>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>₹{(order.subtotal || 0).toFixed(2)}</span>
              </div>

              {order.deliveryFee > 0 && (
                <div className="d-flex justify-content-between mb-2 text-muted">
                  <span>Delivery Fee</span>
                  <span>₹{(order.deliveryFee || 0).toFixed(2)}</span>
                </div>
              )}

              {order.tax > 0 && (
                <div className="d-flex justify-content-between mb-2 text-muted">
                  <span>Tax/GST</span>
                  <span>₹{(order.tax || 0).toFixed(2)}</span>
                </div>
              )}

              {order.discount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Discount</span>
                  <span>-₹{(order.discount || 0).toFixed(2)}</span>
                </div>
              )}

              <hr />

              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Total Paid</h5>
                <h4 className="mb-0 text-primary">
                  ₹{(order.total || 0).toFixed(2)}
                </h4>
              </div>
            </Card.Body>
          </Card>

          {/* Action Buttons */}
          <div className="d-grid gap-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(`/orders/${order._id}`)}
            >
              Track Order
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/menu')}
            >
              Continue Shopping
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderConfirmation;
