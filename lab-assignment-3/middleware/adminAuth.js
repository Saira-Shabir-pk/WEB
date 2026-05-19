// middleware/adminAuth.js

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

exports.checkAdminAuth = (req, res, next) => {
  if (req.session && req.session.adminAuth) {
    return next();
  }
  res.redirect('/admin/login');
};

exports.loginAdmin = (req, res) => {
  res.render('admin/login', { title: 'Admin Login | Ralph Lauren' });
};

exports.handleAdminLogin = (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    req.session.adminAuth = true;
    console.log('✅ Admin logged in');
    res.redirect('/admin');
  } else {
    res.render('admin/login', {
      title: 'Admin Login | Ralph Lauren',
      error: 'Invalid password'
    });
  }
};

exports.logoutAdmin = (req, res) => {
  req.session.adminAuth = false;
  console.log('✅ Admin logged out');
  res.redirect('/admin/login');
};