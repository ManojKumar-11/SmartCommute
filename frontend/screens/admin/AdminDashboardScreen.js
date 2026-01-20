import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AdminDashboardScreen = ({ navigation }) => {
    const menuItems = [
        {
            title: "Manage Buses",
            icon: "bus",
            screen: "ManageBuses",
            color: "#3B82F6", // Blue
            description: "Add, edit, or remove buses",
        },
        {
            title: "Manage Conductors",
            icon: "people",
            screen: "ManageConductors",
            color: "#10B981", // Emerald
            description: "Oversee conductor accounts",
        },
        {
            title: "Manage Passes",
            icon: "card",
            screen: null, // Future
            color: "#F59E0B", // Amber
            description: "Handle visually impaired passes",
        },
        {
            title: "Lost & Found",
            icon: "search",
            screen: null, // Future
            color: "#EF4444", // Red
            description: "Report and track lost items",
        },
    ];

    const handlePress = (item) => {
        if (item.screen) {
            navigation.navigate(item.screen);
        } else {
            // Placeholder for future features
            alert("This feature is coming soon!");
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Admin Dashboard</Text>
                <Text style={styles.headerSubtitle}>Welcome back, Admin</Text>
            </View>

            {/* Grid Content */}
            <ScrollView contentContainerStyle={styles.gridContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => handlePress(item)}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                            <Ionicons name={item.icon} size={32} color="#FFFFFF" />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardDescription}>{item.description}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6", // Light gray background
        paddingTop: 20,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1F2937",
    },
    headerSubtitle: {
        fontSize: 16,
        color: "#6B7280",
        marginTop: 4,
    },
    gridContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3, // For Android shadow
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1F2937",
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 14,
        color: "#6B7280",
    },
});

export default AdminDashboardScreen;
