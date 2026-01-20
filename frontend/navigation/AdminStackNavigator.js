import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ManageBusesScreen from '../screens/admin/ManageBusesScreen';
import AddBusScreen from '../screens/admin/AddBusScreen';
import BusDetailsScreen from '../screens/admin/BusDetailsScreen';
import ManageConductorsScreen from '../screens/admin/ManageConductorsScreen';
import AddConductorScreen from '../screens/admin/AddConductorScreen';

const Stack = createNativeStackNavigator();

export default function AdminStackNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="ManageBuses" component={ManageBusesScreen} />
            <Stack.Screen
                name="AddBus"
                component={AddBusScreen}
                options={{ headerShown: false, title: 'Add New Bus' }}
            />
            <Stack.Screen
                name="BusDetails"
                component={BusDetailsScreen}
                options={{ headerShown: false, title: 'Edit Bus' }}
            />
            <Stack.Screen name="ManageConductors" component={ManageConductorsScreen} />
            <Stack.Screen
                name="AddConductor"
                component={AddConductorScreen}
                options={{ headerShown: false, title: 'Add New Conductor' }}
            />
        </Stack.Navigator>
    );
}
