import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ConductorTabNavigator from "../ConductorTabNavigator";
import StartServiceScreen from "../../screens/conductor/StartServiceScreen";

const Stack = createNativeStackNavigator();

export default function ConductorStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ConductorTabs"
        component={ConductorTabNavigator}
      />
      <Stack.Screen
        name="StartService"
        component={StartServiceScreen}
      />
    </Stack.Navigator>
  );
}
