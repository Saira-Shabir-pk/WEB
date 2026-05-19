const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/apiController");
const verifyToken = require("../middleware/verifyToken");

// Auth
router.post("/auth/login", ctrl.login);

// Products (public)
router.get("/products", ctrl.getProducts);
router.get("/products/:id", ctrl.getProduct);

// User (protected)
router.get("/user/profile", verifyToken, ctrl.getProfile);

// Orders (protected)
router.post("/orders", verifyToken, ctrl.createOrder);

module.exports = router;
