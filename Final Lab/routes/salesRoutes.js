// routes/salesRoutes.js

const express       = require('express');
const router        = express.Router();
const salesCtrl     = require('../controllers/salesController');

// GET /sales  → server-side rendered dashboard
router.get('/', salesCtrl.getSalesDashboard);

module.exports = router;
