// server.js

const express       = require('express');
const path          = require('path');
const mongoose      = require('mongoose');
const session       = require('express-session');
const MongoStore    = require('connect-mongo');
const flash         = require('connect-flash');
const methodOverride = require('method-override');

const app = express();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ralph_lauren';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected:', MONGO_URI))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ── Session (persisted in MongoDB) ───────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'rl-super-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    touchAfter: 24 * 3600   // only update session every 24 h (lazy update)
  }),
  cookie: {
    secure: false,           // set true when behind HTTPS in production
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000   // 7 days
  }
}));

// ── Flash messages ────────────────────────────────────────────────────────
app.use(flash());

// ── Make flash + session user available in every EJS template ────────────
app.use((req, res, next) => {
  res.locals.flashSuccess  = req.flash('success');
  res.locals.flashError    = req.flash('error');
  res.locals.messages      = {
    success: req.flash('success'),
    error:   req.flash('error')
  };
  res.locals.currentUser   = req.session.userId
    ? { id: req.session.userId, name: req.session.userName, role: req.session.userRole }
    : null;
  next();
});

// ── View engine ───────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Body parsing & method override ───────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// ── Routes ────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.render('index', { title: 'Ralph Lauren Pakistan' });
});

const authRoutes    = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes   = require('./routes/adminRoutes');

app.use('/auth',     authRoutes);
app.use('/products', productRoutes);
app.use('/admin',    adminRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', { title: '404 | Ralph Lauren' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running → http://localhost:${PORT}`));
