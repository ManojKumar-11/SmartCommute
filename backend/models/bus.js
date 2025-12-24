const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  currentConductor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conductor",
    default: null
  },
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
    default: null
  },
    currentStopIndex: {
    type: Number,
    default: null
  },
  isActive: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model("Bus", busSchema);
