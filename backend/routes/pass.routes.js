const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");//authentication
const requireRole = require("../middleware/requireRole");//autorization

const {
  createPass,
  renewPass,
  getMyPass,
  verifyPassQR
} = require("../controllers/pass.controller");

// 🔐 Passenger creates a new pass
router.post("/create", auth,requireRole("passenger"), createPass);

// 🔁 Renew existing pass
router.post("/renew", auth,requireRole("passenger"), renewPass);

// 👤 Passenger views own pass
router.get("/me", auth,requireRole("passenger"), getMyPass);

// 👮 Conductor scans QR
router.post("/verify", auth,requireRole("conductor"), verifyPassQR);

module.exports = router;



      

