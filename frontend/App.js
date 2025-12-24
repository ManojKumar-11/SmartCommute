import { NavigationContainer } from "@react-navigation/native";
import PassengerTabNavigator from "./navigation/PassengerTabNavigator";
import ConductorTabNavigator from "./navigation/ConductorTabNavigator";

import BusQRDevScreen from "./screens/passenger/BusQrDevScreen";

let userRole = "conductor";

export default function App() {
  return (
    <NavigationContainer>
      {userRole === "passenger" && <PassengerTabNavigator />}
      {userRole === "conductor" && <ConductorTabNavigator />}
    </NavigationContainer>
    // <BusQRDevScreen />
  );
}
