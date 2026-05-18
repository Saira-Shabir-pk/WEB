// seed/seed.js
// Run once: node seed/seed.js
// Make sure your MongoDB is running and MONGO_URI is set (or uses the default below).

const mongoose = require('mongoose');
const Product  = require('../models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ralph_lauren';

const products = [
  // ── Electronics (5) ──────────────────────────────────────
  { name: 'Noise-Cancelling Headphones', price: 12500, category: 'Electronics', rating: 4.7, stock: 30 },
  { name: 'Wireless Earbuds Pro',        price: 6999,  category: 'Electronics', rating: 4.5, stock: 50 },
  { name: 'Smart Watch Series X',        price: 32000, category: 'Electronics', rating: 4.8, stock: 20 },
  { name: 'Portable Bluetooth Speaker',  price: 4500,  category: 'Electronics', rating: 4.3, stock: 45 },
  { name: '4K Action Camera',            price: 18000, category: 'Electronics', rating: 4.6, stock: 15 },

  // ── Fashion (5) ──────────────────────────────────────────
  { name: 'Polo Ralph Lauren Oxford Shirt', price: 8500,  category: 'Fashion', rating: 4.9, stock: 60 },
  { name: 'Classic Chino Trousers',         price: 5200,  category: 'Fashion', rating: 4.6, stock: 40 },
  { name: 'Heritage Canvas Sneakers',       price: 9800,  category: 'Fashion', rating: 4.7, stock: 35 },
  { name: 'Merino Wool Crew Sweater',       price: 11500, category: 'Fashion', rating: 4.8, stock: 25 },
  { name: 'Signature Leather Belt',         price: 3200,  category: 'Fashion', rating: 4.5, stock: 55 },

  // ── Home (5) ─────────────────────────────────────────────
  { name: 'Egyptian Cotton Bedsheet Set',  price: 7800,  category: 'Home', rating: 4.7, stock: 30 },
  { name: 'Ceramic Dinner Set (12 pcs)',   price: 5500,  category: 'Home', rating: 4.4, stock: 20 },
  { name: 'Scented Soy Candle Collection', price: 2200,  category: 'Home', rating: 4.6, stock: 70 },
  { name: 'Luxury Throw Blanket',          price: 4100,  category: 'Home', rating: 4.8, stock: 40 },
  { name: 'Decorative Cushion Set (4)',    price: 3600,  category: 'Home', rating: 4.3, stock: 50 },

  // ── Sports (5) ───────────────────────────────────────────
  { name: 'Professional Yoga Mat',          price: 2800,  category: 'Sports', rating: 4.6, stock: 80 },
  { name: 'Adjustable Dumbbell Set (20kg)', price: 9500,  category: 'Sports', rating: 4.7, stock: 25 },
  { name: 'Trail Running Shoes',            price: 12000, category: 'Sports', rating: 4.5, stock: 35 },
  { name: 'Compression Cycling Shorts',     price: 3400,  category: 'Sports', rating: 4.4, stock: 60 },
  { name: 'Smart Jump Rope',                price: 1800,  category: 'Sports', rating: 4.3, stock: 90 },

  // ── Beauty (5) ───────────────────────────────────────────
  { name: 'Vitamin C Brightening Serum',   price: 3200, category: 'Beauty', rating: 4.8, stock: 65 },
  { name: 'Hyaluronic Acid Moisturiser',   price: 2800, category: 'Beauty', rating: 4.7, stock: 55 },
  { name: 'Rose Gold Facial Roller',       price: 1500, category: 'Beauty', rating: 4.5, stock: 80 },
  { name: 'Luxury Perfume — Oud & Musk',  price: 8900, category: 'Beauty', rating: 4.9, stock: 30 },
  { name: 'SPF 50 Sunscreen Gel (100ml)', price: 1200, category: 'Beauty', rating: 4.6, stock: 100 },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB:', MONGO_URI);

    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    const inserted = await Product.insertMany(products);
    console.log(`🌱 Seeded ${inserted.length} products successfully`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected. Done!');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
