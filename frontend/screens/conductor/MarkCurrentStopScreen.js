import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList
} from "react-native";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export default function MarkCurrentStopScreen({ navigation, route }) {
  const { token } = useAuth();
  const { busCode, stops, currentStopIndex, direction } = route.params;
  const journeyStops =
    direction === "FORWARD"
      ? stops
      : [...stops].reverse();

  const getJourneyIndex = () => {
    if (currentStopIndex === null) return null;
    return direction === "FORWARD"
      ? currentStopIndex
      : stops.length - 1 - currentStopIndex;
  };
    // console.log("Direction:", direction);
    // console.log("Stops length:", stops.length);
    // console.log("Current physical index:", currentStopIndex);
    // console.log("Initial journey index:", getJourneyIndex());
  const [selectedJourneyIndex, setSelectedJourneyIndex] = useState(getJourneyIndex());

  const getPhysicalIndex = (journeyIndex) => {
    return direction === "FORWARD"
      ? journeyIndex
      : stops.length - 1 - journeyIndex;
  };

  const updateCurrentStop = async () => {
    // console.log("Selected journey index:", selectedJourneyIndex);
    if (selectedJourneyIndex === null) {
      return;
    }
    const physicalIndex = getPhysicalIndex(selectedJourneyIndex);
    //  console.log("Mapped physical index:", physicalIndex);
    await fetch(`${API_BASE}/conductor/update-current-stop`, {
      method: "POST",
      headers: { "Content-Type": "application/json" ,Authorization: `Bearer ${token}`},
      body: JSON.stringify({
        busCode,
        currentStopIndex: physicalIndex
      })
    });

    navigation.goBack(); // BusStatus refreshes via useFocusEffect
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Current Stop</Text>

      <FlatList
        data={journeyStops}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          const isCompleted =
            selectedJourneyIndex !== null &&
            index < selectedJourneyIndex;

          const isCurrent = index === selectedJourneyIndex;

          return (
            <Pressable
              style={[
                styles.stopItem,
                isCompleted && styles.completed,
                isCurrent && styles.current
              ]}
              onPress={() => {setSelectedJourneyIndex(index)
              //  {console.log("Tapped journey index:", index)}
              }}
            >
              <Text
                style={[
                  styles.stopText,
                  isCompleted && styles.completedText
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        }}
      />

      <Pressable
        style={[
          styles.confirmBtn,
          selectedJourneyIndex === null && { opacity: 0.5 }
        ]}
        disabled={selectedJourneyIndex === null}
        onPress={updateCurrentStop}
      >

        <Text style={styles.confirmText}>Confirm Current Stop</Text>
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
  stopItem: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 8
  },
  completed: {
    backgroundColor: "#E5E7EB"
  },
  current: {
    borderColor: "#16A34A",
    backgroundColor: "#DCFCE7"
  },
  stopText: {
    fontSize: 14
  },
  completedText: {
    color: "#6B7280"
  },
  confirmBtn: {
    backgroundColor: "#1E3A8A",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12
  },
  confirmText: {
    color: "#FFFFFF",
    fontWeight: "600"
  }
});
