import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import NavigationBar from '../components/Navbar';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Check if user is authenticated
        if (!authAPI.isAuthenticated()) {
          navigate('/login');
          return;
        }

        // Get user from localStorage first (faster)
        const localUser = authAPI.getCurrentUser();
        if (localUser) {
          setUser(localUser);
        }

        // Fetch fresh data from API
        const response = await authAPI.getMe();
        setUser(response.user);
      } catch (err) {
        console.error('Error loading user:', err);
        setError('Failed to load user data. Please try again.');
        
        // If token is invalid, redirect to login
        if (err.message === 'Not authorized to access this route') {
          authAPI.logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  if (loading) {
    return (
      <>
        <NavigationBar />
        <Container className="mt-5 text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavigationBar />
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold">
              Welcome back, {user?.fullName}! 👋
            </h2>
            <p className="text-muted">Manage your account and preferences</p>
          </Col>
        </Row>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Row className="g-4">
          {/* Profile Card */}
          <Col md={6} lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="text-center mb-3">
                  <div 
                    className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <svg width="40" height="40" fill="currentColor" className="text-success" viewBox="0 0 16 16">
                      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                    </svg>
                  </div>
                </div>
                <Card.Title className="text-center">{user?.fullName}</Card.Title>
                <Card.Text className="text-center text-muted small">
                  {user?.emailOrPhone}
                </Card.Text>
                <Card.Text className="text-center">
                  <span className="badge bg-success">{user?.role}</span>
                </Card.Text>
                <Button 
                  variant="outline-success" 
                  className="w-100"
                  onClick={() => navigate('/profile')}
                >
                  Edit Profile
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Dietary Preferences Card */}
          <Col md={6} lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>
                  <svg width="24" height="24" fill="currentColor" className="me-2 text-success" viewBox="0 0 16 16">
                    <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                    <path d="M16 12.5a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10.5zM2 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2z"/>
                  </svg>
                  Dietary Preferences
                </Card.Title>
                <Card.Text>
                  {user?.dietaryPreferences && user.dietaryPreferences.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {user.dietaryPreferences.map((pref, index) => (
                        <span key={index} className="badge bg-success bg-opacity-25 text-success px-3 py-2">
                          {pref === 'vegetarian' && '🥬 Vegetarian'}
                          {pref === 'vegan' && '🥕 Vegan'}
                          {pref === 'gluten-free' && '🌾 Gluten-free'}
                          {pref === 'low-sugar' && '🍬 Low-sugar'}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted small">No dietary preferences set</p>
                  )}
                </Card.Text>
                <Button 
                  variant="outline-success" 
                  className="w-100 mt-3"
                  onClick={() => navigate('/profile')}
                >
                  Update Preferences
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Quick Actions Card */}
          <Col md={6} lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>
                  <svg width="24" height="24" fill="currentColor" className="me-2 text-success" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                  </svg>
                  Quick Actions
                </Card.Title>
                <div className="d-grid gap-2 mt-3">
                  <Button 
                    variant="success"
                    onClick={() => {
                      navigate('/');
                      setTimeout(() => {
                        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    🍽️ Browse Menu
                  </Button>
                  <Button 
                    variant="outline-success"
                    onClick={() => alert('Orders feature coming soon!')}
                  >
                    📋 View Orders
                  </Button>
                  <Button 
                    variant="outline-success"
                    onClick={() => alert('Favorites feature coming soon!')}
                  >
                    ⭐ My Favorites
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Account Info Card */}
          <Col md={12}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="mb-4">Account Information</Card.Title>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <small className="text-muted">Full Name</small>
                      <p className="fw-semibold">{user?.fullName}</p>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted">Email/Phone</small>
                      <p className="fw-semibold">{user?.emailOrPhone}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <small className="text-muted">Account Type</small>
                      <p className="fw-semibold text-capitalize">{user?.role}</p>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted">Member Since</small>
                      <p className="fw-semibold">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
