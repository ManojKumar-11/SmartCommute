import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BusStatusScreen from "../../screens/conductor/BusStatusScreen";
import StartServiceScreen from "../../screens/conductor/StartServiceScreen";
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
        options={{ title: "Start Service" }}
      />

      {/* 
      Future screens (do NOT add now)
      <Stack.Screen name="MarkCurrentStop" component={...} />
      <Stack.Screen name="ViewRoute" component={...} />
      */}
    </Stack.Navigator>
  );
}
