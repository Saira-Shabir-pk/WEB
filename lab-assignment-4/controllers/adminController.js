// controllers/adminController.js

const Product = require('../models/Product');

// ── GET /admin/dashboard ──────────────────────────────────────────────────
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
  const VALID_CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Sports', 'Beauty'];
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

    // Validation
    if (!name || !price || !category || rating === '' || stock === '') {
      return res.status(400).render('admin/product-form', {
        title: 'Add New Product | Ralph Lauren',
        product: null,
        validCategories: ['Electronics', 'Fashion', 'Home', 'Sports', 'Beauty'],
        error: 'All fields are required',
        adminLayout: true
      });
    }

    // Image path
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
    console.log('✅ Product created:', newProduct.name);
    res.redirect('/admin');

  } catch (err) {
    console.error('❌ adminController.createProduct error:', err);
    res.status(500).render('404', { title: '500 | Ralph Lauren' });
  }
};

// ── GET /admin/products/edit/:id ──────────────────────────────────────────
exports.getEditProductForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).render('404', { title: '404 | Ralph Lauren' });
    }

    const VALID_CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Sports', 'Beauty'];
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

    // Validation
    if (!name || !price || !category || rating === '' || stock === '') {
      const product = await Product.findById(req.params.id).lean();
      return res.status(400).render('admin/product-form', {
        title: 'Edit Product | Ralph Lauren',
        product,
        validCategories: ['Electronics', 'Fashion', 'Home', 'Sports', 'Beauty'],
        error: 'All fields are required',
        adminLayout: true
      });
    }

    const updateData = {
      name: name.trim(),
      price: parseFloat(price),
      category,
      rating: parseFloat(rating),
      stock: parseInt(stock)
    };

    // Update image only if new file uploaded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    console.log('✅ Product updated:', updatedProduct.name);
    res.redirect('/admin');

  } catch (err) {
    console.error('❌ adminController.updateProduct error:', err);
    res.status(500).render('404', { title: '500 | Ralph Lauren' });
  }
};

// ── DELETE /admin/products/:id ────────────────────────────────────────────
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log('✅ Product deleted:', product.name);
    res.json({ success: true });

  } catch (err) {
    console.error('❌ adminController.deleteProduct error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};