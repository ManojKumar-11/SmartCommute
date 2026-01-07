import QRCode from "react-native-qrcode-svg";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";

export default function ActiveTicketsScreen({ navigation, route }) {
  const tickets = Array.isArray(route.params?.tickets)
  ? route.params.tickets
  : [];


  if (tickets.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No active tickets</Text>
      </View>
    );
  }
  console.log("tickets type:", Array.isArray(tickets), tickets);

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
    <FlatList
      contentContainerStyle={styles.list}
      data={tickets}
      keyExtractor={(item) => item._id}
     renderItem={({ item }) => (
        <Pressable
            style={styles.card}
            onPress={() =>
            navigation.navigate("TicketQR", { ticket: item })
            }
        >
            <View style={styles.cardContent}>

            {/* Left: Ticket info */}
            <View style={styles.infoSection}>
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
        </Pressable>
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
  }
});
