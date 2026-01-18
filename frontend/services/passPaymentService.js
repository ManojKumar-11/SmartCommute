import RazorpayCheckout from "react-native-razorpay";
import { Alert } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function payForPass({ intentId, token, navigation }) {
  try {
    if (!intentId) {
      throw new Error("Invalid payment intent");
    }

    // 1️⃣ Create Razorpay order (PASS)
    const res = await fetch(`${API_URL}/pass/payment/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Tunnel-Skip-AntiPhishing-Page": "true"
      },
      body: JSON.stringify({ intentId })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create order");

    // 2️⃣ Open Razorpay Checkout
    const options = {
      key: data.key,
      order_id: data.orderId,
      amount: data.amount,
      currency: "INR",
      name: "SmartCommute",
      description: "City Pass Payment",
      theme: { color: "#2563EB" },

      handler: function () {
        // Razorpay auto-resolves promise
      },

      modal: {
        ondismiss: function () {
          console.log("Pass payment checkout closed");
        }
      },

      prefill: {
        name: "Passenger",
        contact: "9999999999"
      }
    };

    const paymentData = await RazorpayCheckout.open(options);

    // 3️⃣ Verify payment (PASS)
    const verifyRes = await fetch(`${API_URL}/pass/payment/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Tunnel-Skip-AntiPhishing-Page": "true"
      },
      body: JSON.stringify(paymentData)
    });

    const verifyData = await verifyRes.json();
    if (!verifyRes.ok) {
      throw new Error(verifyData.error || "Payment verification failed");
    }

    Alert.alert("Success", "Pass activated successfully");

    // 4️⃣ IMPORTANT: Go back to resolver
    navigation.replace("PassEntry");

  } catch (err) {
    // Check if user cancelled the payment
    if (err.code === 0) {
      console.log("Pass payment cancelled by user");
      Alert.alert("Payment Cancelled", "You cancelled the payment. You can try again.");
      return;
    }
    console.error("Pass payment error:", err);
    Alert.alert(
      "Payment Failed",
      err.message || "Please try again"
    );
  }
}
