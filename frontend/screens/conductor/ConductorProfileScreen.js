import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function ConductorProfileScreen() {
  const { logout } = useAuth();

  function handleLogout() {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conductor Profile</Text>

      <Text style={styles.info}>Conductor ID: CND-001</Text>
      <Text style={styles.info}>Bus: SC-004</Text>

      <TouchableOpacity 
        style={styles.logoutBtn} 
        activeOpacity={0.7}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
