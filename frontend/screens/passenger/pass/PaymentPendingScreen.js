import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  BackHandler
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { payForPass } from "../../../services/passPaymentService";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function PaymentPendingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = useAuth();

  const { intent, formData } = route.params || {};

  if (!intent || !intent.intentId || !intent.intentType) {
    Alert.alert("Error", "Invalid payment state:)");
    navigation.reset({
      index: 0,
      routes: [{ name: "PassEntry" }]
    });
    return null;
  }

  // 🔙 Handle hardware back
  useEffect(() => {
    const backAction = () => {
      handleCancel();
      return true;
    };

    const handler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => handler.remove();
  }, [intent]);

  // -------------------------
  // Continue payment
  // -------------------------
  async function handleContinuePayment() {
    try {
      await payForPass({
        intentId: intent.intentId,
        token,
        navigation
      });
    } catch (err) {
      Alert.alert("Payment Failed", err.message || "Try again");
    }
  }

  // -------------------------
  // Cancel logic (CREATE vs RENEW)
  // -------------------------
  async function handleCancel() {
    Alert.alert(
      "Cancel Payment",
      intent.intentType === "CREATE"
        ? "Go back to edit pass details?"
        : "Cancel renewal and go back?",
      [
        { text: "No" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              // 1️⃣ Cancel intent on backend
              await axios.delete(
                 
                `${API_URL}/pass/payment/intent/${intent.intentId}`,
                // `${API_URL}/pass/payment/intent/696e3c69f5b2e569a5302eef`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Tunnel-Skip-AntiPhishing-Page": "true"
                  }
                }
              );

              // 2️⃣ Navigate appropriately
              if (intent.intentType === "CREATE") {
                navigation.replace("CreatePass", {
                  prefillData: formData
                });
              } else {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "PassEntry" }]
                });
              }
            } catch (err) {
              Alert.alert(
                "Error",
                "Could not cancel payment. Try again."
              );
            }
          }
        }
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Pending</Text>

      <Text style={styles.subtitle}>
        Complete payment to activate your city pass
      </Text>

      <View style={styles.card}>
        <Text style={styles.amountLabel}>Amount to Pay</Text>
        <Text style={styles.amount}>₹{intent.amount}</Text>
      </View>

      <Pressable
        style={styles.primaryBtn}
        onPress={handleContinuePayment}
      >
        <Text style={styles.primaryBtnText}>Continue Payment</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryBtn}
        onPress={handleCancel}
      >
        <Text style={styles.secondaryBtnText}>Cancel</Text>
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center"
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 24
  },
  card: {
    backgroundColor: "#F1F5F9",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30
  },
  amountLabel: {
    fontSize: 14,
    color: "#555"
  },
  amount: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 6
  },
  primaryBtn: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12
  },
  primaryBtnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600"
  },
  secondaryBtn: {
    padding: 14,
    borderRadius: 8
  },
  secondaryBtnText: {
    color: "#B91C1C",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600"
  }
});
