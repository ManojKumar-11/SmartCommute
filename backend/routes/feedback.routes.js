const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { submitFeedback, getBusFeedback } = require('../controllers/feedback.controller');

router.use((req, res, next) => {
    console.log(`Feedback route hit: ${req.method} ${req.url}`);
    next();
});

// Submit feedback (Passenger only)
router.post('/submit', auth, requireRole('passenger'), submitFeedback);

module.exports = router;
