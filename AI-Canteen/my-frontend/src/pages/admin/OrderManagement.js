import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button, Alert, Form, Modal, Table } from 'react-bootstrap';
import { adminAPI } from '../../services/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    preparing: 0,
    ready: 0,
    completed: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllOrders();
      const ordersData = response.data || [];
      setOrders(ordersData);
      calculateStats(ordersData);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    const stats = {
      total: ordersData.length,
      pending: ordersData.filter(o => o.status === 'pending').length,
      confirmed: ordersData.filter(o => o.status === 'confirmed').length,
      preparing: ordersData.filter(o => o.status === 'preparing').length,
      ready: ordersData.filter(o => o.status === 'ready').length,
      completed: ordersData.filter(o => o.status === 'completed').length,
      cancelled: ordersData.filter(o => o.status === 'cancelled').length
    };
    setStats(stats);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      fetchOrders();
      setShowModal(false);
      alert(`Order status updated to ${newStatus}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
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

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'completed'
    };
    return statusFlow[currentStatus];
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.status === statusFilter);

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    // Sort by status priority (pending first), then by date
    const statusPriority = { pending: 1, confirmed: 2, preparing: 3, ready: 4, completed: 5, cancelled: 6 };
    if (statusPriority[a.status] !== statusPriority[b.status]) {
      return statusPriority[a.status] - statusPriority[b.status];
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div>
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="stats-card border-start border-primary border-4">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stats-icon bg-primary me-3">
                  <i className="bi bi-receipt"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-0">Total Orders</h6>
                  <h3 className="mb-0">{stats.total}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stats-card border-start border-warning border-4">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stats-icon bg-warning me-3">
                  <i className="bi bi-clock-history"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-0">Pending</h6>
                  <h3 className="mb-0">{stats.pending}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stats-card border-start border-info border-4">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stats-icon bg-info me-3">
                  <i className="bi bi-arrow-clockwise"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-0">In Progress</h6>
                  <h3 className="mb-0">{stats.confirmed + stats.preparing}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stats-card border-start border-success border-4">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stats-icon bg-success me-3">
                  <i className="bi bi-check-circle"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-0">Ready</h6>
                  <h3 className="mb-0">{stats.ready}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Filter */}
      <Card className="mb-4">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <Form.Group className="mb-0" style={{ width: '250px' }}>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Orders ({stats.total})</option>
              <option value="pending">Pending ({stats.pending})</option>
              <option value="confirmed">Confirmed ({stats.confirmed})</option>
              <option value="preparing">Preparing ({stats.preparing})</option>
              <option value="ready">Ready ({stats.ready})</option>
              <option value="completed">Completed ({stats.completed})</option>
              <option value="cancelled">Cancelled ({stats.cancelled})</option>
            </Form.Select>
          </Form.Group>
          <Button variant="outline-primary" size="sm" onClick={fetchOrders}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </Button>
        </Card.Body>
      </Card>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : sortedOrders.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <i className="bi bi-inbox" style={{ fontSize: '4rem', color: '#ccc' }}></i>
            <h5 className="mt-3 text-muted">No orders found</h5>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {sortedOrders.map((order) => (
            <Col md={12} key={order._id} className="mb-3">
              <Card className={`order-card ${order.status === 'pending' ? 'border-warning' : ''}`}>
                <Card.Body>
                  <Row>
                    <Col md={8}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h5 className="mb-1">
                            Order #{order.orderNumber}
                            <Badge bg={getStatusColor(order.status)} className="ms-2 text-uppercase">
                              {order.status}
                            </Badge>
                          </h5>
                          <p className="text-muted mb-1">
                            <i className="bi bi-person me-2"></i>
                            {order.user?.name || 'Unknown User'} ({order.user?.email})
                          </p>
                          <p className="text-muted mb-1">
                            <i className="bi bi-clock me-2"></i>
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                          <p className="text-muted mb-1">
                            <i className="bi bi-geo-alt me-2"></i>
                            <span className="text-capitalize">{order.deliveryType}</span>
                            {order.tableNumber && ` - Table ${order.tableNumber}`}
                          </p>
                        </div>
                      </div>

                      <div className="mb-2">
                        <strong>Items:</strong>
                        <ul className="mb-0 mt-1">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="text-muted">
                              {item.menuItem?.name || item.name} × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <strong>Total: ₹{(order.total || 0).toFixed(2)}</strong>
                        <span className="text-muted ms-3">
                          Payment: <span className="text-capitalize">{order.paymentMethod}</span>
                        </span>
                      </div>
                    </Col>

                    <Col md={4} className="text-end">
                      <div className="order-actions d-flex flex-column gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowModal(true);
                          }}
                        >
                          <i className="bi bi-eye me-2"></i>
                          View Details
                        </Button>

                        {getNextStatus(order.status) && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => updateOrderStatus(order._id, getNextStatus(order.status))}
                          >
                            <i className="bi bi-arrow-right-circle me-2"></i>
                            Mark as {getNextStatus(order.status)}
                          </Button>
                        )}

                        {order.status === 'pending' && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to cancel this order?')) {
                                updateOrderStatus(order._id, 'cancelled');
                              }
                            }}
                          >
                            <i className="bi bi-x-circle me-2"></i>
                            Cancel Order
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

      {/* Order Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details - #{selectedOrder?.orderNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <p><strong>Customer:</strong> {selectedOrder.user?.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                  <p><strong>Phone:</strong> {selectedOrder.user?.phone || 'N/A'}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Status:</strong> <Badge bg={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge></p>
                  <p><strong>Order Time:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p><strong>Delivery Type:</strong> <span className="text-capitalize">{selectedOrder.deliveryType}</span></p>
                </Col>
              </Row>

              <h6>Order Items:</h6>
              <Table bordered size="sm">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-end">Price</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.menuItem?.name || item.name}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end">₹{item.price.toFixed(2)}</td>
                      <td className="text-end">₹{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
                    <td className="text-end">₹{(selectedOrder.subtotal || 0).toFixed(2)}</td>
                  </tr>
                  {selectedOrder.tax > 0 && (
                    <tr>
                      <td colSpan="3" className="text-end">Tax:</td>
                      <td className="text-end">₹{(selectedOrder.tax || 0).toFixed(2)}</td>
                    </tr>
                  )}
                  {selectedOrder.deliveryFee > 0 && (
                    <tr>
                      <td colSpan="3" className="text-end">Delivery Fee:</td>
                      <td className="text-end">₹{(selectedOrder.deliveryFee || 0).toFixed(2)}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                    <td className="text-end"><strong>₹{(selectedOrder.total || 0).toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </Table>

              {selectedOrder.specialInstructions && (
                <div className="mt-3">
                  <strong>Special Instructions:</strong>
                  <p className="text-muted">{selectedOrder.specialInstructions}</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderManagement;
