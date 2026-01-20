import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
export default function BuyNewPassScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>No Pass Found</Text>

      {/* Description */}
      <Text style={styles.description}>
        You don’t have an active city pass.
        {"\n"}Buy a new pass to travel seamlessly.
      </Text>

      <TouchableOpacity
        style={styles.primaryBtn}
        activeOpacity={0.7}
        onPress={() => navigation.navigate("CreatePass")}
      >
        <Text style={styles.primaryBtnText}>Buy New Pass</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12
  },
  description: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22
  },
  primaryBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  }
});
