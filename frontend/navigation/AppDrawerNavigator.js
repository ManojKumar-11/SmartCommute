import { createDrawerNavigator } from "@react-navigation/drawer";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../context/AuthContext";

import PassengerTabNavigator from "./PassengerTabNavigator";
import ConductorTabNavigator from "./ConductorTabNavigator";
import ProfileScreen from "../screens/common/ProfileScreen";

const Drawer = createDrawerNavigator();

export default function AppDrawerNavigator() {
  const { role } = useAuth();

  return (
    <Drawer.Navigator
      // screenOptions={{
      //   headerShown: true,
      // }}
      // screenOptions={{
        
      // }}
    >
      <Drawer.Screen
        name="Home"
        component={
          role === "passenger"
            ? PassengerTabNavigator
            : ConductorTabNavigator
        }
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
          // headerShadowVisible: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
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
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
