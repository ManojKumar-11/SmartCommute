const Razorpay = require("razorpay");
const crypto = require("crypto");
const Pass = require("../models/pass");
const PassPaymentIntent = require("../models/passPaymentIntent");

// helper
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createPassOrder = async (req, res) => {
  try {
    const { intentId } = req.body;

    if (!intentId) {
      return res.status(400).json({
        error: "Payment intent ID required"
      });
    }

    // 1️⃣ Fetch payment intent
    const intent = await PassPaymentIntent.findById(intentId);

    if (!intent) {
      return res.status(404).json({
        error: "Payment intent not found"
      });
    }

    // 2️⃣ Only allow payment if pending
    if (intent.paymentStatus !== "PENDING") {
      return res.status(400).json({
        error: "Payment already processed or expired"
      });
    }

    // 3️⃣ Create Razorpay order
    const options = {
      amount: intent.amount * 100, // rupees → paise
      currency: "INR",
      receipt: `pass_intent_${intent._id}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    // 4️⃣ Save order ID in intent
    intent.razorpayOrderId = order.id;
    await intent.save();

    return res.json({
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: options.amount,
      currency: "INR"
    });

  } catch (err) {
    console.error("createPassOrder error:", err);
    return res.status(500).json({
      error: "Failed to create pass payment order"
    });
  }
};



exports.verifyPassPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        error: "Invalid payment data"
      });
    }

    // 1️⃣ Verify Razorpay signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        error: "Payment verification failed"
      });
    }

    // 2️⃣ Fetch payment intent by user and status (should be only one PENDING)
    const userId = req.user.id;
    const intent = await PassPaymentIntent.findOne({
      userId,
      paymentStatus: "PENDING"
    });

    if (!intent) {
      return res.status(404).json({
        error: "No pending payment intent found"
      });
    }

    // 3️⃣ Verify the order ID matches
    if (intent.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        error: "Order ID mismatch"
      });
    }

    const paymentDate = new Date();

    let pass;

    // 3️⃣ Apply intent
    if (intent.intentType === "CREATE") {
      // CREATE new pass
      pass = new Pass({
        userId: intent.userId,
        district: intent.district, // if district stored in intent
        passType: intent.passType,
        status: "ACTIVE"
      });

      const endDate = addDays(paymentDate, intent.durationDays);
      pass.endDate = endDate;

    } else if (intent.intentType === "RENEW") {
      // RENEW existing pass
      pass = await Pass.findById(intent.passId);

      if (!pass) {
        return res.status(404).json({
          error: "Pass not found for renewal"
        });
      }

      const baseDate =
        pass.endDate && pass.endDate > paymentDate
          ? pass.endDate
          : paymentDate;

      pass.endDate = addDays(baseDate, intent.durationDays);
      pass.status = "ACTIVE";
    }
    await pass.save();
    // 4️ Generate QR signature
    const qrSignature = crypto
      .createHash("sha256")
      .update(
        pass._id.toString() +
        pass.userId.toString() +
        pass.endDate.toISOString() +
        pass.district +
        process.env.QR_SECRET
      )
      .digest("hex");

    pass.qrSignature = qrSignature;
    

    // 5️⃣ Finalize intent
    intent.paymentStatus = "PAID";
    intent.razorpayPaymentId = razorpay_payment_id;
    await intent.deleteOne(); // cleanup

    return res.json({
      success: true,
      message:
        intent.intentType === "CREATE"
          ? "Pass created successfully"
          : "Pass renewed successfully",
      passId: pass._id,
      validTill: pass.endDate
    });

  } catch (err) {
    console.error("verifyPassPayment error:", err);
    return res.status(500).json({
      error: "Pass payment verification failed"
    });
  }
};



exports.cancelPassPaymentIntent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { intentId } = req.params;
    // console.log(intentId);
    if (!intentId) {
      return res.status(400).json({
        error: "Intent ID required"
      });
    }

    // 1️⃣ Find intent owned by user
    const intent = await PassPaymentIntent.findOne({
      _id: intentId,
      userId,
      paymentStatus: "PENDING"
    });

    if (!intent) {
      return res.status(404).json({
        error: "No pending payment intent found"
      });
    }

    // 2️⃣ Delete intent (THIS IS THE CANCEL)
    await intent.deleteOne();

    return res.json({
      success: true,
      message:
        intent.intentType === "CREATE"
          ? "Pass creation cancelled"
          : "Pass renewal cancelled"
    });

  } catch (err) {
    console.error("cancelPassPaymentIntent error:", err);
    return res.status(500).json({
      error: "Failed to cancel payment intent"
    });
  }
};
