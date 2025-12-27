import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useState } from "react";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export default function StartServiceScreen({ navigation, route }) {
  const { busCode, stops } = route.params;

  const firstIndex = 0;
  const lastIndex = stops.length - 1;

  const [startIndex, setStartIndex] = useState(null);

  const startService = async () => {
    if (startIndex === null) {
      Alert.alert("Select Starting Stop", "Please choose where the bus starts");
      return;
    }

    const direction =
      startIndex === firstIndex ? "FORWARD" : "REVERSE";

    try {
      const res = await fetch(`${API_BASE}/conductor/start-journey`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          busCode,
          direction,
          startIndex
        })
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.error || "Failed to start service");
        return;
      }

      navigation.goBack(); // BusStatusScreen will refresh via useFocusEffect
    } catch (err) {
      Alert.alert("Network Error", "Unable to start service");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus: {busCode}</Text>
      <Text style={styles.bus}></Text>

      <Text style={styles.label}>Select starting stop</Text>

      <Pressable
        style={[
          styles.option,
          startIndex === firstIndex && styles.selected
        ]}
        onPress={() => setStartIndex(firstIndex)}
      >
        <Text style={styles.optionTitle}>{stops[firstIndex]}</Text>
      </Pressable>

      <Pressable
        style={[
          styles.option,
          startIndex === lastIndex && styles.selected
        ]}
        onPress={() => setStartIndex(lastIndex)}
      >
        <Text style={styles.optionTitle}>{stops[lastIndex]}</Text>
      </Pressable>

      <Pressable style={styles.startBtn} onPress={startService}>
        <Text style={styles.startText}>Start Service</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F9FAFB"
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8
  },
  bus: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12
  },
  option: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12
  },
  selected: {
    borderColor: "#16A34A",
    backgroundColor: "#DCFCE7"
  },
  optionTitle: {
    fontWeight: "600",
    marginBottom: 4
  },
  optionSub: {
    fontSize: 13,
    color: "#6B7280"
  },
  startBtn: {
    marginTop: 30,
    backgroundColor: "#1E3A8A",
    padding: 16,
    borderRadius: 10,
    alignItems: "center"
  },
  startText: {
    color: "#FFFFFF",
    fontWeight: "600"
  }
});
