import { View, Text, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useAuth} from "../../context/AuthContext.js";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function BuyTicketEntryScreen({ navigation }) {
  const {token} = useAuth();
  const openActiveTickets = async () => {
  try {
    const url = `${API_URL}/tickets/active`;

    // console.log("Fetching:", url);
    const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" ,Authorization: `Bearer ${token}`},
      });
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
        <Text style={styles.subtitle}>
          Get a one-time ticket for the bus you are in
        </Text>
      </View>

      {/* Main Actions */}
      <View style={styles.actionSection}>
        <Pressable style={styles.scanCard} onPress={() => navigation.navigate("BusQRScan")}
          >
          <Ionicons name="qr-code-outline" size={72} color="#1E3A8A" />
          <Text style={styles.scanText}>Scan Bus QR</Text>
        </Pressable>

        <Text style={styles.or}>OR</Text>

        <Pressable style={styles.manualBtn} onPress={() => navigation.navigate("BusCodeInput")}>
          <Ionicons name="create-outline" size={22} color="#1E3A8A" />
          <Text style={styles.manualText}>Enter Bus Number</Text>
        </Pressable>
      </View>

      {/* Active Tickets Section */}
      <View style={styles.activeTicketsSection}>
        <Pressable
          style={styles.activeTicketsBtn}
          onPress={openActiveTickets}
        >
          <View style={styles.activeTicketsContent}>
            <Ionicons name="ticket-outline" size={26} color="#1E3A8A" />
            <Text style={styles.activeTicketsText}>View Active Tickets</Text>
          </View>
        </Pressable>
      </View>

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
    backgroundColor: "#F9FAFB",
  },
  header: {
    alignItems: "center",
    marginTop: 30,
    padding: 5,
    marginBottom: 24,
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
    lineHeight: 28,
  },
  actionSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  scanCard: {
    width: "100%",
    paddingVertical: 40,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scanText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  or: {
    marginVertical: 20,
    fontSize: 15,
    color: "#6B7280",
    fontWeight: "500",
  },
  manualBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#1E3A8A",
    backgroundColor: "#FFFFFF",
    minWidth: 200,
  },
  manualText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#1E3A8A",
    fontWeight: "600",
  },
  activeTicketsSection: {
    marginTop: 32,
    marginBottom: 16,
  },
  activeTicketsBtn: {
    width: "100%",
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    borderWidth: 2,
    borderColor: "#C7D2FE",
    shadowColor: "#1E3A8A",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  activeTicketsContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 22,
    paddingHorizontal: 20,
  },
  activeTicketsText: {
    marginLeft: 12,
    fontSize: 18,
    color: "#1E3A8A",
    fontWeight: "700",
  },
  footer: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: "auto",
    marginBottom: 8,
    lineHeight: 18,
  },
});
