const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllOrders,
  updateOrderStatus,
  getAnalytics,
  getDashboardStats
} = require('../controllers/adminController');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Order management routes
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Analytics routes
router.get('/analytics', getAnalytics);
router.get('/stats', getDashboardStats);

module.exports = router;
