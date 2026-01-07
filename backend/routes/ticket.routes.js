const express = require("express");
const router = express.Router();
const Ticket = require("../models/ticket");
const crypto = require("crypto");
const Bus = require("../models/bus");

const auth = require("../middleware/auth");//authentication
const requireRole = require("../middleware/requireRole");//autorization

//BUY - TICKET
const COST_PER_STOP = 5;
router.post("/buy-ticket",auth,requireRole("passenger"), async (req, res) => {
  const { busCode, boardingStop, destinationStop } = req.body;
  const userId = req.user.id; // NOT from req.body
  if (!userId || !busCode || !boardingStop || !destinationStop) {
    return res.status(400).json({ error: "Missing fields :(" });
  }

  try {
    const bus = await Bus.findOne({ busCode, isActive: true });
    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    const { stops, direction } = bus;

    // physical indices
    const boardingPhysicalIndex = stops.indexOf(boardingStop);
    const destinationPhysicalIndex = stops.indexOf(destinationStop);

    if (boardingPhysicalIndex === -1 || destinationPhysicalIndex === -1) {
      return res.status(400).json({ error: "Invalid stops" });
    }

    // map physical → journey indices
    const boardingJourneyIndex =
      direction === "FORWARD"
        ? boardingPhysicalIndex
        : stops.length - 1 - boardingPhysicalIndex;

    const destinationJourneyIndex =
      direction === "FORWARD"
        ? destinationPhysicalIndex
        : stops.length - 1 - destinationPhysicalIndex;

    if (destinationJourneyIndex <= boardingJourneyIndex) {
      return res.status(400).json({ error: "Invalid stop order" });
    }

    const fare =
      (destinationJourneyIndex - boardingJourneyIndex) * COST_PER_STOP;

    const validTill = new Date(Date.now() + 60 * 60 * 1000);

    const ticket = new Ticket({
        userId,
        busCode,
        boardingStop,
        destinationStop,
        fare,
        validTill,
        paymentStatus: "PENDING", 
        isUsed: false
    });



    await ticket.save();
    res.json({
    ticketId: ticket._id,
    busCode,
    boardingStop,
    destinationStop,
    fare: ticket.fare,
    validTill: ticket.validTill,
    paymentStatus: ticket.paymentStatus
    });
  }
  catch (err) {
    console.error("BUY TICKET ERROR:", err.message);
    res.status(500).json({ error: "Ticket creation failed" });
  }
});


// PASSENGER: GET ACTIVE TICKETS
router.get("/active",auth,requireRole("passenger"), async (req, res) => {
  const userId = req.user.id; // NOT from req.body
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
router.post("/verify-ticket", auth, requireRole("conductor") , async (req, res) => {
  const { ticketId, validTill, signature } = req.body;

  if (!ticketId || !validTill || !signature) {
    return res.status(400).json({ error: "Invalid QR payload" });
  }

  try {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // PAYMENT CHECK
    if (ticket.paymentStatus !== "PAID") {
      return res.status(403).json({ error: "Ticket not paid" });
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
      boardingStop: ticket.boardingStop,
      destinationStop: ticket.destinationStop,
      fare: ticket.fare
    });

  } catch (err) {
    return res.status(500).json({ error: "Verification failed" });
  }
});

// GET TICKET BY ID (Passenger)
//DYNAMIC ROUTES SHOULD BE LAST
router.get(
  "/:ticketId",
  auth,
  requireRole("passenger"),
  async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.ticketId);

      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }

      // Security: only owner can view
      if (ticket.userId.toString() !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json(ticket);
    } catch (err) {
      console.log("failed ");
      res.status(500).json({ error: "Failed to fetch ticket" });
    }
  }
);
module.exports = router;
