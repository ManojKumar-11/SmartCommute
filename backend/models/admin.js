const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: String,
  adminCode: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Admin", adminSchema);
