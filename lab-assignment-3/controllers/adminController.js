// controllers/adminController.js
// Auth is now handled by isAdmin middleware in adminRoutes.js.
// Session user is available via res.locals.currentUser (set in server.js).

const Product = require('../models/Product');

const VALID_CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Sports', 'Beauty'];

// ── GET /admin ────────────────────────────────────────────────────────────
exports.getDashboard = async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render('admin/dashboard', {
      title: 'Admin Dashboard | Ralph Lauren',
      products,
      adminLayout: true
    });
  } catch (err) {
    console.error('❌ adminController.getDashboard error:', err);
    res.status(500).render('404', { title: '500 | Ralph Lauren' });
  }
};

// ── GET /admin/products/new ───────────────────────────────────────────────
exports.getNewProductForm = (req, res) => {
  res.render('admin/product-form', {
    title: 'Add New Product | Ralph Lauren',
    product: null,
    validCategories: VALID_CATEGORIES,
    adminLayout: true
  });
};

// ── POST /admin/products ──────────────────────────────────────────────────
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, rating, stock } = req.body;

    if (!name || !price || !category || rating === '' || stock === '') {
      req.flash('error', 'All fields are required.');
      return res.render('admin/product-form', {
        title: 'Add New Product | Ralph Lauren',
        product: null,
        validCategories: VALID_CATEGORIES,
        adminLayout: true
      });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = new Product({
      name: name.trim(),
      price: parseFloat(price),
      category,
      rating: parseFloat(rating),
      stock: parseInt(stock),
      image
    });

    await newProduct.save();
    req.flash('success', `"${newProduct.name}" has been added.`);
    res.redirect('/admin');

  } catch (err) {
    console.error('❌ adminController.createProduct error:', err);
    req.flash('error', 'Server error while creating product.');
    res.redirect('/admin');
  }
};

// ── GET /admin/products/edit/:id ──────────────────────────────────────────
exports.getEditProductForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).render('404', { title: '404 | Ralph Lauren' });

    res.render('admin/product-form', {
      title: 'Edit Product | Ralph Lauren',
      product,
      validCategories: VALID_CATEGORIES,
      adminLayout: true
    });
  } catch (err) {
    console.error('❌ adminController.getEditProductForm error:', err);
    res.status(500).render('404', { title: '500 | Ralph Lauren' });
  }
};

// ── PUT /admin/products/:id ───────────────────────────────────────────────
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, category, rating, stock } = req.body;

    if (!name || !price || !category || rating === '' || stock === '') {
      req.flash('error', 'All fields are required.');
      return res.redirect(`/admin/products/edit/${req.params.id}`);
    }

    const updateData = {
      name: name.trim(),
      price: parseFloat(price),
      category,
      rating: parseFloat(rating),
      stock: parseInt(stock)
    };

    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true, runValidators: true
    });

    req.flash('success', `"${updated.name}" has been updated.`);
    res.redirect('/admin');

  } catch (err) {
    console.error('❌ adminController.updateProduct error:', err);
    req.flash('error', 'Server error while updating product.');
    res.redirect('/admin');
  }
};

// ── DELETE /admin/products/:id ────────────────────────────────────────────
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, name: product.name });
  } catch (err) {
    console.error('❌ adminController.deleteProduct error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
