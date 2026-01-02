import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PassEntryScreen from "../../screens/passenger/PassEntryScreen";

const Stack = createNativeStackNavigator();

export default function PassStack() {
  return (
    <Stack.Navigator
    screenOptions={{
      headerShown : false,
    }}
    >
      <Stack.Screen
        name="PassEntry"
        component={PassEntryScreen}
        options={{ title: "My Pass" }}
      />
    </Stack.Navigator>
  );
}
