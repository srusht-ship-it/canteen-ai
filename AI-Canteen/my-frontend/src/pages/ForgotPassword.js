import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: OTP
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        emailOrPhone: formData.emailOrPhone
      });
      
      setSuccess(response.data.message);
      setStep(2);
      
      // Show OTP if in development
      if (response.data.otp) {
        console.log('Development OTP:', response.data.otp);
        alert(`Development Mode - Your OTP is: ${response.data.otp}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        emailOrPhone: formData.emailOrPhone,
        otp: formData.otp,
        newPassword: formData.newPassword
      });
      
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
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

                {/* Header */}
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-2">
                    {step === 1 ? 'Forgot Password?' : 'Reset Password'}
                  </h2>
                  <p className="text-muted">
                    {step === 1 
                      ? 'No worries! Enter your email and we\'ll send you an OTP.' 
                      : 'Enter the OTP sent to your email/phone and your new password.'}
                  </p>
                </div>

                {/* Alerts */}
                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert variant="success">
                    {success}
                  </Alert>
                )}

                {/* Step 1: Request OTP */}
                {step === 1 && (
                  <Form onSubmit={handleRequestOTP}>
                    <Form.Group className="mb-4">
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
                    </Form.Group>

                    <Button 
                      variant="success" 
                      type="submit" 
                      className="w-100 py-3 mb-4 fw-semibold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Sending...
                        </>
                      ) : (
                        'Send OTP'
                      )}
                    </Button>
                  </Form>
                )}

                {/* Step 2: Reset Password with OTP */}
                {step === 2 && (
                  <Form onSubmit={handleResetPassword}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">OTP Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="otp"
                        placeholder="Enter 6-digit OTP"
                        value={formData.otp}
                        onChange={handleChange}
                        maxLength={6}
                        required
                      />
                      <Form.Text className="text-muted">
                        Check your email or phone for the OTP
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        placeholder="Enter new password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        minLength={8}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        minLength={8}
                        required
                      />
                    </Form.Group>

                    <div className="d-grid gap-2 mb-4">
                      <Button 
                        variant="success" 
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Resetting...
                          </>
                        ) : (
                          'Reset Password'
                        )}
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                    </div>
                  </Form>
                )}

                {/* Back to Login */}
                <div className="text-center">
                  <Link to="/login" className="text-decoration-none">
                    <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
                    </svg>
                    Back to Login
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ForgotPassword;
