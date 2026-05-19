// controllers/authController.js

const User = require('../models/User');

// ── GET /auth/register ────────────────────────────────────────────────────
exports.getRegister = (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('auth/register', {
    title: 'Create Account | Ralph Lauren',
    adminLayout: false
  });
};

// ── POST /auth/register ───────────────────────────────────────────────────
exports.postRegister = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      req.flash('error', 'All fields are required.');
      return res.redirect('/auth/register');
    }

    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters.');
      return res.redirect('/auth/register');
    }

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect('/auth/register');
    }

    // Check for existing email
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      req.flash('error', 'An account with that email already exists.');
      return res.redirect('/auth/register');
    }

    // Create user (password is hashed via pre-save hook)
    const user = new User({ name: name.trim(), email, password });
    await user.save();

    // Auto-login after registration
    req.session.userId   = user._id;
    req.session.userName = user.name;
    req.session.userRole = user.role;

    req.flash('success', `Welcome, ${user.name}! Your account has been created.`);
    res.redirect('/');

  } catch (err) {
    console.error('❌ authController.postRegister error:', err);
    if (err.code === 11000) {
      req.flash('error', 'An account with that email already exists.');
      return res.redirect('/auth/register');
    }
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/register');
  }
};

// ── GET /auth/login ───────────────────────────────────────────────────────
exports.getLogin = (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('auth/login', {
    title: 'Sign In | Ralph Lauren',
    adminLayout: false
  });
};

// ── POST /auth/login ──────────────────────────────────────────────────────
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash('error', 'Email and password are required.');
      return res.redirect('/auth/login');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user || !(await user.comparePassword(password))) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/auth/login');
    }

    // Store user info in session
    req.session.userId   = user._id;
    req.session.userName = user.name;
    req.session.userRole = user.role;

    req.flash('success', `Welcome back, ${user.name}!`);

    // Redirect to originally requested page, or role-appropriate default
    const returnTo = req.session.returnTo || (user.role === 'admin' ? '/admin' : '/');
    delete req.session.returnTo;
    res.redirect(returnTo);

  } catch (err) {
    console.error('❌ authController.postLogin error:', err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/login');
  }
};

// ── GET /auth/logout ──────────────────────────────────────────────────────
exports.logout = (req, res) => {
  const name = req.session.userName || 'User';
  req.session.destroy(err => {
    if (err) console.error('Session destroy error:', err);
    // Flash won't work after session destroy, so pass via query
    res.redirect('/?loggedOut=1&name=' + encodeURIComponent(name));
  });
};
