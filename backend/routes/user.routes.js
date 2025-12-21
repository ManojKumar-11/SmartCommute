const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/init-user", async (req, res) => {
  try {
    const user = new User();
    await user.save();
    res.json({ userId: user._id });
  } catch (err) {
    res.status(500).json({ error: "User init failed" });
  }
});

module.exports = router;
