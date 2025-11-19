const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide menu item name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
    min: 0
  },
  image: {
    type: String,
    default: '/images/menu/default.jpg'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide category']
  },
  dietaryTags: [{
    type: String,
    enum: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal', 'Kosher', 'Keto', 'Low-Carb', 'High-Protein']
  }],
  ingredients: [{
    type: String,
    trim: true
  }],
  allergens: [{
    type: String,
    trim: true
  }],
  nutritionInfo: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 }, // in grams
    carbs: { type: Number, default: 0 }, // in grams
    fat: { type: Number, default: 0 }, // in grams
    fiber: { type: Number, default: 0 } // in grams
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  prepTime: {
    type: Number, // in minutes
    default: 10
  },
  isSpecial: {
    type: Boolean,
    default: false
  },
  discountPercent: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  availableQuantity: {
    type: Number,
    default: 100 // For inventory management
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
menuItemSchema.index({ category: 1, isAvailable: 1 });
menuItemSchema.index({ dietaryTags: 1 });
menuItemSchema.index({ 'ratings.average': -1 });
menuItemSchema.index({ totalOrders: -1 });
menuItemSchema.index({ name: 'text', description: 'text' }); // Text search

// Calculate final price after discount
menuItemSchema.virtual('finalPrice').get(function() {
  if (this.discountPercent > 0) {
    return this.price - (this.price * this.discountPercent / 100);
  }
  return this.price;
});

// Update timestamp before saving
menuItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure virtuals are included in JSON
menuItemSchema.set('toJSON', { virtuals: true });
menuItemSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
