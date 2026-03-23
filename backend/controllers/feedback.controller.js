const Feedback = require('../models/feedback');
const Bus = require('../models/bus');

// POST /feedback/submit
exports.submitFeedback = async (req, res) => {
    try {
        const { busCode, rating, comment } = req.body;
        const userId = req.user.id;

        if (!busCode || !rating) {
            return res.status(400).json({ error: "Bus code and rating are required." });
        }

        // Optional: Verify busCode exists (good for data integrity)
        const busExists = await Bus.findOne({ busCode: busCode.toUpperCase() });
        // We might not fail if bus doesn't exist to allow historical feedback, 
        // but strictly speaking we should probably warn or check.
        // For now, let's allow it but we could log it.

        const newFeedback = new Feedback({
            userId,
            busCode,
            rating,
            comment
        });

        await newFeedback.save();
        res.status(201).json({ message: "Feedback submitted successfully", feedbackId: newFeedback._id });

    } catch (err) {
        console.error("Feedback submit error:", err);
        res.status(500).json({ error: "Failed to submit feedback." });
    }
};

// GET /feedback/bus/:busCode (Optional, for future use)
exports.getBusFeedback = async (req, res) => {
    try {
        const { busCode } = req.params;
        const feedback = await Feedback.find({ busCode: busCode.toUpperCase() })
            .populate('userId', 'name') // Assuming User model has 'name'
            .sort({ createdAt: -1 });

        res.json(feedback);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch feedback" });
    }
};
