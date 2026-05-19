// routes/productRoutes.js

const express = require('express');
const router  = express.Router();
const { getProducts } = require('../controllers/productController');

// GET /products  (all filters via query string)
router.get('/', getProducts);

module.exports = router;
