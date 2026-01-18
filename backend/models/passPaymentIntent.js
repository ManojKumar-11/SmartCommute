const mongoose = require("mongoose");

const passPaymentIntentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  passId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pass",
    default: null // null for first-time purchase
  },

  intentType: {
    type: String,
    enum: ["CREATE", "RENEW"],
    required: true
  },

  passType: {
    type: String,
    enum: ["MONTHLY", "QUARTERLY", "YEARLY"],
    required: true
  },

  durationDays: {
    type: Number,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  // Razorpay
  razorpayOrderId: {
    type: String,
    default: null
  },

  razorpayPaymentId: {
    type: String,
    default: null
  },
  district: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING"
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 // auto-delete after 24 hours
  }
});

module.exports = mongoose.model(
  "PassPaymentIntent",
  passPaymentIntentSchema
);
