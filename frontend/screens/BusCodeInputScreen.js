import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

export default function BusCodeInputScreen({ navigation }) {
  const [busCode, setBusCode] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.helper}>
            Enter the bus code shown inside the bus
        </Text>


      <TextInput
        style={styles.input}
        placeholder="e.g. SC-001"
        value={busCode}
        onChangeText={setBusCode}
        autoCapitalize="characters"
        autoFocus
      />

      <Pressable
        style={styles.button}
        onPress={() =>
          navigation.navigate("SelectStops", { busCode })
        }
        disabled={!busCode}
      >
        <Text style={styles.buttonText}>Get Stops List</Text>
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 20, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  button: {
    backgroundColor: "#1E3A8A",
    padding: 14,
    borderRadius: 8,
    alignItems: "center"
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  helper: {
  fontSize: 18,
  color: "#6B7280",
  textAlign: "center",
  marginBottom: 16,
}

});
