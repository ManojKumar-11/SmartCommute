const USER_ID = "6945308f6235a613355dcbc7"; // same valid ObjectId you used earlier
const API_BASE = "http://192.168.1.3:3000/api";

import { View, Text, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";


export default function BuyTicketEntryScreen({ navigation }) {
  const openActiveTickets = async () => {
  try {
    const url = `${API_BASE}/tickets/active/${USER_ID}`;
    // console.log("Fetching:", url);
    const res = await fetch(url);
    // console.log("Status:", res.status);
    const tickets = await res.json();
    // console.log("Tickets:", tickets);
    navigation.navigate("ActiveTickets", { tickets });
  } catch (err) {
    console.log("Active tickets fetch error:", err);
  }
};

  return (
    <View style={styles.container}>
      
      {/* Header Context */}
      <View style={styles.header}>
        {/* <Text style={styles.title}>Buy Ticket</Text> */}
        <Text style={styles.subtitle}>
          Get a one-time ticket for the bus you are in
        </Text>
      </View>

      {/* Main Actions */}
      <View style={styles.actionSection}>
        <Pressable style={styles.scanCard} onPress={() => {}}>
          <Ionicons name="qr-code-outline" size={72} color="#1E3A8A" />
          <Text style={styles.scanText}>Scan Bus QR</Text>
        </Pressable>

        <Text style={styles.or}>OR</Text>

        <Pressable style={styles.manualBtn} onPress={() => navigation.navigate("BusCodeInput")}>
          <Ionicons name="create-outline" size={20} color="#1E3A8A" />
          <Text style={styles.manualText}>Enter Bus Number </Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.activeTicketsBtn}
        onPress={openActiveTickets}
      >
        <Ionicons name="ticket-outline" size={18} color="#1E3A8A" />
        <Text style={styles.activeTicketsText}>View Active Tickets</Text>
      </Pressable>


      {/* Footer Note */}
      <Text style={styles.footer}>
        Ticket will be valid only for this bus
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
  },
  header: {
    alignItems: "center",
    marginTop: 60,
    padding : 5
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
  fontSize: 20,
  color: "#6B7280",
  marginTop: 5,
  textAlign: "center",
  lineHeight: 20,
},
  actionSection: {
    alignItems: "center",
  },
  scanCard: {
    width: "100%",
    paddingVertical: 30,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  scanText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  or: {
    marginVertical: 14,
    fontSize: 14,
    color: "#6B7280",
  },
  manualBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1E3A8A",
  },
  manualText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#1E3A8A",
    fontWeight: "500",
  },
  footer: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  activeTicketsBtn: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 18,
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 8,
  backgroundColor: "#EEF2FF",
},

activeTicketsText: {
  marginLeft: 8,
  fontSize: 14,
  color: "#1E3A8A",
  fontWeight: "500",
},

});
