const express = require("express");
const router = express.Router();
const Ticket = require("../models/ticket");
const Pass = require("../models/pass");
const Bus = require("../models/bus");
const Conductor = require("../models/conductor");
const auth = require("../middleware/auth");

// Find Conductor Contact for Lost Item
router.post("/find-lost-item-contact", auth, async (req, res) => {
    const { id, type } = req.body; // id: ticketId/passId, type: 'ticket' | 'pass'

    if (!id || !type) {
        return res.status(400).json({ error: "Missing ID or Type" });
    }

    try {
        let busCode = null;
        let conductor = null;

        if (type === "ticket") {
            // 1. Find Ticket
            // Try searching by _id first, then ticketNo
            let ticket;
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                ticket = await Ticket.findById(id);
            }
            if (!ticket) {
                ticket = await Ticket.findOne({ ticketNo: id });
            }

            if (!ticket) {
                return res.status(404).json({ error: "Ticket not found" });
            }

            busCode = ticket.busCode;

        } else if (type === "pass") {
            // 2. Find Pass
            // Try searching by _id first, then passNo
            let pass;
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                pass = await Pass.findById(id);
            }
            if (!pass) {
                pass = await Pass.findOne({ passNo: id });
            }

            if (!pass) {
                return res.status(404).json({ error: "Pass not found" });
            }

            if (pass.status !== "ACTIVE") {
                return res.status(400).json({ error: "Pass is not active or expired" });
            }

            // Enforce busCode for Pass users
            if (!req.body.busCode) {
                return res.status(400).json({
                    error: "Bus Code is required for Pass holders to locate the conductor."
                });
            }

            busCode = req.body.busCode;

        } else {
            return res.status(400).json({ error: "Invalid type. Must be 'ticket' or 'pass'" });
        }

        // Common Logic for Ticket (or if Pass logic enhanced later)
        if (busCode) {
            const bus = await Bus.findOne({ busCode });

            if (!bus) {
                return res.status(404).json({ error: `Bus ${busCode} not found` });
            }

            if (bus.currentConductor) {
                // Explicitly fetch conductor by ID
                const currentConductor = await Conductor.findById(bus.currentConductor);

                if (currentConductor) {
                    return res.json({
                        busCode: bus.busCode,
                        conductorName: currentConductor.name,
                        conductorPhone: currentConductor.phoneNumber || "Not available"
                    });
                }
            }

            // Fallback
            return res.json({
                busCode: bus.busCode,
                conductorName: null,
                conductorPhone: null,
                message: "No conductor currently assigned to this bus."
            });
        }

    } catch (err) {
        console.error("Lost Item Check Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
