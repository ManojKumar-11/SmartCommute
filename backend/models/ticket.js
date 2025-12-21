const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  busCode: {
  type: String,
  required: true
  },
  boardingStop: {
    type: String,
    required: true
  },
  destinationStop: {
    type: String,
    required: true
  }
  ,
  fare: Number,
  issuedAt: {
    type: Date,
    default: Date.now
  },
  validTill: Date,
  isUsed: {
    type: Boolean,
    default: false
  },
  qrSignature: {
    type: String,
    required: true
}
});

module.exports = mongoose.model("Ticket", ticketSchema);
