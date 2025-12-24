import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ScanTicketScreen from "../../screens/conductor/ScanTicketScreen";

const Stack = createNativeStackNavigator();

export default function ScanTicketStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ScanTicket"
        component={ScanTicketScreen}
        options={{ title: "Scan Ticket" }}
      />
    </Stack.Navigator>
  );
}
