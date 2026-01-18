const mongoose = require("mongoose");

const passSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true // ONE pass per user
  },

  district: {
    type: String,
    required: true
  },

  passType: {
    type: String,
    enum: ["MONTHLY", "QUARTERLY", "YEARLY"],
    required: true
  },

  // Validity
  endDate: {
    type: Date,
    default: null // set ONLY after payment
  },

  status: {
    type: String,
    enum: ["ACTIVE", "EXPIRED"],
    required: true
  },

  // 🔐 QR (exists only for ACTIVE pass)
  qrSignature: {
    type: String,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Pass", passSchema);
