const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  busCode: {
    type: String,
    required: true,
    unique: true
  },
  numberPlate: {
    type: String // optional
  },
  stops: {
    type: [String],
    required: true
  },
  direction: {
    type: String,
    enum: ["FORWARD", "REVERSE"],
    default: "FORWARD"
  },
    currentStopIndex: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model("Bus", busSchema);
