const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Conductor = require("../models/conductor");
const Admin = require("../models/admin");
const router = express.Router();




router.post("/passenger/register", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      phone,
      passwordHash
    });

    await user.save();

    res.json({ message: "Registration successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/passenger/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: "passenger" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      role: "passenger",
      userId: user._id
    });

  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});


// Conductors are created by admin, not self-registered.
router.post("/conductor/login", async (req, res) => {
  try {
    const { conductorId, password } = req.body;

    const conductor = await Conductor.findOne({ conductorId });
    if (!conductor || !conductor.isActive) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, conductor.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: conductor._id, role: "conductor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      role: "conductor",
      conductorId: conductor.conductorId
    });

  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Admins are manually created.
router.post("/admin/login", async (req, res) => {
  try {
    const { adminCode, password } = req.body;

    const admin = await Admin.findOne({ adminCode });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      role: "admin",
      adminCode: admin.adminCode
    });

  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});


module.exports = router;
