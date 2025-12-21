import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BuyTicketEntryScreen from "../screens/BuyTicketEntryScreen";
import BusCodeInputScreen from "../screens/BusCodeInputScreen";
import SelectStopsScreen from "../screens/SelectStopsScreen";
import ConfirmTicketScreen from "../screens/ConfirmTicketScreen";
import ActiveTicketsScreen from "../screens/ActiveTicketsScreen";
import TicketQRScreen from "../screens/TicketQRScreen";

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
    </Stack.Navigator>
  );
}
