import { View, Text, StyleSheet, Button } from "react-native";

export default function PassEntryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Pass</Text>

      <View style={styles.card}>
        <Text>No active pass</Text>
      </View>

      <Button title="Buy / Renew Pass" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    padding: 20,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
});
