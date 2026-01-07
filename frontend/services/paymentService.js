import RazorpayCheckout from "react-native-razorpay";
import { Alert } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function payForTicket({ ticketId, token, navigation }) {
  try {
    // 1️⃣ Create Razorpay order
    const res = await fetch(`${API_URL}/payment/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ticketId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    // 2️⃣ Open Razorpay checkout
    const options = {
      handler: function (response) {
        alert("Payment Successful!");
        console.log("Payment ID:", response.razorpay_payment_id);
        console.log("Order ID:", response.razorpay_order_id);
        console.log("Signature:", response.razorpay_signature);
      },
      key: data.key,
      order_id: data.orderId,
      amount: data.amount,
      currency: "INR",
      name: "SmartCommute",
      description: "Bus Ticket Payment",
      theme: { color: "#2563EB" },
      modal: {
        ondismiss: function() {
          console.log('Checkout form closed');
        }
      },
      prefill: {
        name: "Commuter Name",
        email: "test@example.com",
        contact: "9999999999", // Adding a dummy number often triggers UPI to appear
      },
      // This tells Razorpay to prioritize or show these methods
      config: {
        display: {
          blocks: {
            upi: {
              name: "Pay via UPI",
              instruments: [
                { method: "upi" }
              ],
            },
          },
          sequence: ["block.upi", "block.cards"],
          preferences: { show_default_blocks: true },
          },
        },
    };

    const paymentData = await RazorpayCheckout.open(options);

    // 3️⃣ Verify payment (backend)
    const verifyRes = await fetch(`${API_URL}/payment/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    const verifyData = await verifyRes.json();
    if (!verifyRes.ok) throw new Error(verifyData.error);

    // 4️⃣ Fetch PAID ticket (with QR)
    const ticketRes = await fetch(
      `${API_URL}/tickets/${verifyData.ticketId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const ticket = await ticketRes.json();
    if (!ticketRes.ok) throw new Error(ticket.error);

    // 5️⃣ Navigate to QR screen
    navigation.replace("TicketQR", { ticket });

  } catch (err) {
    Alert.alert("Payment Failed", err.message || "Try again");
  }
}
