const mongoose = require("mongoose");

const conductorSchema = new mongoose.Schema({
  name: String,
  conductorId: {
    type: String,
    unique: true
  },
  busCode: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Conductor", conductorSchema);
