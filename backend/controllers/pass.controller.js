const crypto = require("crypto");
const Pass = require("../models/pass");
const PassPaymentIntent = require("../models/passPaymentIntent");
const Bus = require("../models/bus");
const User = require("../models/user");
const { getSystemErrorMap } = require("util");

// helpers
function getDurationDays(passType) {
  if (passType === "MONTHLY") return 30;
  if (passType === "QUARTERLY") return 90;
  if (passType === "YEARLY") return 365;
  throw new Error("Invalid pass type");
}

exports.createPass = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      name,
      gender,
      dateOfBirth,
      aadhaarNumber,
      photoUrl,
      bloodGroup,
      district,
      passType
    } = req.body;

    // 1️⃣ Validate required fields
    if (
      !name ||
      !gender ||
      !dateOfBirth ||
      !aadhaarNumber ||
      !photoUrl ||
      !district ||
      !passType
    ) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    // 2️⃣ Block if user already has a pass
    const existingPass = await Pass.findOne({ userId });
    if (existingPass) {
      return res.status(400).json({
        error: "Pass already exists. Please renew instead."
      });
    }

    // 3️⃣ Block if a CREATE intent already exists
    const existingIntent = await PassPaymentIntent.findOne({
      userId,
      intentType: "CREATE",
      paymentStatus: "PENDING"
    });

    if (existingIntent) {
      return res.status(400).json({
        error: "Previous pass payment is pending. Complete or cancel it."
      });
    }

    // 4️⃣ Update user identity (one-time)
    const aadhaarHash = crypto
      .createHash("sha256")
      .update(aadhaarNumber)
      .digest("hex");

    await User.findByIdAndUpdate(userId, {
      name,
      gender,
      dateOfBirth,
      aadhaarHash,
      photoUrl,
      bloodGroup
    });

    // 5️⃣ Compute pricing
    const durationDays = getDurationDays(passType);
    const amount = durationDays * 70;

    // 6️⃣ Create payment intent (NO PASS YET)
    const intent = new PassPaymentIntent({
      userId,
      intentType: "CREATE",
      passType,
      district,
      durationDays,
      amount
    });

    await intent.save();

    return res.status(201).json({
      intentType:intent.intentType,
      message: "Pass creation initiated. Proceed to payment.",
      intentId: intent._id,
      amount
    });

  } catch (err) {
    console.error("createPass error:", err);
    return res.status(500).json({
      error: "Failed to initiate pass creation"
    });
  }
};



exports.renewPass = async (req, res) => {
  try {
    const userId = req.user.id;
    const { passType } = req.body;

    if (!passType) {
      return res.status(400).json({
        error: "passType is required"
      });
    }

    // 1️⃣ Pass must already exist
    const pass = await Pass.findOne({ userId });

    if (!pass) {
      return res.status(404).json({
        error: "No existing pass found. Please buy a new pass."
      });
    }

    // 2️⃣ Block if a RENEW intent already exists
    const existingIntent = await PassPaymentIntent.findOne({
      userId,
      intentType: "RENEW",
      paymentStatus: "PENDING"
    });

    if (existingIntent) {
      return res.status(400).json({
        error: "Pass renewal payment is already pending"
      });
    }

    // 3️⃣ Compute pricing (renewal choice)
    const durationDays = getDurationDays(passType);
    const amount = durationDays * 70;

    // 4️⃣ Create renewal intent (DO NOT TOUCH PASS)
    const intent = new PassPaymentIntent({
      userId,
      passId: pass._id,
      intentType: "RENEW",
      passType,
      durationDays,
      amount,
      district: pass.district,
    });

    await intent.save();

    return res.status(201).json({
      intentType:intent.intentType,
      message: "Pass renewal initiated. Proceed to payment.",
      intentId: intent._id,
      amount
    });

  } catch (err) {
    console.error("renewPass error:", err);
    return res.status(500).json({
      error: "Failed to initiate pass renewal"
    });
  }
};





