// seed/seedAdmin.js
// Creates (or updates) an admin account.
// Run once: node seed/seedAdmin.js
//
// By default creates:  admin@ralphlauren.pk / admin123
// Override via env:    ADMIN_EMAIL / ADMIN_PASS

const mongoose = require('mongoose');
const User     = require('../models/User');

const MONGO_URI   = process.env.MONGO_URI   || 'mongodb://127.0.0.1:27017/ralph_lauren';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ralphlauren.pk';
const ADMIN_PASS  = process.env.ADMIN_PASS  || 'admin123';
const ADMIN_NAME  = process.env.ADMIN_NAME  || 'Admin';

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB:', MONGO_URI);

    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      // Ensure role is admin
      existing.role = 'admin';
      existing.password = ADMIN_PASS;   // triggers the pre-save hash
      await existing.save();
      console.log(`🔄 Updated existing user → role set to admin: ${ADMIN_EMAIL}`);
    } else {
      const admin = new User({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASS,
        role: 'admin'
      });
      await admin.save();
      console.log(`🌱 Admin user created: ${ADMIN_EMAIL}`);
    }

    console.log(`\n   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASS}`);
    console.log(`\n⚠️  Change the password in production!\n`);

    await mongoose.disconnect();
    console.log('🔌 Done.');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seedAdmin();
