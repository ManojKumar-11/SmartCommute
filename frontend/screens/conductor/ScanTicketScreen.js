import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useEffect, useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");
const SCAN_AREA_SIZE = width * 0.7;

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export default function ScanTicketScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const lastScannedData = useRef(null);
  const [alertModal, setAlertModal] = useState(null);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: SCAN_AREA_SIZE - 4,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Ionicons name="camera-outline" size={64} color="#1E3A8A" />
        <Text style={styles.permissionText}>Camera permission is required</Text>
        <Pressable style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const handleScan = async ({ data }) => {
    if (scanned) return;
    
    // Prevent re-scanning the same QR code immediately
    if (lastScannedData.current === data) return;
    
    setScanned(true);
    lastScannedData.current = data;

    let payload;
    try {
      payload = JSON.parse(data);
    } catch {
      setAlertModal({
        type: "invalid",
        title: "Invalid QR",
        message: "Unrecognized Ticket"
      });
      setTimeout(() => {
        setScanned(false);
        lastScannedData.current = null;
        setAlertModal(null);
      }, 3000);
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
        // Check if it's already verified (409 status)
        if (res.status === 409) {
          setAlertModal({
            type: "alreadyVerified",
            title: "Already Verified",
            message: result.error || "This ticket has already been used"
          });
        } else {
          // Other invalid cases (expired, tampered, not found, etc.)
          setAlertModal({
            type: "invalid",
            title: "INVALID",
            message: result.error || "Ticket rejected"
          });
        }
      } else {
        // Valid ticket
        setAlertModal({
          type: "valid",
          title: "VALID TICKET",
          message: `₹${result.fare}\n${result.boardingStop} → ${result.destinationStop}`
        });
      }
    } catch (err) {
      setAlertModal({
        type: "invalid",
        title: "Error",
        message: "Network error"
      });
    }

    setTimeout(() => {
      setScanned(false);
      lastScannedData.current = null;
      setAlertModal(null);
    }, 3000);
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

      {/* Top Header */}
      <View style={styles.header}>
        {navigation && (
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
        )}
        <Text style={styles.headerText}>Scan Ticket QR Code</Text>
        <View style={styles.backButton} />
      </View>

      {/* Overlay with scanning window */}
      <View style={styles.overlay}>
        {/* Top overlay */}
        <View style={[styles.overlaySection, { height: (height - SCAN_AREA_SIZE) / 2 - 60 }]} />
        
        {/* Middle section with scanning window */}
        <View style={styles.middleSection}>
          {/* Left overlay */}
          <View style={[styles.overlaySection, { width: (width - SCAN_AREA_SIZE) / 2 }]} />
          
          {/* Scanning window */}
          <View style={styles.scanWindow}>
            {/* Corner indicators */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            
            {/* Scanning line */}
            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [{ translateY: scanLineAnim }],
                },
              ]}
            />
          </View>
          
          {/* Right overlay */}
          <View style={[styles.overlaySection, { width: (width - SCAN_AREA_SIZE) / 2 }]} />
        </View>
        
        {/* Bottom overlay */}
        <View style={[styles.overlaySection, { height: (height - SCAN_AREA_SIZE) / 2 }]} />
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Position the ticket QR code within the frame
        </Text>
        <Text style={styles.instructionSubtext}>
          Make sure the QR code is clear and well-lit
        </Text>
      </View>

      {/* Custom Alert Modal */}
      {alertModal && (
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContainer,
            alertModal.type === "valid" && styles.modalValid,
            alertModal.type === "alreadyVerified" && styles.modalAlreadyVerified,
            alertModal.type === "invalid" && styles.modalInvalid
          ]}>
            {/* Icon */}
            <View style={[
              styles.modalIconContainer,
              alertModal.type === "valid" && styles.modalIconValid,
              alertModal.type === "alreadyVerified" && styles.modalIconAlreadyVerified,
              alertModal.type === "invalid" && styles.modalIconInvalid
            ]}>
              {alertModal.type === "valid" && (
                <Ionicons name="checkmark-circle" size={64} color="#16A34A" />
              )}
              {alertModal.type === "alreadyVerified" && (
                <Ionicons name="warning" size={64} color="#F97316" />
              )}
              {alertModal.type === "invalid" && (
                <Ionicons name="close-circle" size={64} color="#DC2626" />
              )}
            </View>

            {/* Title */}
            <Text style={[
              styles.modalTitle,
              alertModal.type === "valid" && styles.modalTitleValid,
              alertModal.type === "alreadyVerified" && styles.modalTitleAlreadyVerified,
              alertModal.type === "invalid" && styles.modalTitleInvalid
            ]}>
              {alertModal.title}
            </Text>

            {/* Message */}
            <Text style={[
              styles.modalMessage,
              alertModal.type === "valid" && styles.modalMessageValid,
              alertModal.type === "alreadyVerified" && styles.modalMessageAlreadyVerified,
              alertModal.type === "invalid" && styles.modalMessageInvalid
            ]}>
              {alertModal.message}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  overlaySection: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  middleSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  scanWindow: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#1E3A8A",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#1E3A8A",
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  instructions: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  instructionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  instructionSubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 24,
  },
  permissionText: {
    fontSize: 18,
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  permissionBtn: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
  },
  permissionBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContainer: {
    width: width * 0.85,
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalValid: {
    backgroundColor: "#DCFCE7",
    borderWidth: 2,
    borderColor: "#86EFAC",
  },
  modalAlreadyVerified: {
    backgroundColor: "#FFF7ED",
    borderWidth: 2,
    borderColor: "#FED7AA",
  },
  modalInvalid: {
    backgroundColor: "#FEE2E2",
    borderWidth: 2,
    borderColor: "#FCA5A5",
  },
  modalIconContainer: {
    marginBottom: 16,
  },
  modalIconValid: {
    // Icon color handled inline
  },
  modalIconAlreadyVerified: {
    // Icon color handled inline
  },
  modalIconInvalid: {
    // Icon color handled inline
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  modalTitleValid: {
    color: "#166534",
  },
  modalTitleAlreadyVerified: {
    color: "#C2410C",
  },
  modalTitleInvalid: {
    color: "#991B1B",
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  modalMessageValid: {
    color: "#15803D",
  },
  modalMessageAlreadyVerified: {
    color: "#EA580C",
  },
  modalMessageInvalid: {
    color: "#B91C1C",
  },
});
