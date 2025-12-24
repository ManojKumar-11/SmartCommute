import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";

export default function StartServiceScreen({ navigation, route }) {
  // TEMP – replace with backend data
  const stops = route.params?.stops || [
    "Vizianagaram",
    "Anandapuram",
    "Madhurawada",
    "Visakhapatnam"
  ];

  const [startIndex, setStartIndex] = useState(null);
  const [direction, setDirection] = useState(null);

  const selectFirstStop = () => {
    setStartIndex(0);
    setDirection("FORWARD");
  };

  const selectLastStop = () => {
    setStartIndex(stops.length - 1);
    setDirection("REVERSE");
  };

  const handleStartService = () => {
    // TODO: call start-journey API
    // POST /api/conductor/start-journey

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Bus Service</Text>
      <Text style={styles.subtitle}>
        Select where the service starts from
      </Text>

      {/* OPTIONS */}
      <View style={styles.optionBox}>
        <Pressable
          style={[
            styles.optionBtn,
            startIndex === 0 && styles.selected
          ]}
          onPress={selectFirstStop}
        >
          <Text style={styles.optionText}>
            Start from First Stop
          </Text>
          <Text style={styles.optionSub}>
            {stops[0]}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.optionBtn,
            startIndex === stops.length - 1 && styles.selected
          ]}
          onPress={selectLastStop}
        >
          <Text style={styles.optionText}>
            Start from Last Stop
          </Text>
          <Text style={styles.optionSub}>
            {stops[stops.length - 1]}
          </Text>
        </Pressable>
      </View>

      {/* CONFIRM */}
      {startIndex !== null && (
        <View style={styles.confirmBox}>
          <Text style={styles.confirmText}>
            Starting from:{" "}
            <Text style={styles.bold}>
              {stops[startIndex]}
            </Text>
          </Text>

          <Text style={styles.confirmText}>
            Direction:{" "}
            <Text style={styles.bold}>
              {direction === "FORWARD"
                ? "Towards last stop"
                : "Towards first stop"}
            </Text>
          </Text>

          <Pressable
            style={styles.confirmBtn}
            onPress={handleStartService}
          >
            <Text style={styles.confirmBtnText}>
              Confirm & Start Service
            </Text>
          </Pressable>
        </View>
      )}
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
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24
  },

  optionBox: {
    marginBottom: 24
  },
  optionBtn: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12
  },
  selected: {
    borderColor: "#22C55E",
    backgroundColor: "#ECFDF5"
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600"
  },
  optionSub: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4
  },

  confirmBox: {
    marginTop: 12
  },
  confirmText: {
    fontSize: 14,
    marginBottom: 6
  },
  bold: {
    fontWeight: "600"
  },
  confirmBtn: {
    marginTop: 16,
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center"
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontWeight: "600"
  }
});
