// routes/adminRoutes.js

const express        = require('express');
const router         = express.Router();
const multer         = require('multer');
const path           = require('path');
const adminController = require('../controllers/adminController');
const { isAdmin }    = require('../middleware/authMiddleware');

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
    const mime = allowedTypes.test(file.mimetype);
    if (mime) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }   // 5 MB
});

// ── All admin routes are protected by isAdmin ─────────────────────────────
router.get('/',                    isAdmin, adminController.getDashboard);
router.get('/products/new',        isAdmin, adminController.getNewProductForm);
router.post('/products',           isAdmin, upload.single('image'), adminController.createProduct);
router.get('/products/edit/:id',   isAdmin, adminController.getEditProductForm);
router.put('/products/:id',        isAdmin, upload.single('image'), adminController.updateProduct);
router.delete('/products/:id',     isAdmin, adminController.deleteProduct);

// NOTE: /admin/login and /admin/logout are now handled by /auth/login and /auth/logout.
// Keep these redirects so old bookmarks still work:
router.get('/login',  (req, res) => res.redirect('/auth/login'));
router.get('/logout', (req, res) => res.redirect('/auth/logout'));

module.exports = router;
