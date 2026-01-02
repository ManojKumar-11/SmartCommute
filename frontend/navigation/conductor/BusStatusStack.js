import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BusStatusScreen from "../../screens/conductor/BusStatusScreen";
import StartServiceScreen from "../../screens/conductor/StartServiceScreen";
import MarkCurrentStopScreen from "../../screens/conductor/MarkCurrentStopScreen";
// later:
// import MarkCurrentStopScreen from ...
// import ViewRouteScreen from ...

const Stack = createNativeStackNavigator();

export default function BusStatusStack() {
  return (
    <Stack.Navigator
    options={{ headerShown: false }}>
      <Stack.Screen
        name="BusStatus"
        component={BusStatusScreen}
        options={{ title: "Bus Status", headerShown: false }}
      />

      <Stack.Screen
        name="StartService"
        component={StartServiceScreen}
        options={{ title: "Start Service",headerShown: false }}
      />
      <Stack.Screen
        name="MarkCurrentStop"
        component={MarkCurrentStopScreen}
        options={{ title: "Mark Current Stop",headerShown: false }}
      />

      
    </Stack.Navigator>
  );
}
