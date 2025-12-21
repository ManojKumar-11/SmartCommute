const express = require("express");
const router = express.Router();
const Bus = require("../models/bus");

// ADD BUS + ROUTE
router.post("/add-bus", async (req, res) => {
  const { busCode,numberPlate, stops } = req.body;

  if (!busCode || !Array.isArray(stops) || stops.length < 2) {
    return res.status(400).json({ error: "Invalid bus data" });
  }

  try {
    const bus = new Bus({
      busCode,
      numberPlate,
      stops
    });

    await bus.save();

    res.json({
      message: "Bus added successfully",
      busCode : bus.busCode,
      numberPlate: bus.numberPlate || null,
      stops: bus.stops
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Bus already exists" });
    }
    res.status(500).json({ error: "Failed to add bus" });
  }
});

module.exports = router;
