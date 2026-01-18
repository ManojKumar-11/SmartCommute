import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import QRCode from "react-native-qrcode-svg";

export default function ViewPassScreen() {
  const route = useRoute();
  const { pass, user } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* PASS CARD */}
      <View style={styles.card}>
        {/* Left details */}
        <View style={styles.details}>
          <Text style={styles.cardTitle}>City Bus Pass</Text>

          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user.name}</Text>

          <Text style={styles.label}>Age / Gender</Text>
          <Text style={styles.value}>
            {user.age !== null ? `${user.age} yrs` : "--"} /{" "}
            {user.gender || "--"}
          </Text>

          <Text style={styles.label}>District</Text>
          <Text style={styles.value}>{pass.district}</Text>

          <Text style={styles.label}>Valid Till</Text>
          <Text style={styles.value}>
            {new Date(pass.validTill).toLocaleDateString()}
          </Text>
        </View>

        {/* Right photo */}
        <View style={styles.photoBox}>
          <Image
            source={{ uri: user.photoUrl }}
            style={styles.photo}
          />
        </View>
      </View>

      {/* QR SECTION */}
      <View style={styles.qrSection}>
        <Text style={styles.qrTitle}>Scan for Verification</Text>

        <View style={styles.qrBox}>
          <QRCode
            value={JSON.stringify({
              type: "PASS",
              passId: pass.id,
              qrSignature: pass.qrSignature
            })}
            size={220}
          />
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8FAFC"
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    marginBottom: 30
  },

  details: {
    flex: 1,
    paddingRight: 10
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#1E3A8A"
  },

  label: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 6
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A"
  },

  photoBox: {
    width: 90,
    alignItems: "center",
    justifyContent: "center"
  },

  photo: {
    width: 80,
    height: 100,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CBD5E1"
  },

  qrSection: {
    alignItems: "center"
  },

  qrTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16
  },

  qrBox: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3
  }
});
