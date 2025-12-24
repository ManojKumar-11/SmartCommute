import { View, Text, StyleSheet } from "react-native";

export default function ScanTicketScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Ticket</Text>
      <Text style={styles.subtitle}>
        Scan passenger ticket QR here
      </Text>
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
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280"
  }
});
