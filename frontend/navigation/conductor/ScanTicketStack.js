import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ScanScreen from "../../screens/conductor/ScanScreen";
import VerifiedPassScreen from "../../screens/conductor/VerifiedPassScreen";
const Stack = createNativeStackNavigator();

export default function ScanTicketStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ScanTicket"
        component={ScanScreen}
        options={{ title: "Scan Ticket" ,headerShown: false }}
      />
      <Stack.Screen
        name="VerifiedPassScreen"
        component={ScanScreen}
        options={{ title: "Scan Ticket" ,headerShown: false }}
      />
    </Stack.Navigator>
  );
}
