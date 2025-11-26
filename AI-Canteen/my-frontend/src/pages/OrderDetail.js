import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, ListGroup, ProgressBar } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircleFill, Clock, XCircleFill } from 'react-bootstrap-icons';
import { orderAPI } from '../services/api';
import './OrderDetail.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrder();
    
    // Poll for updates every 30 seconds for active orders
    const interval = setInterval(() => {
      if (order && ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)) {
        fetchOrder();
      }
    }, 30000);

    return () => clearInterval(interval);
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

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setCancelling(true);
      await orderAPI.cancelOrder(orderId);
      fetchOrder();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
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

  const getStatusProgress = (status) => {
    const progress = {
      pending: 20,
      confirmed: 40,
      preparing: 60,
      ready: 80,
      completed: 100,
      cancelled: 0
    };
    return progress[status] || 0;
  };

  const orderStatuses = [
    { key: 'pending', label: 'Order Placed', icon: CheckCircleFill },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircleFill },
    { key: 'preparing', label: 'Preparing', icon: Clock },
    { key: 'ready', label: 'Ready', icon: CheckCircleFill },
    { key: 'completed', label: 'Completed', icon: CheckCircleFill }
  ];

  const getStatusIndex = (status) => {
    return orderStatuses.findIndex(s => s.key === status);
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
        <Button variant="primary" onClick={() => navigate('/orders')}>
          Back to Orders
        </Button>
      </Container>
    );
  }

  const currentStatusIndex = getStatusIndex(order.status);
  const canCancel = ['pending', 'confirmed'].includes(order.status);

  return (
    <Container className="py-5">
      <Button variant="link" className="mb-3 ps-0" onClick={() => navigate('/orders')}>
        ← Back to Orders
      </Button>

      <Row>
        <Col lg={8}>
          {/* Order Status Tracking */}
          <Card className="mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Order Status</h5>
                <Badge bg={getStatusColor(order.status)} className="text-uppercase">
                  {order.status}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              {order.status === 'cancelled' ? (
                <div className="text-center py-4">
                  <XCircleFill className="text-danger mb-3" size={60} />
                  <h5 className="text-danger">Order Cancelled</h5>
                  <p className="text-muted">This order has been cancelled</p>
                </div>
              ) : (
                <>
                  <ProgressBar 
                    now={getStatusProgress(order.status)} 
                    variant={getStatusColor(order.status)}
                    className="mb-4"
                    style={{ height: '8px' }}
                  />

                  <div className="order-timeline">
                    {orderStatuses.map((status, index) => {
                      const StatusIcon = status.icon;
                      const isCompleted = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;

                      return (
                        <div
                          key={status.key}
                          className={`timeline-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                        >
                          <div className="timeline-icon">
                            <StatusIcon
                              size={24}
                              className={isCompleted ? 'text-success' : 'text-muted'}
                            />
                          </div>
                          <div className="timeline-content">
                            <h6 className={isCompleted ? 'text-success' : 'text-muted'}>
                              {status.label}
                            </h6>
                            {isCurrent && (
                              <small className="text-primary">In Progress</small>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </Card.Body>
          </Card>

          {/* Order Items */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Order Items</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {order.items.map((item) => (
                  <ListGroup.Item key={item.menuItem._id} className="px-0">
                    <div className="d-flex gap-3">
                      <img
                        src={item.menuItem.imageUrl || 'https://via.placeholder.com/80'}
                        alt={item.menuItem.name}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6 className="mb-1">{item.menuItem.name}</h6>
                            <small className="text-muted">
                              ₹{item.price} × {item.quantity}
                            </small>
                          </div>
                          <strong>₹{item.totalPrice}</strong>
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Order Summary */}
          <Card className="mb-4 sticky-top" style={{ top: '20px' }}>
            <Card.Header>
              <h5 className="mb-0">Order #{order.orderNumber}</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <small className="text-muted">Placed on</small>
                <div>{new Date(order.createdAt).toLocaleString()}</div>
              </div>

              <div className="mb-3">
                <small className="text-muted">Delivery Type</small>
                <div className="text-capitalize">{order.deliveryType}</div>
              </div>

              {order.tableNumber && (
                <div className="mb-3">
                  <small className="text-muted">Table Number</small>
                  <div>{order.tableNumber}</div>
                </div>
              )}

              {order.deliveryAddress && (
                <div className="mb-3">
                  <small className="text-muted">Delivery Address</small>
                  <div>
                    {order.deliveryAddress.building}, {order.deliveryAddress.room}
                  </div>
                  {order.deliveryAddress.instructions && (
                    <small className="text-muted">{order.deliveryAddress.instructions}</small>
                  )}
                </div>
              )}

              <div className="mb-3">
                <small className="text-muted">Payment Method</small>
                <div className="text-capitalize">{order.paymentMethod}</div>
              </div>

              {order.specialInstructions && (
                <div className="mb-3">
                  <small className="text-muted">Special Instructions</small>
                  <div>{order.specialInstructions}</div>
                </div>
              )}

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>₹{(order.subtotal || 0).toFixed(2)}</span>
              </div>

              {order.deliveryType === 'delivery' && (
                <div className="d-flex justify-content-between mb-2 text-muted small">
                  <span>Delivery Fee</span>
                  <span>₹{(order.deliveryFee || 0).toFixed(2)}</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-2 text-muted small">
                <span>GST</span>
                <span>₹{(order.tax || 0).toFixed(2)}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Total</h5>
                <h4 className="mb-0 text-primary">
                  ₹{(order.total || 0).toFixed(2)}
                </h4>
              </div>

              <div className="d-grid gap-2">
                {canCancel && (
                  <Button
                    variant="danger"
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                  >
                    {cancelling ? 'Cancelling...' : 'Cancel Order'}
                  </Button>
                )}
                <Button variant="outline-primary" onClick={() => navigate('/menu')}>
                  Order Again
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetail;
