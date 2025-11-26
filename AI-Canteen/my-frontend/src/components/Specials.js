import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function Specials() {
  const navigate = useNavigate();
  const specials = [
    {
      name: 'Harvest Grain Bowl',
      price: '$9.50',
      image: '🥗',
      description: 'Mixed grains, fresh vegetables, and herbs'
    },
    {
      name: 'Garden Fresh Salad',
      price: '$7.20',
      image: '🥬',
      description: 'Crispy lettuce with seasonal vegetables'
    },
    {
      name: 'Mediterranean Wrap',
      price: '$8.40',
      image: '🌯',
      description: 'Grilled vegetables with hummus'
    },
    {
      name: 'Green Glow Smoothie',
      price: '$5.80',
      image: '🥤',
      description: 'Spinach, banana, and tropical fruits'
    }
  ];

  const handleViewAll = () => {
    // Scroll to menu section
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddItem = (special) => {
    // Check if user is logged in
    if (authAPI.isAuthenticated()) {
      alert(`Added "${special.name}" to cart! (Cart feature coming soon)`);
    } else {
      // Redirect to register/login
      if (window.confirm('Please login to add items to cart. Go to login page?')) {
        navigate('/login');
      }
    }
  };

  return (
    <section className="specials-section py-5" id="menu" style={{ backgroundColor: '#f8f9fa' }}>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Today's Specials</h2>
          <Button variant="outline-secondary" onClick={handleViewAll}>
            ☰ View All
          </Button>
        </div>
        <Row className="g-4">
          {specials.map((special, index) => (
            <Col key={index} sm={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm">
                <div 
                  className="d-flex align-items-center justify-content-center" 
                  style={{ 
                    height: '200px', 
                    backgroundColor: '#e9ecef',
                    fontSize: '80px'
                  }}
                >
                  {special.image}
                </div>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0 h6 fw-bold">
                      {special.name}
                    </Card.Title>
                    <span className="text-success fw-bold">
                      {special.price}
                    </span>
                  </div>
                  <Card.Text className="text-muted small mb-3">
                    {special.description}
                  </Card.Text>
                  <Button 
                    variant="success" 
                    className="w-100"
                    onClick={() => handleAddItem(special)}
                  >
                    + Add
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default Specials;
