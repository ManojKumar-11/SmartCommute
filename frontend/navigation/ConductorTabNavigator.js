import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import BusStatusStack from "./conductor/BusStatusStack";
import ScanTicketStack from "./conductor/ScanTicketStack";
import ProfileStack from "./conductor/ProfileStack";

const Tab = createBottomTabNavigator();

export default function ConductorTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#1E3A8A",
        tabBarInactiveTintColor: "#6B7280",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarStyle: {
          height: 72,
          paddingBottom: 10,
          paddingTop: 6,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
      }}
    >
      {/* LEFT TAB */}
      <Tab.Screen
        name="BusStatusTab"
        component={BusStatusStack}
        options={{
          // title: "Bus Status",
          headerShown : false,
          tabBarIcon: ({ color, focused }) => (
            <View style={{ marginBottom: 4 }}>
              <Ionicons 
                name={focused ? "bus" : "bus-outline"} 
                size={24} 
                color={color} 
              />
            </View>
          ),
        }}
      />

      {/* CENTER TAB – PRIMARY ACTION */}
      <Tab.Screen
        name="ScanTicketTab"
        component={ScanTicketStack}
        options={{
          // title: "Scan Ticket",
          headerShown : false,
          tabBarIcon: ({ color, focused }) => (
            <View style={{ marginBottom: 2 }}>
              <Ionicons 
                name={focused ? "qr-code" : "qr-code-outline"} 
                size={26} 
                color={color} 
              />
            </View>
          ),
        }}
      />

      {/* RIGHT TAB */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          headerShown : false,
          // title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ marginBottom: 4 }}>
              <Ionicons 
                name={focused ? "person-circle" : "person-circle-outline"} 
                size={26} 
                color={color} 
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
