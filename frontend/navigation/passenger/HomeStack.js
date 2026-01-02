import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../screens/passenger/HomeScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
    screenOptions={{
      headerShown : false,
    }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown : false,
        }}
      />
    </Stack.Navigator>
  );
}
