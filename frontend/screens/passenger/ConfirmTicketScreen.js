import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { payForTicket } from "../../services/paymentService";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ConfirmTicketScreen({ route, navigation }) {
  const { token } = useAuth();
  const { busCode, boardingStop, destinationStop } = route.params;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const confirmAndPay = async () => {
    setLoading(true);
    setError("");

    try {
      // 1️⃣ Create ticket (PENDING)
      const res = await fetch(`${API_URL}/tickets/buy-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          busCode,
          boardingStop,
          destinationStop
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // 2️⃣ Start payment
      await payForTicket({
        ticketId: data.ticketId,
        token,
        navigation
      });

    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Bus</Text>
      <Text style={styles.value}>{busCode}</Text>

      <Text style={styles.label}>Boarding</Text>
      <Text style={styles.value}>{boardingStop}</Text>

      <Text style={styles.label}>Destination</Text>
      <Text style={styles.value}>{destinationStop}</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={confirmAndPay}>
        <Text style={styles.buttonText}>Pay & Get Ticket</Text>
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 10
  },
  value: {
    fontSize: 16,
    fontWeight: "600"
  },
  info: {
    marginTop: 6,
    fontSize: 14
  },
  button: {
    marginTop: 24,
    backgroundColor: "#1E3A8A",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600"
  },
  doneBtn: {
    marginTop: 24,
    padding: 12
  },
  doneText: {
    color: "#1E3A8A",
    fontWeight: "600"
  },
  error: {
    color: "red",
    marginTop: 12
  }
});

