const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const recommendationRoutes = require('./routes/recommendations');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/admin', adminRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to AI Canteen API' });
});

// MongoDB Connection with retry logic
const connectWithRetry = async (retries = 0) => {
  const maxRetries = 10;
  const retryDelayMs = 5000; // 5 seconds

  try {
    // Connect with minimal options (useNewUrlParser/useUnifiedTopology are deprecated in driver v4+)
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });

    console.log('✅ Connected to MongoDB');

    // Start server once when DB is connected
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`❌ MongoDB connection error (attempt ${retries + 1}):`, error.message || error);

    if (retries < maxRetries) {
      console.log(`Retrying MongoDB connection in ${retryDelayMs / 1000}s... (${retries + 1}/${maxRetries})`);
      setTimeout(() => connectWithRetry(retries + 1), retryDelayMs);
    } else {
      console.error('Exceeded max MongoDB connection retries. Exiting.');
      process.exit(1);
    }
  }
};

// Start connection attempts
connectWithRetry();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

module.exports = app;
