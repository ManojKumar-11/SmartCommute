import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../context/AuthContext";

// Navigators you already have
import PassengerTabNavigator from "./PassengerTabNavigator";
import ConductorTabNavigator from "./ConductorTabNavigator";

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
        // NOT logged in → Auth flow
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      ) : role === "passenger" ? (
        <PassengerTabNavigator />
      ) : role === "conductor" ? (
        <ConductorTabNavigator />
      ) : (
        // Admin later
        null
      )}
    </NavigationContainer>
  );
}
