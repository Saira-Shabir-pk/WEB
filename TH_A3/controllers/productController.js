// controllers/productController.js

const Product = require('../models/Product');

const PRODUCTS_PER_PAGE = 8;
const VALID_CATEGORIES   = ['Electronics', 'Fashion', 'Home', 'Sports', 'Beauty'];
const VALID_SORTS        = ['price_asc', 'price_desc', 'rating_desc'];

// ── GET /products ─────────────────────────────────────────────────────────────
exports.getProducts = async (req, res) => {
  try {
    // ── 1. Read & sanitise query params ──────────────────────────────────────
    const search   = (req.query.search   || '').trim();
    const category = (req.query.category || '').trim();
    const sort     = VALID_SORTS.includes(req.query.sort) ? req.query.sort : '';
    const min      = parseFloat(req.query.min);
    const max      = parseFloat(req.query.max);
    const page     = Math.max(1, parseInt(req.query.page) || 1);

    // ── 2. Build Mongoose filter object ──────────────────────────────────────
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };   // case-insensitive
    }

    if (category && VALID_CATEGORIES.includes(category)) {
      filter.category = category;
    }

    if (!isNaN(min) || !isNaN(max)) {
      filter.price = {};
      if (!isNaN(min)) filter.price.$gte = min;
      if (!isNaN(max)) filter.price.$lte = max;
    }

    // ── 3. Build Mongoose sort object ────────────────────────────────────────
    let sortObj = { createdAt: -1 };   // default: newest first
    if (sort === 'price_asc')   sortObj = { price:  1 };
    if (sort === 'price_desc')  sortObj = { price: -1 };
    if (sort === 'rating_desc') sortObj = { rating: -1 };

    // ── 4. Count total (for pagination) ─────────────────────────────────────
    const totalProducts = await Product.countDocuments(filter);
    const totalPages    = Math.ceil(totalProducts / PRODUCTS_PER_PAGE) || 1;

    // Guard: if requested page > totalPages, clamp it
    const safePage = Math.min(page, totalPages);
    const skip     = (safePage - 1) * PRODUCTS_PER_PAGE;

    // ── 5. Fetch products ────────────────────────────────────────────────────
    const products = await Product
      .find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(PRODUCTS_PER_PAGE)
      .lean();

    // ── 6. Build page-number array for EJS ──────────────────────────────────
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    // ── 7. Carry all active filters into the view (for form defaults) ────────
    const activeFilters = { search, category, sort,
      min: isNaN(min) ? '' : min,
      max: isNaN(max) ? '' : max };

    // ── 8. Render ────────────────────────────────────────────────────────────
    res.render('products', {
      title: 'Products | Ralph Lauren',
      products,
      currentPage:   safePage,
      totalPages,
      pages,
      totalProducts,
      activeFilters,
      validCategories: VALID_CATEGORIES,
    });

  } catch (err) {
    console.error('❌ productController.getProducts error:', err);
    res.status(500).render('404', { title: '500 | Ralph Lauren' });
  }
};
