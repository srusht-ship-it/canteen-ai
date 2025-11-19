const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  getSimilarItems,
  getTrendingItems
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/similar/:menuItemId', getSimilarItems);
router.get('/trending', getTrendingItems);

// Protected routes
router.get('/', protect, getRecommendations);

module.exports = router;
