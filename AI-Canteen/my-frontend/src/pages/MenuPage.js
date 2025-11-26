import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/Navbar';
import { menuAPI, categoryAPI, cartAPI, authAPI } from '../services/api';

function MenuPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietaryTags, setSelectedDietaryTags] = useState([]);
  const [sortBy, setSortBy] = useState('default');

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
    'Nut-Free', 'Halal', 'Kosher', 'Keto', 'Low-Carb', 'High-Protein'
  ];

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, [selectedCategory, searchQuery, selectedDietaryTags, sortBy]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchMenuItems = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        sortBy,
        isAvailable: true
      };

      if (selectedCategory && selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (selectedDietaryTags.length > 0) {
        params.dietaryTags = selectedDietaryTags.join(',');
      }

      const response = await menuAPI.getMenuItems(params);
      setMenuItems(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleDietaryTagToggle = (tag) => {
    setSelectedDietaryTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleAddToCart = async (item) => {
    if (!authAPI.isAuthenticated()) {
      const confirmed = window.confirm('Please login to add items to cart. Redirect to login?');
      if (confirmed) {
        navigate('/login');
      }
      return;
    }

    try {
      await cartAPI.addToCart(item._id, 1);
      setSuccess(`${item.name} added to cart!`);
      
      // Dispatch custom event to update cart count in navbar
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item to cart');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleViewDetails = (itemId) => {
    navigate(`/menu/${itemId}`);
  };

  return (
    <>
      <NavigationBar />
      <div className="menu-page py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container>
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="fw-bold">Our Menu</h2>
            <p className="text-muted">Discover delicious meals crafted just for you</p>
          </div>

          {/* Alerts */}
          {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
          {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

          <Row>
            {/* Filters Sidebar */}
            <Col lg={3} className="mb-4">
              <Card className="border-0 shadow-sm mb-3">
                <Card.Body>
                  <h6 className="fw-bold mb-3">Search</h6>
                  <Form.Control
                    type="text"
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Card.Body>
              </Card>

              <Card className="border-0 shadow-sm mb-3">
                <Card.Body>
                  <h6 className="fw-bold mb-3">Categories</h6>
                  <div className="d-grid gap-2">
                    <Button
                      variant={selectedCategory === 'all' ? 'success' : 'outline-secondary'}
                      size="sm"
                      onClick={() => setSelectedCategory('all')}
                    >
                      All Items
                    </Button>
                    {categories.map(category => (
                      <Button
                        key={category._id}
                        variant={selectedCategory === category._id ? 'success' : 'outline-secondary'}
                        size="sm"
                        onClick={() => setSelectedCategory(category._id)}
                      >
                        {category.icon} {category.name}
                      </Button>
                    ))}
                  </div>
                </Card.Body>
              </Card>

              <Card className="border-0 shadow-sm mb-3">
                <Card.Body>
                  <h6 className="fw-bold mb-3">Dietary Preferences</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {dietaryOptions.map(tag => (
                      <Badge
                        key={tag}
                        bg={selectedDietaryTags.includes(tag) ? 'success' : 'secondary'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleDietaryTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card.Body>
              </Card>

              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h6 className="fw-bold mb-3">Sort By</h6>
                  <Form.Select
                    size="sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest</option>
                  </Form.Select>
                </Card.Body>
              </Card>
            </Col>

            {/* Menu Items Grid */}
            <Col lg={9}>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="success" />
                  <p className="mt-3 text-muted">Loading menu...</p>
                </div>
              ) : menuItems.length === 0 ? (
                <div className="text-center py-5">
                  <h4 className="text-muted">No items found</h4>
                  <p>Try adjusting your filters</p>
                </div>
              ) : (
                <>
                  <div className="mb-3 text-muted">
                    Showing {menuItems.length} items
                  </div>
                  <Row>
                    {menuItems.map(item => (
                      <Col key={item._id} md={6} lg={4} className="mb-4">
                        <Card className="h-100 border-0 shadow-sm menu-item-card">
                          <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                            <Card.Img
                              variant="top"
                              src={item.image}
                              alt={item.name}
                              style={{ height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                              }}
                            />
                          </div>
                          <Card.Body className="d-flex flex-column">
                            <div className="mb-2">
                              {item.isSpecial && (
                                <Badge bg="warning" text="dark" className="me-2">Special</Badge>
                              )}
                              {item.dietaryTags?.slice(0, 2).map(tag => (
                                <Badge key={tag} bg="light" text="dark" className="me-1">{tag}</Badge>
                              ))}
                            </div>
                            <Card.Title className="fw-bold">{item.name}</Card.Title>
                            <Card.Text className="text-muted small flex-grow-1">
                              {item.description}
                            </Card.Text>
                            <div className="d-flex align-items-center mb-2">
                              <span className="text-warning me-1">★</span>
                              <span className="small">{item.ratings?.average?.toFixed(1) || '0.0'}</span>
                              <span className="text-muted small ms-1">({item.ratings?.count || 0})</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h5 className="fw-bold text-success mb-0">₹{item.price}</h5>
                                {item.discountPercent > 0 && (
                                  <small className="text-danger">{item.discountPercent}% off</small>
                                )}
                              </div>
                              <div className="d-flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline-success"
                                  onClick={() => handleViewDetails(item._id)}
                                >
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  variant="success"
                                  onClick={() => handleAddToCart(item)}
                                  disabled={!item.isAvailable}
                                >
                                  + Add
                                </Button>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      <style jsx>{`
        .menu-item-card {
          transition: transform 0.2s;
        }
        .menu-item-card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </>
  );
}

export default MenuPage;
