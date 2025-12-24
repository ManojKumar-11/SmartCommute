const express = require("express");
const router = express.Router();
const Bus = require("../models/bus");
const Conductor = require("../models/conductor");

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


// ADD CONDUCTOR + ASSIGN BUS
router.post("/add-conductor", async (req, res) => {
  const { name, conductorId, busCode } = req.body;

  if (!name || !conductorId || !busCode) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const bus = await Bus.findOne({ busCode });

    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    if (bus.currentConductor) {
      //prevents same bus assigned to multiple conductor
      return res.status(400).json({
        error: "Bus already assigned to another conductor"
      });
    }

    const conductor = new Conductor({
      name,
      conductorId,
      busCode
    });

    await conductor.save();

    bus.currentConductor = conductor._id;
    await bus.save();

    res.json({
      message: "Conductor added and assigned to bus",
      conductorId: conductor.conductorId,
      busCode: bus.busCode
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: "Conductor already exists"
      });
    }

    res.status(500).json({
      error: "Failed to add conductor"
    });
  }
});

//REMOVE CONDUCTOR
router.post("/remove-conductor", async (req, res) => {
  const { conductorId } = req.body;

  const conductor = await Conductor.findOne({ conductorId });

  if (!conductor) {
    return res.status(404).json({ error: "Conductor not found" });
  }

  // Unassign from bus
  await Bus.updateOne(
    { currentConductor: conductor._id },
    { $set: { currentConductor: null } }
  );

  // Delete conductor
  await Conductor.deleteOne({ _id: conductor._id });

  res.json({ message: "Conductor removed and bus unassigned" });
});

module.exports = router;
