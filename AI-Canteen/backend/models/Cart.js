const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  specialInstructions: {
    type: String,
    trim: true,
    maxlength: 200
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  subtotal: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update totals before saving
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.updatedAt = Date.now();
  next();
});

// Method to add item to cart
cartSchema.methods.addItem = function(menuItem, quantity = 1, specialInstructions = '') {
  const existingItemIndex = this.items.findIndex(
    item => item.menuItem.toString() === menuItem._id.toString()
  );

  if (existingItemIndex > -1) {
    // Update quantity if item already exists
    this.items[existingItemIndex].quantity += quantity;
    if (specialInstructions) {
      this.items[existingItemIndex].specialInstructions = specialInstructions;
    }
  } else {
    // Add new item
    this.items.push({
      menuItem: menuItem._id,
      quantity,
      price: menuItem.finalPrice || menuItem.price,
      specialInstructions
    });
  }
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(menuItemId) {
  this.items = this.items.filter(
    item => item.menuItem.toString() !== menuItemId.toString()
  );
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(menuItemId, quantity) {
  const item = this.items.find(
    item => item.menuItem.toString() === menuItemId.toString()
  );
  if (item) {
    item.quantity = quantity;
  }
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
};

module.exports = mongoose.model('Cart', cartSchema);
