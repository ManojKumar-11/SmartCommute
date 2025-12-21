import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./navigation/TabNavigator";
import BusQRDevScreen from "./screens/BusQrDevScreen";

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
    // <BusQRDevScreen/>
  );
}
