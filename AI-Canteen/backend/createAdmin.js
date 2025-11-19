/**
 * Script to create an admin user for testing the Admin Dashboard
 * Run this after seeding the database
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists:', existingAdmin.emailOrPhone);
      console.log('Email:', existingAdmin.emailOrPhone);
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = await User.create({
      fullName: 'Admin User',
      emailOrPhone: 'admin@canteen.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('==========================================');
    console.log('📧 Email:', adminUser.emailOrPhone);
    console.log('🔑 Password: admin123');
    console.log('👤 Role:', adminUser.role);
    console.log('==========================================');
    console.log('\n🚀 You can now login with these credentials and access /admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

// Run the function
createAdminUser();
