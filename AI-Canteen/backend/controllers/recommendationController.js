const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

// @desc    Get personalized recommendations for user
// @route   GET /api/recommendations
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const userPreferences = req.user.dietaryPreferences || [];
    const limit = parseInt(req.query.limit) || 10;

    // Get user's order history
    const userOrders = await Order.find({ user: userId, status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(20);

    // Extract previously ordered items
    const orderedItemIds = [];
    const categoryFrequency = {};
    
    userOrders.forEach(order => {
      order.items.forEach(item => {
        orderedItemIds.push(item.menuItem.toString());
        // Track category frequency (would need to populate to get actual category)
      });
    });

    // Build recommendation query
    const recommendations = [];
    
    // 1. Items matching dietary preferences (40% weight)
    if (userPreferences.length > 0) {
      const dietaryMatches = await MenuItem.find({
        dietaryTags: { $in: userPreferences },
        isAvailable: true,
        _id: { $nin: orderedItemIds.slice(0, 5) } // Exclude last 5 ordered items
      })
        .populate('category', 'name icon')
        .sort({ 'ratings.average': -1, totalOrders: -1 })
        .limit(Math.ceil(limit * 0.4));
      
      recommendations.push(...dietaryMatches.map(item => ({
        ...item.toObject(),
        reason: 'Matches your dietary preferences',
        score: 0.4
      })));
    }

    // 2. Popular items (30% weight)
    const popularItems = await MenuItem.find({
      isAvailable: true,
      _id: { $nin: [...orderedItemIds.slice(0, 5), ...recommendations.map(r => r._id)] }
    })
      .populate('category', 'name icon')
      .sort({ totalOrders: -1, 'ratings.average': -1 })
      .limit(Math.ceil(limit * 0.3));
    
    recommendations.push(...popularItems.map(item => ({
      ...item.toObject(),
      reason: 'Popular among students',
      score: 0.3
    })));

    // 3. Highly rated items (20% weight)
    const topRated = await MenuItem.find({
      isAvailable: true,
      'ratings.count': { $gte: 5 }, // At least 5 ratings
      _id: { $nin: [...orderedItemIds.slice(0, 5), ...recommendations.map(r => r._id)] }
    })
      .populate('category', 'name icon')
      .sort({ 'ratings.average': -1 })
      .limit(Math.ceil(limit * 0.2));
    
    recommendations.push(...topRated.map(item => ({
      ...item.toObject(),
      reason: 'Highly rated',
      score: 0.2
    })));

    // 4. Time-based recommendations (10% weight)
    const currentHour = new Date().getHours();
    let timeBasedCategory;
    
    if (currentHour >= 7 && currentHour < 11) {
      timeBasedCategory = 'Breakfast';
    } else if (currentHour >= 11 && currentHour < 16) {
      timeBasedCategory = 'Lunch';
    } else if (currentHour >= 16 && currentHour < 19) {
      timeBasedCategory = 'Snacks';
    } else {
      timeBasedCategory = 'Dinner';
    }

    const timeBasedItems = await MenuItem.find({
      isAvailable: true,
      _id: { $nin: [...orderedItemIds.slice(0, 5), ...recommendations.map(r => r._id)] }
    })
      .populate({
        path: 'category',
        match: { name: new RegExp(timeBasedCategory, 'i') }
      })
      .sort({ 'ratings.average': -1 })
      .limit(Math.ceil(limit * 0.1));
    
    const filteredTimeBasedItems = timeBasedItems.filter(item => item.category);
    recommendations.push(...filteredTimeBasedItems.map(item => ({
      ...item.toObject(),
      reason: `Perfect for ${timeBasedCategory.toLowerCase()}`,
      score: 0.1
    })));

    // Remove duplicates and limit results
    const uniqueRecommendations = [];
    const seenIds = new Set();
    
    for (const rec of recommendations) {
      if (!seenIds.has(rec._id.toString()) && uniqueRecommendations.length < limit) {
        seenIds.add(rec._id.toString());
        uniqueRecommendations.push(rec);
      }
    }

    // If still need more recommendations, add random items
    if (uniqueRecommendations.length < limit) {
      const remaining = limit - uniqueRecommendations.length;
      const randomItems = await MenuItem.find({
        isAvailable: true,
        _id: { $nin: Array.from(seenIds) }
      })
        .populate('category', 'name icon')
        .limit(remaining);
      
      uniqueRecommendations.push(...randomItems.map(item => ({
        ...item.toObject(),
        reason: 'You might like this',
        score: 0.05
      })));
    }

    res.status(200).json({
      success: true,
      count: uniqueRecommendations.length,
      data: uniqueRecommendations
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations',
      error: error.message
    });
  }
};

// @desc    Get similar items based on a menu item
// @route   GET /api/recommendations/similar/:menuItemId
// @access  Public
exports.getSimilarItems = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const limit = parseInt(req.query.limit) || 5;

    // Get the base item
    const baseItem = await MenuItem.findById(menuItemId);
    if (!baseItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Find similar items
    // Priority: Same category > Similar dietary tags > Similar price range
    const similarItems = await MenuItem.find({
      _id: { $ne: menuItemId },
      isAvailable: true,
      $or: [
        { category: baseItem.category },
        { dietaryTags: { $in: baseItem.dietaryTags } },
        { 
          price: { 
            $gte: baseItem.price * 0.8, 
            $lte: baseItem.price * 1.2 
          } 
        }
      ]
    })
      .populate('category', 'name icon')
      .sort({ 
        'ratings.average': -1, 
        totalOrders: -1 
      })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: similarItems.length,
      data: similarItems
    });
  } catch (error) {
    console.error('Get similar items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch similar items',
      error: error.message
    });
  }
};

// @desc    Get trending items (Admin analytics)
// @route   GET /api/recommendations/trending
// @access  Public
exports.getTrendingItems = async (req, res) => {
  try {
    const { days = 7, limit = 10 } = req.query;
    
    // Calculate date threshold
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - parseInt(days));

    // Aggregate orders from the last N days
    const trendingData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: dateThreshold },
          status: { $in: ['completed', 'ready'] }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menuItem',
          totalOrders: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalOrders: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Populate item details
    const itemIds = trendingData.map(item => item._id);
    const items = await MenuItem.find({ _id: { $in: itemIds } })
      .populate('category', 'name icon');

    // Combine data
    const trendingItems = trendingData.map(trend => {
      const item = items.find(i => i._id.toString() === trend._id.toString());
      return {
        ...item.toObject(),
        trendingStats: {
          totalOrders: trend.totalOrders,
          revenue: trend.revenue
        }
      };
    });

    res.status(200).json({
      success: true,
      count: trendingItems.length,
      period: `Last ${days} days`,
      data: trendingItems
    });
  } catch (error) {
    console.error('Get trending items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending items',
      error: error.message
    });
  }
};
