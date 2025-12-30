import { View, Text, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useState,useEffect} from "react";
import { useAuth } from "../../context/AuthContext";

//till we make auth
const CONDUCTOR_ID = "CND-004"; // temporary

const API_BASE = process.env.EXPO_PUBLIC_API_URL;


export default function BusStatusScreen({navigation}) {
    const { token } = useAuth();
    const [bus, setBus] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchBusStatus = async () => {
    try {
      // console.log(token);
      const res = await fetch(
        `${API_BASE}/conductor/${CONDUCTOR_ID}/bus`,{
           headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (!res.ok) {
        console.log(data.error);
        return;
      }

      setBus(data);
    } catch (err) {
      console.log("Network error");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBusStatus();
    }, [])
  );


  if (loading) {
  return (
    <View style={styles.center}>
      <Text>Loading bus status...</Text>
    </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        {/* STATUS CARD */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.statusLabel}>Service Status</Text>
              <Text
                style={[
                  styles.statusValue,
                  bus?.isActive ? styles.active : styles.inactive
                ]}
              >
                {bus?.isActive ? "ACTIVE" : "INACTIVE"}
              </Text>
            </View>
            <View
              style={[
                styles.pill,
                bus?.isActive ? styles.pillActive : styles.pillInactive
              ]}
            >
              <Text style={styles.pillText}>
                {bus?.isActive ? "On Route" : "Not Running"}
              </Text>
            </View>
          </View>
          <Text style={styles.statusHint}>
            Use the buttons below to start or end today&apos;s service.
          </Text>
        </View>

        {/* SERVICE CONTROLS */}
        <View style={styles.controlRow}>
          <Pressable
            style={[
              styles.controlBtn,
              styles.startBtn,
              bus?.isActive && styles.disabledBtn
            ]}
            disabled={bus?.isActive}
            onPress={() => {
              navigation.navigate("StartService", {
                busCode: bus?.busCode,
                stops: bus?.stops
              });
            }}
          >
            <Text style={styles.controlTitle}>Start Service</Text>
            <Text style={styles.controlSubtitle}>Go online for passengers</Text>
          </Pressable>

          <Pressable
            style={[
              styles.controlBtn,
              styles.endBtn,
              !bus?.isActive && styles.disabledBtn
            ]}
            disabled={!bus?.isActive}
            onPress={async () => {
              await fetch(`${API_BASE}/conductor/end-journey`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ busCode: bus.busCode })
              });

              fetchBusStatus(); // refresh state
            }}
          >
            <Text style={styles.controlTitle}>End Service</Text>
            <Text style={styles.controlSubtitle}>Finish today&apos;s trip</Text>
          </Pressable>
        </View>

        {/* CURRENT STOP CARD */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Current Stop</Text>
          <Text style={styles.stopLabel}>
            {/* This is what passengers will see as the boarding stop. */}
          </Text>

          <View style={styles.stopBadge}>
            <Text style={styles.stopBadgeLabel}>Now at</Text>
            <Text style={styles.stopText}>
              {bus?.currentStop ? bus.currentStop : "Not set"}
            </Text>
          </View>

          <Pressable
            style={[styles.primaryBtn, !bus?.isActive && styles.disabledBtn]}
            disabled={!bus?.isActive}
            onPress={() => {
              navigation.navigate("MarkCurrentStop", {
                busCode: bus.busCode,
                stops: bus.stops,
                currentStopIndex: bus.currentStopIndex,
                direction: bus.direction
              });
            }}
          >
            <Text style={styles.primaryText}>Mark Current Stop</Text>
          </Pressable>
        </View>
      </View>

      {/* FOOTER ACTION */}
      <View style={styles.footer}>
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => {
            // TODO: open route view
          }}
        >
          <Ionicons name="map-outline" size={20} color="#1E3A8A" />
          <Text style={styles.secondaryText}>
            View Full Route & Stops
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 35,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#EEF2FF"
  },
  center: {
    flex: 1,
    paddingHorizontal: 35,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#EEF2FF"
  },
  main: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
    gap: 20
  },

  statusCard: {
    padding: 18,
    borderRadius: 16,
    marginTop: 4,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  statusLabel: {
    fontSize: 13,
    color: "#6B7280"
  },
  statusValue: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4
  },
  active: {
    color: "#16A34A"
  },
  inactive: {
    color: "#9CA3AF"
  },
  statusHint: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999
  },
  pillActive: {
    backgroundColor: "#DCFCE7"
  },
  pillInactive: {
    backgroundColor: "#E5E7EB"
  },
  pillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#166534"
  },

  controlRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24
  },
  controlBtn: {
    width: "47%",
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.15)",
    alignItems: "flex-start",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5
  },
  startBtn: {
    backgroundColor: "#22C55E"
  },
  endBtn: {
    backgroundColor: "#EF4444"
  },
  controlTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 4
  },
  controlSubtitle: {
    color: "#E5E7EB",
    fontSize: 12
  },

  sectionCard: {
    padding: 18,
    borderRadius: 16,
    marginTop: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#111827"
  },
  stopLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 14
  },
  stopBadge: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginBottom: 14
  },
  stopBadgeLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 2
  },
  stopText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D4ED8"
  },

  primaryBtn: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "600"
  },

  footer: {
    paddingTop: 10,
    paddingBottom: 60
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "#1E3A8A",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },
  secondaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8
  },

  disabledBtn: {
    opacity: 0.5
  }
});
