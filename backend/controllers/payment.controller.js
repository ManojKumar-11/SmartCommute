const Razorpay = require("razorpay");
const crypto = require("crypto");
const Ticket = require("../models/ticket");

// -----------------------------
// Razorpay instance
// -----------------------------
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// -----------------------------
// CREATE ORDER
// -----------------------------
const createOrder = async (req, res) => {
  try {
    const { ticketId } = req.body;

    if (!ticketId) {
      return res.status(400).json({ error: "Ticket ID required" });
    }

    // 1. Fetch ticket
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    if (ticket.paymentStatus === "PAID") {
      return res.status(400).json({ error: "Ticket already paid" });
    }

    // 2. Create Razorpay order
    const options = {
      amount: ticket.fare * 100, // rupees → paise
      currency: "INR",
      receipt: `ticket_${ticket._id}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    // 3. Save order ID
    ticket.razorpayOrderId = order.id;
    ticket.paymentStatus = "PENDING";
    await ticket.save();

    // 4. Send to frontend
    res.json({
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: options.amount,
      currency: "INR",
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Failed to create payment order" });
  }
};

// -----------------------------
// VERIFY PAYMENT
// -----------------------------
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({ error: "Invalid payment data" });
    }

    // 1. Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // 2. Fetch ticket
    const ticket = await Ticket.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // 3. Update payment status
    const signature = crypto
    .createHash("sha256")
    .update(
        ticket._id.toString() +
        ticket.validTill.toISOString() +
        process.env.QR_SECRET
    ).digest("hex");
    ticket.qrSignature = signature;
    ticket.paymentStatus = "PAID";
    ticket.razorpayPaymentId = razorpay_payment_id;

    // 4. Generate QR here (after payment only)
    // ticket.qrCode = generateQR(ticket);

    await ticket.save();

    res.json({
      success: true,
      message: "Payment verified successfully",
      ticketId: ticket._id,
    });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

// -----------------------------
// EXPORTS
// -----------------------------
module.exports = {
  createOrder,
  verifyPayment,
};
