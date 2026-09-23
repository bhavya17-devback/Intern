const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const authController = require("./auth.controller");

// 24. Auth Rate Limiter Configuration (Max 5 attempts per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: "Too many login attempts from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth Routes
router.post("/register", authController.register); // Missing Route Added Back
router.post("/login", authLimiter, authController.login);

module.exports = router;