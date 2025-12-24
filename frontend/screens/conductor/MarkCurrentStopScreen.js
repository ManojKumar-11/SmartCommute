import { View, Text, StyleSheet, Pressable, FlatList, Alert } from "react-native";
import { useState } from "react";

export default function MarkCurrentStopScreen({ navigation, route }) {
  const { busCode, stops, currentStopIndex } = route.params;

  const [selectedIndex, setSelectedIndex] = useState(currentStopIndex);

  const confirmUpdate = () => {
    if (selectedIndex > currentStopIndex) {
      Alert.alert(
        "Confirm Update",
        "You are moving ahead of the current stop. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Confirm", onPress: updateStop }
        ]
      );
    } else {
      updateStop();
    }
  };

  const updateStop = async () => {
    try {
      const res = await fetch(
        "http://YOUR_IP:3000/api/conductor/update-stop",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            busCode,
            currentStopIndex: selectedIndex
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.error || "Failed to update stop");
        return;
      }

      navigation.goBack();
    } catch {
      Alert.alert("Error", "Network error");
    }
  };

  const renderItem = ({ item, index }) => {
    let style = styles.stop;

    if (index < currentStopIndex) style = styles.completed;
    if (index === selectedIndex) style = styles.selected;

    return (
      <Pressable onPress={() => setSelectedIndex(index)}>
        <Text style={style}>{item}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Current Stop</Text>

      <FlatList
        data={stops}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
      />

      <Pressable style={styles.confirmBtn} onPress={confirmUpdate}>
        <Text style={styles.confirmText}>Confirm Update</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9FAFB"
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12
  },
  stop: {
    padding: 14,
    fontSize: 15,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB"
  },
  completed: {
    padding: 14,
    fontSize: 15,
    color: "#9CA3AF"
  },
  selected: {
    padding: 14,
    fontSize: 15,
    backgroundColor: "#DCFCE7",
    fontWeight: "600"
  },
  confirmBtn: {
    marginTop: 16,
    backgroundColor: "#1E3A8A",
    padding: 14,
    borderRadius: 8,
    alignItems: "center"
  },
  confirmText: {
    color: "#FFFFFF",
    fontWeight: "600"
  }
});
