import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import NavigationBar from '../components/Navbar';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    dietaryPreferences: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Check authentication
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const currentUser = authAPI.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        fullName: currentUser.fullName || '',
        dietaryPreferences: currentUser.dietaryPreferences || []
      });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDietaryPreference = (preference) => {
    setFormData(prev => {
      const preferences = prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter(p => p !== preference)
        : [...prev.dietaryPreferences, preference];
      return { ...prev, dietaryPreferences: preferences };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setUser(response.user);
      
      // Trigger navbar update
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
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
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div 
                    className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: '100px', height: '100px' }}
                  >
                    <svg width="50" height="50" fill="currentColor" className="text-success" viewBox="0 0 16 16">
                      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                    </svg>
                  </div>
                  <h3 className="fw-bold">Edit Profile</h3>
                  <p className="text-muted">Update your account information</p>
                </div>

                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                    {success}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </Form.Group>

                  {/* Email/Phone (Read-only) */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Email/Phone</Form.Label>
                    <Form.Control
                      type="text"
                      value={user.emailOrPhone}
                      disabled
                      readOnly
                    />
                    <Form.Text className="text-muted">
                      Contact support to change your email or phone
                    </Form.Text>
                  </Form.Group>

                  {/* Dietary Preferences */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Dietary Preferences</Form.Label>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      <button
                        type="button"
                        className={`btn ${formData.dietaryPreferences.includes('vegetarian') ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => handleDietaryPreference('vegetarian')}
                      >
                        <span className="me-2">🥬</span>
                        Vegetarian
                      </button>
                      <button
                        type="button"
                        className={`btn ${formData.dietaryPreferences.includes('vegan') ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => handleDietaryPreference('vegan')}
                      >
                        <span className="me-2">🥕</span>
                        Vegan
                      </button>
                      <button
                        type="button"
                        className={`btn ${formData.dietaryPreferences.includes('gluten-free') ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => handleDietaryPreference('gluten-free')}
                      >
                        <span className="me-2">🌾</span>
                        Gluten-free
                      </button>
                      <button
                        type="button"
                        className={`btn ${formData.dietaryPreferences.includes('low-sugar') ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => handleDietaryPreference('low-sugar')}
                      >
                        <span className="me-2">🍬</span>
                        Low-sugar
                      </button>
                    </div>
                  </Form.Group>

                  {/* Buttons */}
                  <div className="d-grid gap-2">
                    <Button 
                      variant="success" 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Save Changes'}
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => navigate('/dashboard')}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Profile;
