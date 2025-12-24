const express = require("express");
const router = express.Router();
const Bus = require("../models/bus");

// PASSENGER: GET BUS ROUTE
router.get("/:busCode", async (req, res) => {
  const { busCode } = req.params;
  try {
    const bus = await Bus.findOne({ busCode, isActive: true });

    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }
    // if (!bus.isActive) {
    //   return res.status(400).json({
    //     error: "Bus not in service"
    //   });
    // }

    const effectiveStops =
        bus.direction === "FORWARD"
            ? bus.stops
            : [...bus.stops].reverse();

    const currentStop = effectiveStops[bus.currentStopIndex];
    const destinationStops = effectiveStops.slice(bus.currentStopIndex + 1);
    
    res.json({
        busCode: bus.busCode,
        direction: bus.direction,
        currentStop,
        boardingStop: currentStop,
        destinationStops
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bus" });
  }
});

module.exports = router;
