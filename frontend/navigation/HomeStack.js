import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
  title: "Smart Commute",
  headerStyle: {
    backgroundColor: "#FFFFFF",
  },
  headerTitleStyle: {
    color: "#1E3A8A",
    fontSize: 30,
    fontWeight: "bold",
  },
  headerTitleAlign: "center",
  headerShadowVisible: false,
}}

      />
    </Stack.Navigator>
  );
}
