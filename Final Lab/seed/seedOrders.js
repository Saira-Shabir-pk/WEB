// seed/seedOrders.js
// Run with: node seed/seedOrders.js
// Seeds 10 sample orders using existing products in the DB.

require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('../models/Product');
const Order    = require('../models/Order');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ralph_lauren';

const STATUSES = ['confirmed', 'shipped', 'delivered', 'pending', 'confirmed', 'delivered'];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const products = await Product.find().lean();
  if (products.length === 0) {
    console.error('❌ No products found — run seed/seed.js first');
    process.exit(1);
  }

  // Clear existing seeded orders (optional — comment out to keep real data)
  await Order.deleteMany({});
  console.log('🗑️  Cleared existing orders');

  const orders = [];

  for (let i = 0; i < 15; i++) {
    // Pick 1–3 random products per order
    const numItems = Math.ceil(Math.random() * 3);
    const items = [];
    let totalPrice = 0;

    for (let j = 0; j < numItems; j++) {
      const p        = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.ceil(Math.random() * 4);
      const lineTotal = p.price * quantity;
      totalPrice += lineTotal;
      items.push({
        productId: p._id,
        name:      p.name,
        price:     p.price,
        quantity,
        lineTotal,
      });
    }

    orders.push({
      items,
      totalPrice: Number(totalPrice.toFixed(2)),
      currency:   'PKR',
      status:     STATUSES[Math.floor(Math.random() * STATUSES.length)],
      // spread orders over last 30 days
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    });
  }

  await Order.insertMany(orders);
  console.log(`✅ Seeded ${orders.length} sample orders`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
