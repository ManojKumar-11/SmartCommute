import { View, Text, StyleSheet, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";

const API_BASE = "http://192.168.1.3:3000/api";

export default function ScanTicketScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera permission required</Text>
        <Text onPress={requestPermission} style={styles.link}>
          Grant Permission
        </Text>
      </View>
    );
  }

  const handleScan = async ({ data }) => {
    if (scanned) return;
    setScanned(true);

    let payload;
    try {
      payload = JSON.parse(data);
    } catch {
      Alert.alert("Invalid QR", "Unrecognized ticket");
      setScanned(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/tickets/verify-ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (!res.ok) {
        Alert.alert("INVALID", result.error || "Ticket rejected");
      } else {
        Alert.alert(
          "VALID TICKET",
          `₹${result.fare}\n${result.boardingStop} → ${result.destinationStop}`
        );
      }
    } catch (err) {
      Alert.alert("Error", "Network error");
    }

    setTimeout(() => setScanned(false), 4000);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"]
        }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      />

      <View style={styles.overlay}>
        <Text style={styles.overlayText}>
          Scan passenger ticket QR
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  overlay: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
    borderRadius: 8
  },
  overlayText: {
    color: "#fff",
    fontWeight: "600"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  link: {
    marginTop: 12,
    color: "#2563EB"
  }
});
