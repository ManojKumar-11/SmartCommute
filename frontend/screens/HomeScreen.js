import { View, Text, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      
      {/* Status Section */}
      <View style={styles.statusSection}>
        <View style={styles.statusCard}>
          <Ionicons
            name="information-circle-outline"
            size={26}
            color="#1E3A8A"
          />
          <Text style={styles.statusText}>
            No active ticket or pass
          </Text>
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.actions}>
        <Pressable
          style={styles.primaryBtn}
          onPress={() => navigation.navigate("BuyTicketTab")}
        >
          <Ionicons name="ticket-outline" size={20} color="#FFFFFF" />
          <Text style={styles.primaryBtnText}>
            Buy One-Time Ticket
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate("PassTab")}
        >
          <Ionicons name="card-outline" size={20} color="#1E3A8A" />
          <Text style={styles.secondaryBtnText}>
            View Pass
          </Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F9FAFB",
  },

  /* Status */
  statusSection: {
    flex: 1,
    justifyContent: "center",
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statusText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },

  /* Actions */
  actions: {
    marginBottom: 30,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#1E3A8A",
    marginBottom: 14,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E3A8A",
  },
  secondaryBtnText: {
    color: "#1E3A8A",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
