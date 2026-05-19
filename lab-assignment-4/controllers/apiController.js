const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Product = require("../models/Product");

// POST /api/v1/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { user_id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/v1/products
exports.getProducts = async (req, res) => {
  try {
    const { search, category, min, max, sort, page = 1 } = req.query;
    const filter = {};

    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) filter.category = category;
    if (min || max) {
      filter.price = {};
      if (min) filter.price.$gte = Number(min);
      if (max) filter.price.$lte = Number(max);
    }

    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { rating: -1 },
    };
    const sortOption = sortMap[sort] || { createdAt: -1 };

    const limit = 8;
    const skip = (Number(page) - 1) * limit;
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort(sortOption).skip(skip).limit(limit);

    res.json({ total, page: Number(page), pages: Math.ceil(total / limit), products });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/v1/products/:id
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: "Invalid product ID" });
  }
};

// GET /api/v1/user/profile  (protected)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/v1/orders  (protected)
exports.createOrder = async (req, res) => {
  try {
    const { products: items } = req.body;
    if (!Array.isArray(items) || !items.length)
      return res.status(400).json({ error: "products array required" });

    const orderLines = [];
    let totalPrice = 0;

    for (const { productId, quantity } of items) {
      if (!productId || !quantity || quantity < 1)
        return res.status(400).json({ error: "Each item needs productId and quantity >= 1" });

      const product = await Product.findById(productId);
      if (!product)
        return res.status(404).json({ error: `Product ${productId} not found` });
      if (product.stock < quantity)
        return res.status(400).json({
          error: `Insufficient stock for "${product.name}" (available: ${product.stock})`,
        });

      const lineTotal = product.price * quantity;
      totalPrice += lineTotal;
      orderLines.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        lineTotal,
      });
    }

    res.status(201).json({
      message: "Order summary (not persisted — add an Order model to save)",
      userId: req.user.user_id,
      items: orderLines,
      totalPrice: Number(totalPrice.toFixed(2)),
      currency: "PKR",
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
