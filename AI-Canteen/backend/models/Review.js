const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure user can only review an item once per order
reviewSchema.index({ user: 1, menuItem: 1, order: 1 }, { unique: true });

// Update menu item rating after new review
reviewSchema.post('save', async function() {
  const MenuItem = mongoose.model('MenuItem');
  const Review = mongoose.model('Review');
  
  const stats = await Review.aggregate([
    { $match: { menuItem: this.menuItem } },
    {
      $group: {
        _id: '$menuItem',
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  if (stats.length > 0) {
    await MenuItem.findByIdAndUpdate(this.menuItem, {
      'ratings.average': Math.round(stats[0].averageRating * 10) / 10,
      'ratings.count': stats[0].count
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
