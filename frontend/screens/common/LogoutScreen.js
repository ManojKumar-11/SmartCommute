import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function LogoutScreen() {
  const { logout } = useAuth();

  function handleLogout() {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            // NO navigation here
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>You are logged in</Text>

      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  text: {
    fontSize: 18,
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#DC2626",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
