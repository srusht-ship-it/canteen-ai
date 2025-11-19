/**
 * Script to upgrade an existing user to admin role
 * Usage: node upgradeToAdmin.js user@email.com
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

const upgradeToAdmin = async (email) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find and update user
    const user = await User.findOneAndUpdate(
      { emailOrPhone: email },
      { $set: { role: 'admin' } },
      { new: true }
    );

    if (!user) {
      console.log('❌ User not found with email:', email);
      process.exit(1);
    }

    console.log('✅ User upgraded to admin successfully!');
    console.log('==========================================');
    console.log('📧 Email:', user.emailOrPhone);
    console.log('👤 Name:', user.fullName);
    console.log('🎖️  Role:', user.role);
    console.log('==========================================');
    console.log('\n🚀 You can now login and access /admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error upgrading user:', error.message);
    process.exit(1);
  }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node upgradeToAdmin.js <email>');
  console.log('Example: node upgradeToAdmin.js john@example.com');
  process.exit(1);
}

// Run the function
upgradeToAdmin(email);
