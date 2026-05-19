// seed/seedUsers.js
// Run once: node seed/seedUsers.js

const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ralph_lauren_auth';

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'customer'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'customer'
  }
];

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB:', MONGO_URI);

    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    const inserted = await User.insertMany(users);
    console.log(`🌱 Seeded ${inserted.length} users successfully`);

    inserted.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });

    await mongoose.disconnect();
    console.log('🔌 Disconnected. Done!');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seedUsers();