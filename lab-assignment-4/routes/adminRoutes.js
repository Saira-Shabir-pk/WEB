// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/adminController');
const { checkAdminAuth, loginAdmin, handleAdminLogin, logoutAdmin } = require('../middleware/adminAuth');

// ── Multer configuration ──────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = allowedTypes.test(file.mimetype);

    if (mime) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ── Login routes (no auth required) ───────────────────────────────────────
router.get('/login', loginAdmin);
router.post('/login', handleAdminLogin);

// ── Admin routes (require auth) ───────────────────────────────────────────
router.get('/', checkAdminAuth, adminController.getDashboard);

// Products CRUD
router.get('/products/new', checkAdminAuth, adminController.getNewProductForm);
router.post('/products', checkAdminAuth, upload.single('image'), adminController.createProduct);
router.get('/products/edit/:id', checkAdminAuth, adminController.getEditProductForm);
router.put('/products/:id', checkAdminAuth, upload.single('image'), adminController.updateProduct);
router.delete('/products/:id', checkAdminAuth, adminController.deleteProduct);

// Logout
router.get('/logout', logoutAdmin);

module.exports = router;