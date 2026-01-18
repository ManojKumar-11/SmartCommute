import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../../../context/AuthContext";
// payment service (same pattern as ticket)
import { payForPass } from "../../../services/passPaymentService";
import { useEffect } from "react";
import { BackHandler } from "react-native";
import axios from "axios";

export default function PaymentPendingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = useAuth();

  const { intent, formData } = route.params;
  
  if (!intent || !formData) {
    Alert.alert("Error", "Invalid payment state");
    navigation.reset({
            index: 0,
            routes: [{ name: 'PassEntry' }],
    });
    return null;
  }
    // Inside PaymentPendingScreen
    useEffect(() => {
    const backAction = () => {
        handleCancel(); // Trigger the same logic as the Cancel button
        return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
    );

    return () => backHandler.remove();
    }, [intent, formData]);
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

  
    async function handleCancel() {
    Alert.alert(
        "Cancel Payment",
        "Go back to edit pass details??",
        [
        { text: "No" },
        {
            text: "Yes, Edit",
            style: "destructive",
            onPress: async () => {
            try {
                // 1. Call your DELETE endpoint to clear the pending state
                // console.log("Full URL:", `${process.env.EXPO_PUBLIC_API_URL}/pass/payment/intent/${intent.id || intent._id}`);
                await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/pass/payment/intent/${intent.intentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Tunnel-Skip-AntiPhishing-Page": "true"
                }
                });

                // 2. Navigate back to CreatePassScreen with the data
                navigation.replace("CreatePass", {
                  prefillData: {
                    name: formData.name,
                    gender: formData.gender,
                    dateOfBirth: formData.dob,
                    aadhaarNumber: formData.aadhaar,
                    bloodGroup: formData.bloodGroup,
                    district: formData.district,
                    passType: formData.passType,
                    photoUrl: formData.photoUrl
                  }
                });
            } catch (err) {
                console.error(err);
                Alert.alert("Error", "Could not cancel payment. Please try again.");
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
