import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ConductorProfileScreen from "../../screens/conductor/ConductorProfileScreen";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator
        >
      <Stack.Screen
        name="Profile"
        component={ConductorProfileScreen}
        options={{ title: "Profile",headerShown: false }}
      />
    </Stack.Navigator>
  );
}
