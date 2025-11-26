import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Login.css'; // Reusing login styles

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    emailOrPhone: '',
    password: '',
    confirmPassword: '',
    role: 'user', // Default role
    dietaryPreferences: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user types
    if (error) setError('');
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

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register(formData);
      setSuccess(response.message || 'Registration successful!');
      
      // Redirect to dashboard after successful registration
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      if (err.errors && err.errors.length > 0) {
        setError(err.errors.map(e => e.msg).join(', '));
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={10} md={8} lg={5} xl={4}>
            <Card className="login-card shadow-lg border-0">
              <Card.Body className="p-4 p-md-5">
                {/* Logo and Brand */}
                <div className="text-center mb-4">
                  <div className="logo-container d-inline-flex align-items-center justify-content-center mb-3">
                    <span className="logo-icon">🍃</span>
                  </div>
                  <h4 className="brand-name fw-bold mb-0">Canteen AI</h4>
                </div>

                {/* Register Header */}
                <div className="text-center mb-4 mb-md-5">
                  <h2 className="fw-bold mb-2 mb-md-3">Create your account</h2>
                  <p className="text-muted mb-0">Fresh, intelligent, and fast service begins here.</p>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                {/* Success Alert */}
                {success && (
                  <Alert variant="success">
                    {success}
                  </Alert>
                )}

                {/* Register Form */}
                <Form onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Full Name</Form.Label>
                    <div className="input-with-icon">
                      <span className="input-icon">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                        </svg>
                      </span>
                      <Form.Control
                        type="text"
                        name="fullName"
                        placeholder="Jane Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="ps-5"
                        required
                      />
                    </div>
                  </Form.Group>

                  {/* Email or Phone */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Email or Phone</Form.Label>
                    <div className="input-with-icon">
                      <span className="input-icon">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                        </svg>
                      </span>
                      <Form.Control
                        type="text"
                        name="emailOrPhone"
                        placeholder="you@example.com or +1 555 000 0000"
                        value={formData.emailOrPhone}
                        onChange={handleChange}
                        className="ps-5"
                        required
                      />
                    </div>
                    <Form.Text className="text-muted small">
                      We may send an OTP for verification.
                    </Form.Text>
                  </Form.Group>

                  {/* Role Selection */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Register As</Form.Label>
                    <div className="input-with-icon">
                      <span className="input-icon">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                        </svg>
                      </span>
                      <Form.Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="ps-5"
                        required
                      >
                        <option value="user">Student/Customer</option>
                        <option value="admin">Admin/Staff</option>
                      </Form.Select>
                    </div>
                    <Form.Text className="text-muted small">
                      Select your role. Admin accounts have management access.
                    </Form.Text>
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <div className="input-with-icon">
                      <span className="input-icon">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                        </svg>
                      </span>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                        className="ps-5"
                        required
                      />
                    </div>
                  </Form.Group>

                  {/* Confirm Password */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Confirm Password</Form.Label>
                    <div className="input-with-icon">
                      <span className="input-icon">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                          <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                        </svg>
                      </span>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="ps-5"
                        required
                      />
                    </div>
                  </Form.Group>

                  {/* Password Requirements Info */}
                  <div className="password-info mb-4">
                    <div className="d-flex align-items-start">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="text-muted mt-1 me-2 flex-shrink-0">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                      </svg>
                      <small className="text-muted">
                        Use 8+ characters with a mix of letters, numbers, and symbols.
                      </small>
                    </div>
                  </div>

                  {/* Dietary Preferences */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Dietary Preferences</Form.Label>
                    <div className="dietary-preferences">
                      <div className="d-flex flex-wrap gap-2">
                        <button
                          type="button"
                          className={`dietary-btn ${formData.dietaryPreferences.includes('vegetarian') ? 'active' : ''}`}
                          onClick={() => handleDietaryPreference('vegetarian')}
                        >
                          <span className="dietary-icon">🥬</span>
                          Vegetarian
                        </button>
                        <button
                          type="button"
                          className={`dietary-btn ${formData.dietaryPreferences.includes('vegan') ? 'active' : ''}`}
                          onClick={() => handleDietaryPreference('vegan')}
                        >
                          <span className="dietary-icon">🥕</span>
                          Vegan
                        </button>
                        <button
                          type="button"
                          className={`dietary-btn ${formData.dietaryPreferences.includes('gluten-free') ? 'active' : ''}`}
                          onClick={() => handleDietaryPreference('gluten-free')}
                        >
                          <span className="dietary-icon">🌾</span>
                          Gluten-free
                        </button>
                        <button
                          type="button"
                          className={`dietary-btn ${formData.dietaryPreferences.includes('low-sugar') ? 'active' : ''}`}
                          onClick={() => handleDietaryPreference('low-sugar')}
                        >
                          <span className="dietary-icon">🍬</span>
                          Low-sugar
                        </button>
                      </div>
                    </div>
                  </Form.Group>

                  {/* Sign Up Button */}
                  <Button 
                    variant="success" 
                    type="submit" 
                    className="w-100 py-3 mb-3 fw-semibold sign-in-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                          <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                        </svg>
                        Sign Up
                      </>
                    )}
                  </Button>

                  {/* Terms Notice */}
                  <p className="text-center text-muted small mb-4">
                    By continuing, you agree to receive a one-time OTP for verification.
                  </p>

                  {/* Login Link */}
                  <div className="text-center">
                    <span className="text-muted">Already have an account? </span>
                    <Link to="/login" className="text-decoration-none fw-semibold create-account-link">
                      Sign in
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Register;
