require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/smartcommute")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));
  
// const userRoutes = require("./routes/user.routes");
const ticketRoutes = require("./routes/ticket.routes");
const adminRoutes = require("./routes/admin.routes");
const busRoutes = require("./routes/bus.routes");
const conductorRoutes = require("./routes/conductor.routes");
const authRoutes = require("./routes/auth.routes");
const paymentRoutes = require("./routes/payment.routes");
const passRoutes = require("./routes/pass.routes");
const passPaymentRoutes = require("./routes/pass.payment.routes");

app.use("/auth", authRoutes);
// app.use("/api/users", userRoutes);
app.use("/tickets", ticketRoutes);
app.use("/admin", adminRoutes);
app.use("/bus", busRoutes);
app.use("/conductor", conductorRoutes);
app.use("/pass", passRoutes);
app.use("/payment", paymentRoutes);
app.use("/pass/payment", passPaymentRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
