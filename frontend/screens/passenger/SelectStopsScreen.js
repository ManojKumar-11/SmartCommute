import { ScrollView,View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

// const API_BASE = "http://192.168.1.3:3000/api"; // change this
const API_BASE = "http://10.223.134.126:3000/api"; // latpop ip on phone hotspot

export default function SelectStopsScreen({ route, navigation }) {
  const { busCode } = route.params;

  const [loading, setLoading] = useState(true);
  const [boardingStop, setBoardingStop] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/bus/${busCode}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setBoardingStop(data.boardingStop);
          setDestinations(data.destinationStops);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load bus data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
    >
        <Text style={styles.label}>Boarding Stop</Text>
        <View style={styles.lockedBox}>
            <Text style={styles.lockedText}>{boardingStop}</Text>
        </View>

        <Text style={styles.label}>Select Destination</Text>

        {destinations.map(stop => (
            <Pressable
            key={stop}
            style={[
                styles.stopItem,
                selectedDestination === stop && styles.selected
            ]}
            onPress={() => setSelectedDestination(stop)}
            >
            <Text>{stop}</Text>
            </Pressable>
        ))}
      </ScrollView>  
        <View style={styles.footer}>
            <Pressable
                style={[
                styles.button,
                !selectedDestination && styles.disabled
                ]}
                disabled={!selectedDestination}
                onPress={() =>
                navigation.navigate("ConfirmTicket", {
                    busCode,
                    boardingStop,
                    destinationStop: selectedDestination
                })
                }
            >
                <Text style={styles.buttonText}>Proceed</Text>
            </Pressable>
        </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F9FAFB",
    paddingBottom : 40
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120 // IMPORTANT
    },
  footer: {
  padding: 16,
  borderTopWidth: 1,
  borderColor: "#E5E7EB",
  backgroundColor: "#FFFFFF"
},
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 6
  },
  lockedBox: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#E5E7EB"
  },
  lockedText: {
    fontWeight: "600"
  },
  stopItem: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 10
  },
  selected: {
    borderColor: "#1E3A8A",
    backgroundColor: "#DBEAFE"
  },
  button: {
  backgroundColor: "#1E3A8A",
  padding: 16,
  borderRadius: 10,
  alignItems: "center"
},
  disabled: {
    backgroundColor: "#9CA3AF"
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600"
  },
  error: {
    color: "red"
  }
});
