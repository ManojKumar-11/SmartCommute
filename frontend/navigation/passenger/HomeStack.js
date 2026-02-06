import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../screens/passenger/HomeScreen";
import ReportLostItemScreen from "../../screens/passenger/ReportLostItemScreen";
import FeedbackScreen from "../../screens/passenger/FeedbackScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ReportLostItem"
        component={ReportLostItemScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{
          headerShown: true,
          title: "Feedback",
          headerBackTitle: "Back",
          headerTintColor: "#1E3A8A",
        }}
      />
    </Stack.Navigator>
  );
}
