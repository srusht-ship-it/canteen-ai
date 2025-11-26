import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function Hero() {
  const navigate = useNavigate();

  const handleOrderNow = () => {
    // Check if user is logged in
    if (authAPI.isAuthenticated()) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleExploreMenu = () => {
    // Scroll to menu section or navigate to menu page
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="badge bg-light text-dark mb-3 px-3 py-2">
              Nature-Inspired Service
            </div>
            <h1 className="display-3 fw-bold mb-4">
              Fresh. Fast. Intelligent.
            </h1>
            <p className="lead text-muted mb-4">
              An AI-powered canteen management system that predicts demand, 
              reduces waste, and gets your meal ready right when you are. Enjoy 
              wholesome choices with earth-friendly efficiency.
            </p>
            <div className="d-flex gap-3">
              <Button 
                variant="success" 
                size="lg" 
                className="px-4 py-2"
                onClick={handleOrderNow}
              >
                🛍️ Order Now
              </Button>
              <Button 
                variant="outline-secondary" 
                size="lg" 
                className="px-4 py-2"
                onClick={handleExploreMenu}
              >
                📋 Explore Menu
              </Button>
            </div>
          </Col>
          <Col lg={6}>
            <div className="hero-image-container text-center">
              <div 
                className="rounded-circle d-inline-block shadow-lg p-4" 
                style={{ 
                  backgroundColor: 'white',
                  width: '100%',
                  maxWidth: '450px',
                  aspectRatio: '1/1'
                }}
              >
                <div 
                  className="rounded-circle overflow-hidden" 
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#e9ecef'
                  }}
                >
                  <div className="text-center p-4">
                    <div style={{ fontSize: '120px' }}>🥗</div>
                    <p className="text-muted mt-2">Fresh & Healthy Bowl</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Hero;
