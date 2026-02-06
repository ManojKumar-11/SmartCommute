const express = require("express");
const router = express.Router();
const Bus = require("../models/bus");
const Conductor = require("../models/conductor");
const bcrypt = require("bcrypt");



const auth = require("../middleware/auth");//authentication
const requireRole = require("../middleware/requireRole");//autorization

router.use(auth, requireRole("admin"));


// ADD BUS + ROUTE
router.post("/add-bus", async (req, res) => {
  const { busCode, numberPlate, stops, district } = req.body;

  if (!busCode || !Array.isArray(stops) || stops.length < 2 || !district) {
    return res.status(400).json({ error: "Invalid bus data" });
  }

  try {
    const bus = new Bus({
      busCode,
      numberPlate,
      stops,
      district
    });

    await bus.save();

    res.json({
      message: "Bus added successfully",
      busCode: bus.busCode,
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



// GET ALL BUSES
router.get("/all-buses", async (req, res) => {
  try {
    const buses = await Bus.find().populate("currentConductor", "name conductorId");
    res.json(buses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch buses" });
  }
});

// REMOVE BUS
router.delete("/remove-bus/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const bus = await Bus.findById(id);
    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    // If a conductor is assigned, unassign them
    if (bus.currentConductor) {
      const conductor = await Conductor.findById(bus.currentConductor);
      if (conductor) {
        conductor.assignedBus = null;
        await conductor.save();
      }
    }

    await Bus.findByIdAndDelete(id);
    res.json({ message: "Bus deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete bus" });
  }
});

// EDIT BUS
router.put("/edit-bus/:id", async (req, res) => {
  const { id } = req.params;
  const { busCode, numberPlate, stops, district } = req.body;

  if (!busCode || !Array.isArray(stops) || stops.length < 2 || !district) {
    return res.status(400).json({ error: "Invalid bus data" });
  }

  try {
    const bus = await Bus.findById(id);
    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    // Update fields
    bus.busCode = busCode;
    bus.numberPlate = numberPlate;
    bus.stops = stops;
    bus.district = district;

    await bus.save();

    res.json({
      message: "Bus updated successfully",
      bus
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Bus Code or Number Plate already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to update bus" });
  }
});

// ADD CONDUCTOR (NO BUS)
router.post("/add-conductor", async (req, res) => {
  const { name, conductorId, password, phoneNumber } = req.body;

  if (!name || !conductorId || !password) {
    return res.status(400).json({ error: "Missing fields.." });
  }

  try {
    const existing = await Conductor.findOne({ conductorId });
    if (existing) {
      return res.status(409).json({ error: "Conductor already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const conductor = new Conductor({
      name,
      phoneNumber,
      conductorId,
      passwordHash,
      assignedBus: null
    });

    await conductor.save();

    res.json({
      message: "Conductor created successfully",
      conductorId: conductor.conductorId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add conductor" });
  }
});

// GET ALL CONDUCTORS
router.get("/all-conductors", async (req, res) => {
  try {
    const conductors = await Conductor.find().populate("assignedBus", "busCode numberPlate");
    res.json(conductors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conductors" });
  }
});

// ASSIGN BUS TO CONDUCTOR
router.post("/assign-bus", async (req, res) => {
  const { conductorId, busCode } = req.body;

  if (!conductorId || !busCode) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const conductor = await Conductor.findOne({ conductorId });
    if (!conductor) {
      return res.status(404).json({ error: "Conductor not found" });
    }

    const bus = await Bus.findOne({ busCode });
    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    // prevent assigning same bus to multiple conductors
    if (bus.currentConductor) {
      return res.status(400).json({
        error: "Bus already assigned to another conductor"
      });
    }

    // if conductor already has a bus, unassign it
    if (conductor.assignedBus) {
      const oldBus = await Bus.findById(conductor.assignedBus);
      if (oldBus) {
        oldBus.currentConductor = null;
        oldBus.isActive = false;
        oldBus.currentStopIndex = null;
        oldBus.direction = null;
        await oldBus.save();
      }
    }

    // assign new bus
    conductor.assignedBus = bus._id;
    bus.currentConductor = conductor._id;

    await conductor.save();
    await bus.save();

    res.json({
      message: "Bus assigned successfully",
      conductorId,
      busCode
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to assign bus" });
  }
});


//UNASSIGN BUS FROM CONDUCTOR
router.post("/unassign-bus", async (req, res) => {
  const { conductorId } = req.body;

  if (!conductorId) {
    return res.status(400).json({ error: "Missing conductorId" });
  }

  try {
    const conductor = await Conductor.findOne({ conductorId });
    if (!conductor || !conductor.assignedBus) {
      return res.status(400).json({ error: "No bus to unassign" });
    }

    const bus = await Bus.findById(conductor.assignedBus);
    if (bus) {
      bus.currentConductor = null;
      bus.isActive = false;
      bus.currentStopIndex = null;
      bus.direction = null;
      await bus.save();
    }

    conductor.assignedBus = null;
    await conductor.save();

    res.json({
      message: "Bus unassigned successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to unassign bus" });
  }
});


module.exports = router;
