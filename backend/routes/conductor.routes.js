const express = require("express");
const router = express.Router();
const Bus = require("../models/bus");

// CONDUCTOR: SET BUS DIRECTION
router.post("/set-direction", async (req, res) => {
  const { busCode, direction } = req.body;

  if (!busCode || !["FORWARD", "REVERSE"].includes(direction)) {
    return res.status(400).json({ error: "Invalid direction data" });
  }

  try {
    const bus = await Bus.findOne({ busCode });

    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    bus.direction = direction;
    await bus.save();

    res.json({
      message: "Direction updated",
      busCode: bus.busCode,
      direction: bus.direction
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to update direction" });
  }
});


// UPDATE CURRENT STOP
router.post("/update-current-stop", async (req, res) => {
  const { busCode, stopName } = req.body;

  if (!busCode || !stopName) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    const bus = await Bus.findOne({ busCode, isActive: true });
    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    const effectiveStops =
      bus.direction === "FORWARD"
        ? bus.stops
        : [...bus.stops].reverse();

    const index = effectiveStops.indexOf(stopName);
    if (index === -1) {
      return res.status(400).json({ error: "Invalid stop" });
    }

    if (index < bus.currentStopIndex) {
      return res.status(409).json({ error: "Cannot move backwards" });
    }

    bus.currentStopIndex = index;
    await bus.save();

    res.json({
      message: "Current stop updated",
      busCode,
      currentStop: stopName,
      currentStopIndex: index
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to update stop" });
  }
});



module.exports = router;
