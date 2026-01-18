import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Entry / Resolver
import PassEntryScreen from "../../screens/passenger/pass/PassEntryScreen";

// Screens
import BuyNewPassScreen from "../../screens/passenger/pass/BuyNewPassScreen";
import CreatePassScreen from "../../screens/passenger/pass/CreatePassScreen";
import PaymentPendingScreen from "../../screens/passenger/pass/PaymentPendingScreen";
import PassHomeScreen from "../../screens/passenger/pass/PassHomeScreen";
import ViewPassScreen from "../../screens/passenger/pass/ViewPassScreen";
// import RenewPassScreen from "../../screens/passenger/pass/RenewPassScreen";

const Stack = createNativeStackNavigator();

export default function PassStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {/* Entry Resolver */}
      <Stack.Screen
        name="PassEntry"
        component={PassEntryScreen}
      />

      {/* No pass */}
      <Stack.Screen
        name="BuyNewPass"
        component={BuyNewPassScreen}
      />

      {/* Create pass */}
      <Stack.Screen
        name="CreatePass"
        component={CreatePassScreen}
      /> 

      {/* Payment pending (buy / renew) */}
      <Stack.Screen
        name="PaymentPending"
        component={PaymentPendingScreen}
      /> 

      {/* Active / Expired home */}
      <Stack.Screen
        name="PassHome"
        component={PassHomeScreen}
      />

      {/* View pass card + QR */}
      <Stack.Screen
        name="ViewPass"
        component={ViewPassScreen}
      /> 

      {/* Renew */}
      {/* <Stack.Screen
        name="RenewPass"
        component={RenewPassScreen}
      /> */}
    </Stack.Navigator>
  );
}
