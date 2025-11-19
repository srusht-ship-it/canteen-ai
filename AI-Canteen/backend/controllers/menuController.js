const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');

// @desc    Get all menu items with filters
// @route   GET /api/menu
// @access  Public
exports.getMenuItems = async (req, res) => {
  try {
    const {
      category,
      dietaryTags,
      search,
      minPrice,
      maxPrice,
      isAvailable,
      sortBy,
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = {};

    if (category) {
      query.category = category;
    }

    if (dietaryTags) {
      const tagsArray = dietaryTags.split(',');
      query.dietaryTags = { $in: tagsArray };
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'price-asc':
        sort = { price: 1 };
        break;
      case 'price-desc':
        sort = { price: -1 };
        break;
      case 'rating':
        sort = { 'ratings.average': -1 };
        break;
      case 'popular':
        sort = { totalOrders: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      default:
        sort = { displayOrder: 1, createdAt: -1 };
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const menuItems = await MenuItem.find(query)
      .populate('category', 'name icon')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MenuItem.countDocuments(query);

    res.status(200).json({
      success: true,
      count: menuItems.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: menuItems
    });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items',
      error: error.message
    });
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
exports.getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id)
      .populate('category', 'name description icon');

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu item',
      error: error.message
    });
  }
};

// @desc    Get menu items by category
// @route   GET /api/menu/category/:categoryId
// @access  Public
exports.getMenuItemsByCategory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const menuItems = await MenuItem.find({
      category: req.params.categoryId,
      isAvailable: true
    })
      .sort({ displayOrder: 1, 'ratings.average': -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MenuItem.countDocuments({
      category: req.params.categoryId,
      isAvailable: true
    });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: menuItems
    });
  } catch (error) {
    console.error('Get menu items by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items',
      error: error.message
    });
  }
};

// @desc    Get featured/special items
// @route   GET /api/menu/special
// @access  Public
exports.getSpecialItems = async (req, res) => {
  try {
    const specialItems = await MenuItem.find({
      isSpecial: true,
      isAvailable: true
    })
      .populate('category', 'name icon')
      .sort({ 'ratings.average': -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: specialItems.length,
      data: specialItems
    });
  } catch (error) {
    console.error('Get special items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch special items',
      error: error.message
    });
  }
};

// @desc    Get popular items
// @route   GET /api/menu/popular
// @access  Public
exports.getPopularItems = async (req, res) => {
  try {
    const popularItems = await MenuItem.find({
      isAvailable: true
    })
      .populate('category', 'name icon')
      .sort({ totalOrders: -1, 'ratings.average': -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: popularItems.length,
      data: popularItems
    });
  } catch (error) {
    console.error('Get popular items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular items',
      error: error.message
    });
  }
};

// @desc    Create menu item (Admin only)
// @route   POST /api/menu
// @access  Private/Admin
exports.createMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: menuItem
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create menu item',
      error: error.message
    });
  }
};

// @desc    Update menu item (Admin only)
// @route   PUT /api/menu/:id
// @access  Private/Admin
exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update menu item',
      error: error.message
    });
  }
};

// @desc    Delete menu item (Admin only)
// @route   DELETE /api/menu/:id
// @access  Private/Admin
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete menu item',
      error: error.message
    });
  }
};

// @desc    Toggle menu item availability (Admin only)
// @route   PATCH /api/menu/:id/availability
// @access  Private/Admin
exports.toggleAvailability = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    res.status(200).json({
      success: true,
      message: `Menu item ${menuItem.isAvailable ? 'enabled' : 'disabled'}`,
      data: menuItem
    });
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle availability',
      error: error.message
    });
  }
};
