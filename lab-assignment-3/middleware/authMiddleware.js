// middleware/authMiddleware.js

/**
 * isLoggedIn — blocks unauthenticated users.
 * Stores the originally requested URL so we can redirect after login.
 */
exports.isLoggedIn = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  req.flash('error', 'Please log in to access that page.');
  req.session.returnTo = req.originalUrl;
  res.redirect('/auth/login');
};

/**
 * isAdmin — blocks non-admin users.
 * Must be used AFTER isLoggedIn (or after the admin session check).
 */
exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.userRole === 'admin') {
    return next();
  }
  // If logged in but not admin → Access Denied
  if (req.session && req.session.userId) {
    req.flash('error', 'Access denied. Admin privileges required.');
    return res.redirect('/');
  }
  // Not logged in at all
  req.flash('error', 'Please log in as an administrator.');
  res.redirect('/auth/login');
};
