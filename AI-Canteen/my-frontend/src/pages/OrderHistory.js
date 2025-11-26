import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Clock, GeoAlt, CreditCard } from 'react-bootstrap-icons';
import { orderAPI } from '../services/api';
import './OrderHistory.css';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getUserOrders();
      setOrders(response.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
      setOrders([]);
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

  const filteredOrders = statusFilter === 'all'
    ? (orders || [])
    : (orders || []).filter(order => order.status === statusFilter);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Orders</h2>
        <Button variant="primary" onClick={() => navigate('/menu')}>
          Browse Menu
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Filter */}
      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Label>Filter by Status</Form.Label>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <i className="bi bi-receipt" style={{ fontSize: '4rem', color: '#ccc' }}></i>
            <h5 className="mt-3 text-muted">
              {statusFilter === 'all' ? 'No orders yet' : `No ${statusFilter} orders`}
            </h5>
            <p className="text-muted">
              {statusFilter === 'all'
                ? 'Start ordering from our delicious menu!'
                : 'Try changing the filter to see other orders'}
            </p>
            <Button variant="primary" onClick={() => navigate('/menu')}>
              Order Now
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredOrders.map((order) => (
            <Col md={12} key={order._id} className="mb-3">
              <Card className="order-card">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={8}>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="mb-1">Order #{order.orderNumber}</h5>
                          <small className="text-muted">
                            {new Date(order.createdAt).toLocaleDateString()} at{' '}
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </small>
                        </div>
                        <Badge bg={getStatusColor(order.status)} className="text-uppercase">
                          {order.status}
                        </Badge>
                      </div>

                      <div className="order-details mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <Clock className="me-2 text-muted" size={16} />
                          <small className="text-capitalize">{order.deliveryType}</small>
                        </div>

                        {order.deliveryType === 'dine-in' && order.tableNumber && (
                          <div className="d-flex align-items-center mb-2">
                            <GeoAlt className="me-2 text-muted" size={16} />
                            <small>Table {order.tableNumber}</small>
                          </div>
                        )}

                        {order.deliveryType === 'delivery' && order.deliveryAddress && (
                          <div className="d-flex align-items-center mb-2">
                            <GeoAlt className="me-2 text-muted" size={16} />
                            <small>
                              {order.deliveryAddress.building}, {order.deliveryAddress.room}
                            </small>
                          </div>
                        )}

                        <div className="d-flex align-items-center">
                          <CreditCard className="me-2 text-muted" size={16} />
                          <small className="text-capitalize">{order.paymentMethod}</small>
                        </div>
                      </div>

                      <div className="order-items">
                        <small className="text-muted">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          {': '}
                          {order.items.map((item, idx) => (
                            <span key={item.menuItem._id}>
                              {item.menuItem.name} × {item.quantity}
                              {idx < order.items.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </small>
                      </div>
                    </Col>

                    <Col md={4} className="text-md-end mt-3 mt-md-0">
                      <h4 className="text-primary mb-3">₹{(order.total || 0).toFixed(2)}</h4>
                      <div className="d-grid gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/orders/${order._id}`)}
                        >
                          View Details
                        </Button>
                        {(order.status === 'completed' || order.status === 'cancelled') && (
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => navigate('/menu')}
                          >
                            Reorder
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default OrderHistory;
