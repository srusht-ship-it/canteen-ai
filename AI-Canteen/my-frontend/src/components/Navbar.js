import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button, Dropdown, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Cart3 } from 'react-bootstrap-icons';
import { authAPI, cartAPI } from '../services/api';
import Cart from './Cart';

function NavigationBar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const authenticated = authAPI.isAuthenticated();
      const currentUser = authAPI.getCurrentUser();
      setIsAuthenticated(authenticated);
      setUser(currentUser);
      
      // Fetch cart count if authenticated
      if (authenticated) {
        fetchCartCount();
      }
    };

    checkAuth();

    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      if (authAPI.isAuthenticated()) {
        fetchCartCount();
      }
    };

    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener('storage', checkAuth);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const fetchCartCount = async () => {
    try {
      const data = await cartAPI.getCart();
      const count = data.data?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartItemCount(count);
    } catch (err) {
      // Silently fail
      setCartItemCount(0);
    }
  };

  const handleCartClose = () => {
    setShowCart(false);
    fetchCartCount(); // Refresh count when cart closes
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  return (
    <Navbar bg="light" expand="lg" className="py-3 shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <span className="text-success">🍃</span> Canteen AI
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="me-3">Home</Nav.Link>
            <Nav.Link href="#menu" className="me-3">Menu</Nav.Link>
            <Nav.Link href="#about" className="me-3">About</Nav.Link>
            <Nav.Link href="#contact" className="me-3">Contact</Nav.Link>
            
            {isAuthenticated ? (
              <>
                {/* Cart Button */}
                <Button
                  variant="outline-primary"
                  className="me-2 position-relative"
                  onClick={() => setShowCart(true)}
                >
                  <Cart3 size={20} />
                  {cartItemCount > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: '0.7rem' }}
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>

                <Dropdown align="end" className="me-2">
                  <Dropdown.Toggle variant="outline-success" id="user-dropdown">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                    </svg>
                    {user?.fullName || 'User'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate('/dashboard')}>
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                        <path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4zM3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.389.389 0 0 0-.029-.518z"/>
                        <path fillRule="evenodd" d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A7.988 7.988 0 0 1 0 10zm8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.358 12 8 12s3.604.532 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3z"/>
                      </svg>
                      Dashboard
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate('/profile')}>
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                      </svg>
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate('/orders')}>
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                      </svg>
                      My Orders
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                        <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                        <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                      </svg>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Button 
                  variant="outline-success" 
                  className="me-2" 
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  variant="success" 
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Cart Sidebar */}
      <Cart show={showCart} handleClose={handleCartClose} />
    </Navbar>
  );
}

export default NavigationBar;
