import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>

      {/* Top Content (Status + Main Actions) */}
      <View style={styles.topContent}>

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

        {/* Main Actions Section */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("BuyTicketTab")}
          >
            <Ionicons name="ticket-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>
              Buy One-Time Ticket
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("PassTab")}
          >
            <Ionicons name="card-outline" size={20} color="#1E3A8A" />
            <Text style={styles.secondaryBtnText}>
              View Pass
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions Section */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.quickActionsTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={styles.quickActionCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("ReportLostItem")}
          >
            <View style={styles.quickActionIconContainer}>
              <Ionicons name="search-outline" size={24} color="#1E3A8A" />
            </View>
            <Text style={styles.quickActionText}>Report Lost Item</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Feedback")}
          >
            <View style={styles.quickActionIconContainer}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#1E3A8A" />
            </View>
            <Text style={styles.quickActionText}>Feedback</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F9FAFB",
    justifyContent: "space-between", // Distribute space
  },

  /* Top Content Wrapper */
  topContent: {
    // Groups status and main actions at the top
  },

  /* Status */
  statusSection: {
    marginTop: 200,
    marginBottom: 100, // Add spacing below status
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16, // Slightly reduced padding
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statusText: {
    marginLeft: 12,
    fontSize: 15, // Slightly smaller font
    color: "#111827",
    fontWeight: "500",
  },

  /* Actions */
  actions: {
    // No specific styles needed for wrapper
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

  /* Quick Actions */
  quickActionsSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionCard: {
    flex: 0.48, // Two cards side by side
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionIconContainer: {
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1E3A8A",
    textAlign: "center",
  },
});
