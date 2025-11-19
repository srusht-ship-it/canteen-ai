const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItem,
  getMenuItemsByCategory,
  getSpecialItems,
  getPopularItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability
} = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getMenuItems);
router.get('/special', getSpecialItems);
router.get('/popular', getPopularItems);
router.get('/category/:categoryId', getMenuItemsByCategory);
router.get('/:id', getMenuItem);

// Admin routes
router.post('/', protect, authorize('admin'), createMenuItem);
router.put('/:id', protect, authorize('admin'), updateMenuItem);
router.delete('/:id', protect, authorize('admin'), deleteMenuItem);
router.patch('/:id/availability', protect, authorize('admin'), toggleAvailability);

module.exports = router;
