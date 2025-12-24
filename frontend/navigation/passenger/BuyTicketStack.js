import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BuyTicketEntryScreen from "../../screens/passenger/BuyTicketEntryScreen";
import BusCodeInputScreen from "../../screens/passenger/BusCodeInputScreen";
import SelectStopsScreen from "../../screens/passenger/SelectStopsScreen";
import ConfirmTicketScreen from "../../screens/passenger/ConfirmTicketScreen";
import ActiveTicketsScreen from "../../screens/passenger/ActiveTicketsScreen";
import TicketQRScreen from "../../screens/passenger/TicketQRScreen";
import BusQRScanScreen from "../../screens/passenger/BusQRScanScreen";

const Stack = createNativeStackNavigator();

export default function BuyTicketStack() {
  return (
    <Stack.Navigator>
      {/* Entry screen → tabs visible */}
      <Stack.Screen
        name="BuyTicketEntry"
        component={BuyTicketEntryScreen}
        options={{ title: "Buy Ticket" }}
      />
      <Stack.Screen
        name="BusCodeInput"
        component={BusCodeInputScreen}
        options={{ title: "Enter Bus Code" }}
      />
      <Stack.Screen
        name="SelectStops"
        component={SelectStopsScreen}
        options={{ title: "Select Stops" }}
      />
      <Stack.Screen
      name="ConfirmTicket"
      component={ConfirmTicketScreen}
      options={{ title: "Confirm Ticket" }}
    />
      <Stack.Screen
      name="ActiveTickets"
      component={ActiveTicketsScreen}
      options={{ title: "Active Tickets" }}
      />
      <Stack.Screen
      name="TicketQR"
      component={TicketQRScreen}
      options={{ title: "Your Ticket" ,
      headerBackVisible: false
  }}
    />
    <Stack.Screen
    name="BusQRScan"
    component={BusQRScanScreen}
    options={{ headerShown: false }}
  />
    </Stack.Navigator>
  );
}
