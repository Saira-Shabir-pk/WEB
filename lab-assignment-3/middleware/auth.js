// middleware/auth.js

// ── Check if user is logged in ──────────────────────────────────────────
exports.isLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  req.flash('error', 'Please log in to access this page');
  res.redirect('/auth/login');
};

// ── Check if user is admin ──────────────────────────────────────────────
exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  req.flash('error', 'Admin access only');
  res.redirect('/');
};

// ── Check if NOT logged in (for register/login pages) ──────────────────
exports.isNotLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect('/');
  }
  next();
};