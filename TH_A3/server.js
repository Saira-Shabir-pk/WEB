// server.js  ─────────────────────────────────────────────────────────────────
// Ralph Lauren Pakistan — Express + EJS + MongoDB
// ─────────────────────────────────────────────────────────────────────────────

const express  = require('express');
const path     = require('path');
const mongoose = require('mongoose');

const app = express();

// ── 1. MongoDB connection ─────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ralph_lauren';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected:', MONGO_URI))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ── 2. View engine ────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── 3. Static files ──────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── 4. Routes ────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.render('index', { title: 'Ralph Lauren Pakistan' });
});

// Products — dynamic MongoDB route
const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).render('404', { title: '404 | Ralph Lauren' });
});

// ── 5. Start server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running → http://localhost:${PORT}`));
