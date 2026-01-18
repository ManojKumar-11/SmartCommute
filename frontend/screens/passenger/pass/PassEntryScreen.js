import { useCallback } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function PassEntryScreen() {
  const { token } = useAuth();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadPassState() {
        try {
          const res = await axios.get(`${API_URL}/pass/me`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              'X-Tunnel-Skip-AntiPhishing-Page': 'true',
            },
          });

          if (!isActive) return;

          const { uiState, pass, intent, user, expiresInDays } = res.data;

          switch (uiState) {
            case "NO_PASS":
              navigation.replace("BuyNewPass");
              break;

            case "CREATE_PAYMENT_PENDING":
            case "RENEW_PAYMENT_PENDING":
              navigation.replace("PaymentPending", {
                intent
              });
              break;

            case "ACTIVE_PASS":
            case "PASS_EXPIRED":
              navigation.replace("PassHome", {
                pass,
                user,
                expiresInDays
              });
              break;

            default:
              Alert.alert(
                "Error",
                "Unknown pass state. Please try again."
              );
              navigation.replace("BuyNewPass");
          }
        } catch (err) {
          console.error("PassEntry load error:", err);
          Alert.alert(
            "Error",
            "Failed to load pass details. Please try again."
          );
        }
      }

      loadPassState();

      return () => {
        isActive = false;
      };
    }, [navigation])
  );

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
