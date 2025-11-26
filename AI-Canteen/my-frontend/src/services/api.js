import axios from 'axios';

// Base URL for API
const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Register new user
const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Login user
const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Get current user
const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user data' };
  }
};

// Update user profile
const updateProfile = async (userData) => {
  try {
    const response = await api.put('/auth/update-profile', userData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if user is logged in
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get current user from localStorage
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Auth API object
export const authAPI = {
  register,
  login,
  getMe,
  updateProfile,
  logout,
  isAuthenticated,
  getCurrentUser
};

// Menu API
export const menuAPI = {
  // Get all menu items with filters
  getMenuItems: async (params = {}) => {
    try {
      const response = await api.get('/menu', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch menu items' };
    }
  },

  // Get single menu item
  getMenuItem: async (id) => {
    try {
      const response = await api.get(`/menu/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch menu item' };
    }
  },

  // Get special items
  getSpecialItems: async () => {
    try {
      const response = await api.get('/menu/special');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch special items' };
    }
  },

  // Get popular items
  getPopularItems: async () => {
    try {
      const response = await api.get('/menu/popular');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch popular items' };
    }
  },

  // Get menu items by category
  getMenuItemsByCategory: async (categoryId, params = {}) => {
    try {
      const response = await api.get(`/menu/category/${categoryId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch menu items' };
    }
  }
};

// Category API
export const categoryAPI = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch categories' };
    }
  },

  // Get single category
  getCategory: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch category' };
    }
  }
};

// Cart API
export const cartAPI = {
  // Get user's cart
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch cart' };
    }
  },

  // Add item to cart
  addToCart: async (menuItemId, quantity = 1, specialInstructions = '') => {
    try {
      const response = await api.post('/cart/items', {
        menuItemId,
        quantity,
        specialInstructions
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add item to cart' };
    }
  },

  // Update cart item quantity
  updateCartItem: async (menuItemId, quantity) => {
    try {
      const response = await api.put(`/cart/items/${menuItemId}`, { quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update cart' };
    }
  },

  // Remove item from cart
  removeFromCart: async (menuItemId) => {
    try {
      const response = await api.delete(`/cart/items/${menuItemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to remove item' };
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to clear cart' };
    }
  }
};

// Order API
export const orderAPI = {
  // Create order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create order' };
    }
  },

  // Get user's orders
  getUserOrders: async (params = {}) => {
    try {
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  },

  // Get single order
  getOrder: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch order' };
    }
  },

  // Cancel order
  cancelOrder: async (id, cancelReason) => {
    try {
      const response = await api.put(`/orders/${id}/cancel`, { cancelReason });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to cancel order' };
    }
  },

  // Rate order
  rateOrder: async (id, rating, comment) => {
    try {
      const response = await api.put(`/orders/${id}/rate`, { rating, comment });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to rate order' };
    }
  }
};

// Recommendation API
export const recommendationAPI = {
  // Get personalized recommendations
  getRecommendations: async (limit = 10) => {
    try {
      const response = await api.get('/recommendations', { params: { limit } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch recommendations' };
    }
  },

  // Get similar items
  getSimilarItems: async (menuItemId, limit = 5) => {
    try {
      const response = await api.get(`/recommendations/similar/${menuItemId}`, { params: { limit } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch similar items' };
    }
  },

  // Get trending items
  getTrendingItems: async (days = 7, limit = 10) => {
    try {
      const response = await api.get('/recommendations/trending', { params: { days, limit } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch trending items' };
    }
  }
};

// Admin API (requires admin role)
export const adminAPI = {
  // Get all orders
  getAllOrders: async () => {
    try {
      const response = await api.get('/admin/orders');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update order status' };
    }
  },

  // Get analytics
  getAnalytics: async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const response = await api.get('/admin/analytics', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch analytics' };
    }
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch stats' };
    }
  }
};

export default api;
