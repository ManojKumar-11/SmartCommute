import { View, Text, StyleSheet, Pressable } from "react-native";

export default function ConductorProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conductor Profile</Text>

      <Text style={styles.info}>Conductor ID: CND-001</Text>
      <Text style={styles.info}>Bus: SC-004</Text>

      <Pressable style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB"
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16
  },
  info: {
    fontSize: 14,
    marginBottom: 6
  },
  logoutBtn: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#EF4444"
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: "600"
  }
});
