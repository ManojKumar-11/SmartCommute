const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

const {
  createPassOrder,
  verifyPassPayment,
  cancelPassPaymentIntent
} = require("../controllers/pass.payment.controller");

// 💰 Create Razorpay order for pass
router.post(
  "/create-order",
  auth,
  requireRole("passenger"),
  createPassOrder
);

// ✅ Verify pass payment & generate QR
router.post(
  "/verify",
  auth,
  requireRole("passenger"),
  verifyPassPayment
);

router.delete(
  "/intent/:intentId",
  auth,
  requireRole("passenger"),
  cancelPassPaymentIntent
);

module.exports = router;
