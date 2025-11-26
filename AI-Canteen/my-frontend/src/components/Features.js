import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function Features() {
  const features = [
    {
      icon: '📊',
      title: 'AI Demand Forecasting',
      description: 'Predicts crowd and ingredients to cut wait times and waste.'
    },
    {
      icon: '⚡',
      title: 'Quick Pickup',
      description: 'Order ahead and grab your meal at the perfect moment.'
    },
    {
      icon: '✨',
      title: 'Personalized Recommendations',
      description: 'Smart suggestions tailored to your taste and habits.'
    }
  ];

  return (
    <section className="features-section py-5">
      <Container>
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col key={index} md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div style={{ fontSize: '48px' }} className="mb-3">
                    {feature.icon}
                  </div>
                  <Card.Title className="fw-bold mb-3">
                    {feature.title}
                  </Card.Title>
                  <Card.Text className="text-muted">
                    {feature.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default Features;
