import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function VerifiedPassScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { user, validTill } = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#1E3A8A" />
        </Pressable>
        <Text style={styles.headerTitle}>Pass Verification</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Status */}
      <View style={styles.statusRow}>
        <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
        <Text style={styles.statusText}>VALID PASS</Text>
      </View>

      {/* Pass Card */}
      <View style={styles.card}>
        {/* Left: Details */}
        <View style={styles.details}>
          <Text style={styles.name}>{user.name}</Text>

          <Text style={styles.subText}>
            {user.age !== null ? `${user.age} yrs` : ""}{" "}
            {user.gender ? `• ${user.gender}` : ""}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.label}>Valid Till</Text>
          <Text style={styles.value}>
            {new Date(validTill).toLocaleDateString()}
          </Text>
        </View>

        {/* Right: Photo */}
        <Image
          source={{ uri: user.photoUrl }}
          style={styles.photo}
        />
      </View>

      {/* Footer note */}
      <Text style={styles.footer}>
        Verified digitally • SmartCommute
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E3A8A",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  statusText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "700",
    color: "#16A34A",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },

  details: {
    flex: 1,
    paddingRight: 12,
    justifyContent: "center",
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  subText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  photo: {
    width: 110,
    height: 140,
    borderRadius: 12,
    resizeMode: "cover",
    backgroundColor: "#E5E7EB",
  },

  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 12,
    color: "#6B7280",
  },
});
