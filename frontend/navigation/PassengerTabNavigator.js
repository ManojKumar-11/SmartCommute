import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./passenger/HomeStack";
import BuyTicketStack from "./passenger/BuyTicketStack";
import PassStack from "./passenger/PassStack";
import Ionicons from "@expo/vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

export default function PassengerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#1E3A8A",   // Primary Blue
        tabBarInactiveTintColor: "#6B7280", // Muted Gray,
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12
        },
        tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopColor: "#E5E7E9",
        }

      }}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} 
      options={{ title: "Home" ,
            tabBarIcon : ({color,size})=> <Ionicons name="home" size ={size} color = {color}></Ionicons>
      }} />
      <Tab.Screen name="BuyTicketTab" component={BuyTicketStack} options={{ title: "Buy Ticket",
                    tabBarIcon : ({color,size})=> <Ionicons name="ticket" size ={size} color = {color}></Ionicons>
       }} />
      <Tab.Screen name="PassTab" component={PassStack} options={{ title: "Pass" ,
                    tabBarIcon : ({color,size})=> <Ionicons name="card-outline" size ={size} color = {color}></Ionicons>
      }}
      />
    </Tab.Navigator>
  );
}
