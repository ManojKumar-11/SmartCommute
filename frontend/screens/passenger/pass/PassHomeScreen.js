import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function PassHomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { pass, user, expiresInDays } = route.params;

  const isActive = pass.status === "ACTIVE";

  return (
    <View style={styles.container}>
      {/* Status */}
      <Text style={styles.title}>
        {isActive ? "Your Pass is Active" : "Your Pass has Expired"}
      </Text>

      {/* User summary */}
      <View style={styles.userBox}>
        <Text style={styles.userText}>{user.name}</Text>
        <Text style={styles.userSubText}>
          {user.age !== null ? `${user.age} yrs` : ""}{" "}
          {user.gender ? `• ${user.gender}` : ""}
        </Text>
      </View>

      {/* Validity info */}
      {isActive ? (
        <Text style={styles.validity}>
          Expires in {expiresInDays} day{expiresInDays === 1 ? "" : "s"}
        </Text>
      ) : (
        <Text style={styles.expiredText}>
          Pass expired on{" "}
          {pass.validTill
            ? new Date(pass.validTill).toLocaleDateString()
            : ""}
        </Text>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate("ViewPass", { pass, user })
          }
        >
          <Text style={styles.primaryBtnText}>View My Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("RenewPass")}
        >
          <Text style={styles.secondaryBtnText}>Renew Pass</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center"
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20
  },
  userBox: {
    alignItems: "center",
    marginBottom: 16
  },
  userText: {
    fontSize: 18,
    fontWeight: "600"
  },
  userSubText: {
    fontSize: 14,
    color: "#555",
    marginTop: 4
  },
  validity: {
    textAlign: "center",
    fontSize: 16,
    color: "#15803D",
    marginBottom: 24
  },
  expiredText: {
    textAlign: "center",
    fontSize: 16,
    color: "#B91C1C",
    marginBottom: 24
  },
  actions: {
    gap: 12
  },
  primaryBtn: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 8
  },
  primaryBtnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600"
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#2563EB",
    padding: 14,
    borderRadius: 8
  },
  secondaryBtnText: {
    color: "#2563EB",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600"
  }
});
