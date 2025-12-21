const express = require("express");
const router = express.Router();
const Ticket = require("../models/ticket");
const crypto = require("crypto");
const Bus = require("../models/bus");

//BUY - TICKET
const COST_PER_STOP = 5;
router.post("/buy-ticket", async (req, res) => {
  const { userId, busCode, boardingStop, destinationStop } = req.body;

  if (!userId || !busCode || !boardingStop || !destinationStop) {
    return res.status(400).json({ error: "Missing fields" });
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

    const boardingIndex = effectiveStops.indexOf(boardingStop);
    const destinationIndex = effectiveStops.indexOf(destinationStop);

    if (boardingIndex === -1 || destinationIndex === -1) {
      return res.status(400).json({ error: "Invalid stops" });
    }

    if (destinationIndex <= boardingIndex) {
      return res.status(400).json({ error: "Invalid stop order" });
    }

    const fare = (destinationIndex - boardingIndex) * COST_PER_STOP;
    const validTill = new Date(Date.now() + 60 * 60 * 1000);

    const ticket = new Ticket({
      userId,
      busCode,
      boardingStop,
      destinationStop,
      fare,
      validTill
    });

    const signature = crypto
      .createHash("sha256")
      .update(
        ticket._id.toString() +
        validTill.toISOString() +
        process.env.QR_SECRET
      )
      .digest("hex");

    ticket.qrSignature = signature;

    await ticket.save();

    res.json({
      ticketId: ticket._id,
      busCode,
      boardingStop,
      destinationStop,
      fare,
      validTill,
      signature
    });

  } catch (err) {
    console.error("BUY TICKET ERROR:", err.message);
    res.status(500).json({ error: "Ticket creation failed" });
  }
});


// PASSENGER: GET ACTIVE TICKETS
router.get("/active/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const tickets = await Ticket.find({
      userId,
      validTill: { $gt: new Date() }
    }).sort({ issuedAt: -1 });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});


//VERIFY TICKET
router.post("/verify-ticket", async (req, res) => {
  const { ticketId, validTill, signature } = req.body;

  if (!ticketId || !validTill || !signature) {
    return res.status(400).json({ error: "Invalid QR payload" });
  }

  try {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // 1️ Recompute signature
    const expectedSignature = crypto
      .createHash("sha256")
      .update(
        ticket._id.toString() +
        ticket.validTill.toISOString() +
        process.env.QR_SECRET
      )
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(401).json({ error: "QR tampered" });
    }

    // 2️ Expiry check
    if (new Date() > ticket.validTill) {
      return res.status(403).json({ error: "Ticket expired" });
    }

    // 3️ Reuse check
    if (ticket.isUsed) {
      return res.status(409).json({ error: "Ticket already used" });
    }

    // 4️ Mark as used
    ticket.isUsed = true;
    await ticket.save();

    return res.json({
      status: "VALID",
      source: ticket.source,
      destination: ticket.destination,
      fare: ticket.fare
    });

  } catch (err) {
    return res.status(500).json({ error: "Verification failed" });
  }
});


module.exports = router;
