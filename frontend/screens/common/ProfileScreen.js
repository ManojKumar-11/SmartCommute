import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { role, logout } = useAuth();

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
      <Text style={styles.title}>Profile</Text>

      <Text style={styles.info}>Role: {role}</Text>

      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  info: {
    fontSize: 16,
    marginBottom: 40,
  },
  logoutBtn: {
    backgroundColor: "#DC2626",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
