import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const PASS_OPTIONS = [
  { type: "MONTHLY", days: 30 },
  { type: "QUARTERLY", days: 90 },
  { type: "YEARLY", days: 365 },
];

export default function RenewPassScreen() {
  const navigation = useNavigation();
  const { token } = useAuth();

  const [selectedType, setSelectedType] = useState("MONTHLY");
  const [loading, setLoading] = useState(false);

  const selectedOption = PASS_OPTIONS.find(
    (p) => p.type === selectedType
  );
  const amount = selectedOption.days * 70;

  async function handleRenew() {
    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/pass/renew`,
        { passType: selectedType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true",
          },
        }
      );

      navigation.replace("PaymentPending", {
        intent: res.data,
        formData : null,
      });
    } catch (err) {
      Alert.alert(
        "Renewal Failed",
        err.response?.data?.error || "Try again later"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Renew City Pass</Text>
      <Text style={styles.subtitle}>
        Choose how long you want to extend your pass
      </Text>

      {/* Pass Type Options */}
      {PASS_OPTIONS.map((option) => {
        const active = option.type === selectedType;
        return (
          <Pressable
            key={option.type}
            style={[
              styles.optionCard,
              active && styles.optionActive,
            ]}
            onPress={() => setSelectedType(option.type)}
          >
            <Text
              style={[
                styles.optionTitle,
                active && styles.optionTitleActive,
              ]}
            >
              {option.type}
            </Text>
            <Text style={styles.optionSub}>
              {option.days} days • ₹{option.days * 70}
            </Text>
          </Pressable>
        );
      })}

      {/* Amount */}
      <View style={styles.amountBox}>
        <Text style={styles.amountLabel}>Amount Payable</Text>
        <Text style={styles.amount}>₹{amount}</Text>
      </View>

      {/* CTA */}
      <Pressable
        style={[
          styles.primaryBtn,
          loading && { opacity: 0.6 },
        ]}
        onPress={handleRenew}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.primaryBtnText}>
            Proceed to Payment
          </Text>
        )}
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },

  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  optionActive: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },

  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  optionTitleActive: {
    color: "#2563EB",
  },

  optionSub: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  amountBox: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },

  amountLabel: {
    fontSize: 14,
    color: "#6B7280",
  },

  amount: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    marginTop: 4,
  },

  primaryBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
