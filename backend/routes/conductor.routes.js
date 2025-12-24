const express = require("express");
const router = express.Router();
const Bus = require("../models/bus");
const Conductor = require("../models/conductor");

// GET BUS ASSIGNED TO CONDUCTOR
router.get("/:conductorId/bus", async (req, res) => {
  try {
    const { conductorId } = req.params;

    const conductor = await Conductor.findOne({ conductorId });
    if (!conductor) {
      return res.status(404).json({ error: "Conductor not found" });
    }

    const bus = await Bus.findOne({ currentConductor: conductor._id });
    if (!bus) {
      return res.status(404).json({ error: "No bus assigned to this conductor" });
    }

    // Determine journey order
    const effectiveStops =
      bus.direction === "FORWARD"
        ? bus.stops
        : [...bus.stops].reverse();

    const index = bus.currentStopIndex;

    const currentStop =
      typeof index === "number" &&
      index >= 0 &&
      index < effectiveStops.length
        ? effectiveStops[index]
        : null;

    return res.json({
      busCode: bus.busCode,
      isActive: bus.isActive,
      direction: bus.direction,
      currentStopIndex: index,
      currentStop,
      stops: effectiveStops,
      totalStops: effectiveStops.length
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});


// UPDATE CURRENT STOP
router.post("/update-stop", async (req, res) => {
  const { busCode, currentStopIndex } = req.body;

  const bus = await Bus.findOne({ busCode });

  if (!bus) {
    return res.status(404).json({ error: "Bus not found" });
  }

  if (!bus.isActive) {
    return res.status(400).json({ error: "Bus is not active" });
  }

  if (
    currentStopIndex < 0 ||
    currentStopIndex >= bus.stops.length
  ) {
    return res.status(400).json({ error: "Invalid stop index" });
  }

  bus.currentStopIndex = currentStopIndex;
  await bus.save();

  res.json({
    message: "Current stop updated",
    currentStop: bus.stops[currentStopIndex]
  });
});


router.post("/start-journey", async (req, res) => {
  const { busCode, startIndex, direction } = req.body;

  if (!busCode || startIndex === undefined || !direction) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const bus = await Bus.findOne({ busCode });

  if (!bus) {
    return res.status(404).json({ error: "Bus not found" });
  }

  if (bus.isActive) {
    return res.status(400).json({ error: "Journey already active" });
  }

  if (startIndex < 0 || startIndex >= bus.stops.length) {
    return res.status(400).json({ error: "Invalid start stop" });
  }

  bus.isActive = true;
  bus.direction = direction;
  bus.currentStopIndex = startIndex;

  await bus.save();

  res.json({
    message: "Journey started",
    busCode,
    startStop: bus.stops[startIndex],
    direction
  });
});

//END JOURNEY
router.post("/end-journey", async (req, res) => {
  const { busCode } = req.body;

  const bus = await Bus.findOne({ busCode });

  if (!bus) {
    return res.status(404).json({ error: "Bus not found" });
  }

  if (!bus.isActive) {
    return res.status(400).json({ error: "No active journey to end" });
  }

  bus.isActive = false;
  bus.direction = null;
  bus.currentStopIndex = null;

  await bus.save();

  res.json({
    message: "Journey ended",
    busCode
  });
});

module.exports = router;
