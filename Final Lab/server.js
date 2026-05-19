require('dotenv').config();   // ← ADD THIS as the very first line
const express  = require('express');
const path     = require('path');
const mongoose = require('mongoose');
const session  = require('express-session');
const methodOverride = require('method-override');  // ✨ ADD THIS

const app = express();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ralph_lauren';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected:', MONGO_URI))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));  // ✨ ADD THIS
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { title: 'Ralph Lauren Pakistan' });
});

const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

const apiRoutes = require('./routes/apiRoutes');   // ← ADD
app.use('/api/v1', apiRoutes); 

// ── Sales dashboard ────────────────────────────────────────────────────────
const salesRoutes = require('./routes/salesRoutes');
app.use('/sales', salesRoutes);

// ── Sales data API (polled by jQuery every 10 s) ───────────────────────────
const salesCtrl = require('./controllers/salesController');
app.get('/api/sales-data', salesCtrl.getSalesData);

app.use((req, res) => {
  res.status(404).render('404', { title: '404 | Ralph Lauren' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running → http://localhost:${PORT}`));

// TEMPORARY - remove after testing
app.get('/make-test-user', async (req, res) => {
  const User = require('./models/User');
  await User.create({ name: 'Test User', email: 'test@example.com', password: '123456', role: 'customer' });
  res.json({ message: 'User created' });
});
