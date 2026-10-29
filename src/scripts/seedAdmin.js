require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const seedAdmin = async () => {
  try {
    await connectDB();
    
    // Make the first user admin if no admin exists
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount > 0) {
      console.log('Admin already exists');
      process.exit(0);
    }
    
    // Check if any users exist - if yes, make the first one admin
    const firstUser = await User.findOne().sort({ createdAt: 1 });
    if (firstUser) {
      firstUser.role = 'admin';
      firstUser.isActive = true;
      await firstUser.save();
      console.log(`First user '${firstUser.username}' has been made admin`);
      process.exit(0);
    }
    
    await User.create({
      fullName: 'System Administrator',
      username: 'admin',
      email: 'admin@epost.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });
    
    console.log('Admin user created successfully');
    console.log('Username: admin');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
