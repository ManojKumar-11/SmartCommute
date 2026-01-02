import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppDrawerNavigator from "./AppDrawerNavigator";
import { useAuth } from "../context/AuthContext";

// // Navigators you already have
// import PassengerTabNavigator from "./PassengerTabNavigator";
// import ConductorTabNavigator from "./ConductorTabNavigator";

// Auth screens (you’ll add these)
import LoginScreen from "../screens/auth/LoginScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated, role, isLoading } = useAuth();

  // Prevent flicker while restoring token from secureStore
  if (isLoading) return null;

  return (
  <NavigationContainer>
    {!isAuthenticated ? (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    ) : (
      <AppDrawerNavigator />
    )}
  </NavigationContainer>
);

}