exports.getMyPass = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // 1️⃣ Fetch pass
    const pass = await Pass.findOne({ userId });

    // 2️⃣ Fetch pending intent (if any)
    const intent = await PassPaymentIntent.findOne({
      userId,
      paymentStatus: "PENDING"
    });

    // 3️⃣ Fetch user details (for display)
    const user = await User.findById(userId).select(
      "name gender dateOfBirth photoUrl"
    );

    // 4️⃣ Compute expiry helper
    let expiresInDays = null;
    if (pass && pass.endDate && pass.endDate > now) {
      const diffMs = pass.endDate - now;
      expiresInDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }

    // 5️⃣ Decide UI state
    let uiState;

    if (!pass && !intent) {
      uiState = "NO_PASS";
    } else if (!pass && intent?.intentType === "CREATE") {
      uiState = "CREATE_PAYMENT_PENDING";
    } else if (pass && pass.status === "ACTIVE" && !intent) {
      uiState = "ACTIVE_PASS";
    } else if (pass && pass.status === "ACTIVE" && intent?.intentType === "RENEW") {
      uiState = "RENEW_PAYMENT_PENDING";
    } else if (pass && pass.status === "EXPIRED" && !intent) {
      uiState = "PASS_EXPIRED";
    } else if (pass && pass.status === "EXPIRED" && intent?.intentType === "RENEW") {
      uiState = "RENEW_PAYMENT_PENDING";
    }

    // 6️⃣ Compute age (derived, not stored)
    let age = null;
    if (user?.dateOfBirth) {
      age = new Date().getFullYear() - user.dateOfBirth.getFullYear();
    }

    // 7️⃣ Respond (UI-friendly)
    return res.json({
      uiState,

      user: user
        ? {
            name: user.name,
            gender: user.gender,
            age,
            photoUrl: user.photoUrl
          }
        : null,

      pass: pass
        ? {
            id: pass._id,
            district: pass.district,
            passType: pass.passType,
            status: pass.status,
            validTill: pass.endDate,
            qrSignature: pass.qrSignature
          }
        : null,

      intent: intent
        ? {
            id: intent._id,
            intentType: intent.intentType,
            amount: intent.amount
          }
        : null,

      expiresInDays
    });

  } catch (err) {
    console.error("getMyPass error:", err);
    return res.status(500).json({
      error: "Failed to fetch pass data"
    });
  }
};






exports.verifyPassQR = async (req, res) => {
  // console.log("reached");
  try {
    const { passId, qrSignature } = req.body;
    const conductorId = req.user.id;

    if (!passId || !qrSignature) {
      return res.status(400).json({
        valid: false,
        reason: "INVALID_QR_DATA"
      });
    }
    // 1️⃣ Get conductor's assigned bus
    const bus = await Bus.findOne({ currentConductor: conductorId });
    
    if (!bus || !bus.district) {
      return res.status(403).json({
        valid: false,
        reason: "CONDUCTOR_NOT_ASSIGNED"
      });
    }

    // 2️⃣ Fetch pass
    const pass = await Pass.findById(passId);

    if (!pass) {
      return res.status(404).json({
        valid: false,
        reason: "PASS_NOT_FOUND"
      });
    }

    // 3️⃣ Verify QR signature
    const expectedSignature = crypto
      .createHash("sha256")
      .update(
        pass._id.toString() +
        pass.userId.toString() +
        pass.endDate.toISOString() +
        pass.district +
        process.env.QR_SECRET
      )
      .digest("hex");

    if (expectedSignature !== qrSignature) {
      return res.status(401).json({
        valid: false,
        reason: "QR_TAMPERED"
      });
    }

    // 4️⃣ Status check
    if (pass.status !== "ACTIVE") {
      return res.status(400).json({
        valid: false,
        reason: "PASS_INACTIVE"
      });
    }

    // 5️⃣ Expiry check
    const now = new Date();
    if (!pass.endDate || now > pass.endDate) {
      return res.status(400).json({
        valid: false,
        reason: "PASS_EXPIRED"
      });
    }

    // 6️⃣ District enforcement
    
    if (pass.district !== bus.district) {
      return res.status(403).json({
        valid: false,
        reason: "WRONG_DISTRICT"
      });
    }

    // 7️⃣ Fetch minimal user info
    const user = await User.findById(pass.userId).select(
      "name gender dateOfBirth photoUrl"
    );

    // 8️⃣ Success
    return res.json({
      valid: true,
      validTill: pass.endDate,
      user: {
        name: user.name,
        gender: user.gender,
        age: user.dateOfBirth
          ? new Date().getFullYear() - user.dateOfBirth.getFullYear()
          : null,
        photoUrl: user.photoUrl
      }
    });

  } catch (err) {
    console.error("verifyPassQR error:", err);
    return res.status(500).json({
      valid: false,
      reason: "SERVER_ERROR"
    });
  }
};
