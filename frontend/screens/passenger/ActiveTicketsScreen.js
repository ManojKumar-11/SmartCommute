import QRCode from "react-native-qrcode-svg";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ActiveTicketsScreen({ navigation, route }) {
  const { token } = useAuth();
  const initialTickets = Array.isArray(route.params?.tickets)
    ? route.params.tickets
    : [];

  const [tickets, setTickets] = useState(initialTickets);
  const [refreshing, setRefreshing] = useState(false);

  const fetchActiveTickets = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/tickets/active`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          'X-Tunnel-Skip-AntiPhishing-Page': 'true',
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setTickets(data);
      }
    } catch (err) {
      console.log("Active tickets fetch error:", err);
    }
  }, [token]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchActiveTickets();
    setRefreshing(false);
  }, [fetchActiveTickets]);

  if (tickets.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No active tickets</Text>
        <TouchableOpacity onPress={onRefresh} style={[styles.retryBtn, { marginTop: 20 }]}>
          <Text style={styles.retryText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <FlatList
        contentContainerStyle={styles.list}
        data={tickets}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate("TicketQR", { ticket: item })
            }
          >
            <View style={styles.cardContent}>

              {/* Left: Ticket info */}
              <View style={styles.infoSection}>
                <Text style={styles.ticketNo}>{item.ticketNo}</Text>
                <Text style={styles.bus}>{item.busCode}</Text>

                <Text style={styles.route}>
                  {item.boardingStop} → {item.destinationStop}
                </Text>

                <Text style={styles.meta}>
                  ₹{item.fare} ·{" "}
                  <Text style={item.isUsed ? styles.used : styles.valid}>
                    {item.isUsed ? "USED" : "VALID"}
                  </Text>
                </Text>

                <Text style={styles.date}>
                  {new Date(item.validTill).toLocaleDateString()}
                </Text>
                <Text style={styles.time}>
                  Valid till {new Date(item.validTill).toLocaleTimeString()}
                </Text>
              </View>

              {/* Right: QR preview */}
              <View style={styles.qrPreview}>
                <QRCode
                  value={item._id}
                  size={60}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  list: {
    padding: 16
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  infoSection: {
    flex: 1,
    paddingRight: 12
  },

  ticketNo: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1E3A8A",
    marginBottom: 2,
    letterSpacing: 0.5
  },

  bus: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4
  },

  route: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6
  },

  meta: {
    fontSize: 13,
    marginBottom: 4
  },

  time: {
    fontSize: 12,
    color: "#6B7280"
  },

  valid: {
    color: "green",
    fontWeight: "600"
  },

  used: {
    color: "red",
    fontWeight: "600"
  },

  qrPreview: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.85
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  retryBtn: {
    backgroundColor: "#1E3A8A",
    padding: 16,
    borderRadius: 10,
    alignItems: "center"
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "600"
  }
});
