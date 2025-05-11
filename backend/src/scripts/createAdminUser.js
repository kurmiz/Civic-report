const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Admin user details - you can change these
const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',  // This is just for initial setup, change it immediately after first login
  role: 'admin'
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/citizen-report', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB Connected');
  
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);
    
    // Create admin user
    const user = await User.create({
      name: adminUser.name,
      email: adminUser.email,
      password: hashedPassword,
      role: adminUser.role,
      emailVerified: true
    });
    
    console.log(`Admin user created: ${user.email}`);
    console.log('You can now log in to the admin panel with these credentials:');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${adminUser.password}`);
    console.log('IMPORTANT: Change this password immediately after your first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
