import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tab, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import OrderManagement from './OrderManagement';
import SalesAnalytics from './SalesAnalytics';
import MenuManagement from './MenuManagement';
import UserManagement from './UserManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in and is admin
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      alert('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    setUser(parsedUser);
  }, [navigate]);

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="admin-dashboard py-4">
      <Row className="mb-4">
        <Col>
          <h2>
            <i className="bi bi-speedometer2 me-2"></i>
            Admin Dashboard
          </h2>
          <p className="text-muted">
            Welcome back, {user.name}! Manage your canteen operations here.
          </p>
        </Col>
      </Row>

      <Tab.Container defaultActiveKey="orders">
        <Row>
          <Col lg={2} className="mb-3">
            <Card>
              <Card.Body className="p-2">
                <Nav variant="pills" className="flex-column admin-nav">
                  <Nav.Item>
                    <Nav.Link eventKey="orders">
                      <i className="bi bi-receipt me-2"></i>
                      Orders
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="analytics">
                      <i className="bi bi-graph-up me-2"></i>
                      Analytics
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="menu">
                      <i className="bi bi-menu-button-wide me-2"></i>
                      Menu
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="users">
                      <i className="bi bi-people me-2"></i>
                      Users
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={10}>
            <Tab.Content>
              <Tab.Pane eventKey="orders">
                <OrderManagement />
              </Tab.Pane>
              <Tab.Pane eventKey="analytics">
                <SalesAnalytics />
              </Tab.Pane>
              <Tab.Pane eventKey="menu">
                <MenuManagement />
              </Tab.Pane>
              <Tab.Pane eventKey="users">
                <UserManagement />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default AdminDashboard;
