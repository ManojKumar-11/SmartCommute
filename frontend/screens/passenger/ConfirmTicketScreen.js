import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import QRCode from "react-native-qrcode-svg";

// const API_BASE = "http://192.168.1.3:3000/api"; // change this
const API_BASE = "http://10.223.134.126:3000/api"; // change this

export default function ConfirmTicketScreen({ route, navigation }) {
  const { busCode, boardingStop, destinationStop } = route.params;

  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  // After purchase → show QR (temporary here)
  useEffect(() => {
  if (ticket) {
    navigation.replace("TicketQR", { ticket });
  }
}, [ticket]);


  
  const buyTicket = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/tickets/buy-ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "6945308f6235a613355dcbc7", // replace later
          busCode,
          boardingStop,
          destinationStop
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ticket purchase failed");
      } else {
        setTicket(data);
      }
    } catch (e) {
      setError("Network error");
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


  // Before purchase → confirmation
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Bus</Text>
      <Text style={styles.value}>{busCode}</Text>

      <Text style={styles.label}>Boarding</Text>
      <Text style={styles.value}>{boardingStop}</Text>

      <Text style={styles.label}>Destination</Text>
      <Text style={styles.value}>{destinationStop}</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={buyTicket}>
        <Text style={styles.buttonText}>Confirm & Buy Ticket</Text>
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

