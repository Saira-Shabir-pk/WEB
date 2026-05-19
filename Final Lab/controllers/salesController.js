// controllers/salesController.js

const Order   = require('../models/Order');
const Product = require('../models/Product');

// ── Helper: fetch aggregated stats from DB ────────────────────────────────
async function fetchSalesStats() {
  // 1. Total revenue + total orders via aggregation
  const revenueAgg = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
        totalOrders:  { $sum: 1 },
      },
    },
  ]);

  const totalRevenue = revenueAgg[0]?.totalRevenue ?? 0;
  const totalOrders  = revenueAgg[0]?.totalOrders  ?? 0;

  // 2. Top-selling product (most units sold across all orders)
  const topProductAgg = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $unwind: '$items' },
    {
      $group: {
        _id:      '$items.productId',
        name:     { $first: '$items.name' },
        unitsSold: { $sum: '$items.quantity' },
        revenue:   { $sum: '$items.lineTotal' },
      },
    },
    { $sort: { unitsSold: -1 } },
    { $limit: 1 },
  ]);

  const topProduct = topProductAgg[0]
    ? { name: topProductAgg[0].name, unitsSold: topProductAgg[0].unitsSold, revenue: topProductAgg[0].revenue }
    : null;

  // 3. 5 most recent orders
  const recentOrders = await Order.find({ status: { $ne: 'cancelled' } })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // 4. Average order value
  const avgOrderValue = totalOrders > 0
    ? Number((totalRevenue / totalOrders).toFixed(2))
    : 0;

  // 5. Total products in catalogue
  const totalProducts = await Product.countDocuments();

  return {
    totalRevenue:  Number(totalRevenue.toFixed(2)),
    totalOrders,
    avgOrderValue,
    totalProducts,
    topProduct,
    recentOrders,
    lastUpdated: new Date().toISOString(),
  };
}

// ── GET /sales ─────────────────────────────────────────────────────────────
exports.getSalesDashboard = async (req, res) => {
  try {
    const stats = await fetchSalesStats();
    res.render('sales', {
      title: 'Sales Dashboard | Ralph Lauren',
      stats,
    });
  } catch (err) {
    console.error('❌ salesController.getSalesDashboard error:', err);
    res.status(500).render('404', { title: '500 | Ralph Lauren' });
  }
};

// ── GET /api/sales-data ────────────────────────────────────────────────────
exports.getSalesData = async (req, res) => {
  try {
    const stats = await fetchSalesStats();
    res.json(stats);
  } catch (err) {
    console.error('❌ salesController.getSalesData error:', err);
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
};
