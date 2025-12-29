const mongoose = require("mongoose");

const conductorSchema = new mongoose.Schema({
  name: String,
  conductorId: {
    type: String,
    required : true,
    unique: true// eg : CND-004
  },
  passwordHash: {
    type: String,
    required: true
  },
  assignedBus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    default: null
  },
  // busCode: {
  //   type: String,
  //   required: true
  // },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Conductor", conductorSchema);
