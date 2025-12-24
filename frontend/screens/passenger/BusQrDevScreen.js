import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function BusQRDevScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus QR – SC-004</Text>
      <QRCode value="SC-004" size={200} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 18,
    marginBottom: 20
  }
});

