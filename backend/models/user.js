const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  //  Login
  phone: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },

  //  Identity (filled during pass creation)
  name: {
    type: String
  },
  gender: {
  type: String,
  enum: ["MALE", "FEMALE", "OTHER"]
  },
  dateOfBirth: {
    type: Date,
    uppercase: true
  },
  aadhaarHash: {
    type: String,
    unique: true,
    sparse: true // allows multiple nulls
  },
  photoUrl: {
    type: String
  },
  bloodGroup: {
    type: String
  },
  //  Meta
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
