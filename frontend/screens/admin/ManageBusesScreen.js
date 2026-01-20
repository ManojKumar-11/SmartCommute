import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    RefreshControl,
    StatusBar,
    TextInput,
} from "react-native";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ManageBusesScreen({ navigation }) {
    const { token } = useAuth();
    const [buses, setBuses] = useState([]);
    const [filteredBuses, setFilteredBuses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch buses
    const fetchBuses = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/all-buses`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBuses(res.data);
            setFilteredBuses(res.data); // Initialize filtered list
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to load buses");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchBuses();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchBuses();
    };

    // Search Filter Logic
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredBuses(buses);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = buses.filter(
            (bus) =>
                bus.busCode.toLowerCase().includes(lowerQuery) ||
                (bus.numberPlate && bus.numberPlate.toLowerCase().includes(lowerQuery)) ||
                bus.district.toLowerCase().includes(lowerQuery)
        );
        setFilteredBuses(filtered);
    };

    // Delete Bus
    const handleDelete = (id, busCode) => {
        Alert.alert(
            "Confirm Delete",
            `Are you sure you want to delete bus ${busCode}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await axios.delete(`${API_URL}/admin/remove-bus/${id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            Alert.alert("Success", "Bus deleted successfully");
                            fetchBuses(); // Reload list
                        } catch (err) {
                            Alert.alert("Error", "Failed to delete bus");
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Ionicons name="bus" size={24} color="#1E3A8A" />
                <View style={styles.headerText}>
                    <Text style={styles.busCode}>{item.busCode}</Text>
                    <Text style={styles.numberPlate}>{item.numberPlate || "No Plate"}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.isActive ? "#10B981" : "#F59E0B" }]}>
                    <Text style={styles.statusText}>{item.isActive ? "Active" : "Inactive"}</Text>
                </View>
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.row}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{item.district}</Text>
                </View>
                <View style={styles.row}>
                    <Ionicons name="map-outline" size={16} color="#666" />
                    <Text style={styles.detailText} numberOfLines={1}>{item.stops.join(" -> ")}</Text>
                </View>
                {item.currentConductor && (
                    <View style={styles.row}>
                        <Ionicons name="person-outline" size={16} color="#666" />
                        <Text style={styles.detailText}>Conductor: {item.currentConductor.name}</Text>
                    </View>
                )}
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.btn, styles.editBtn]}
                    onPress={() => navigation.navigate("BusDetails", { bus: item })}
                >
                    <Ionicons name="create-outline" size={18} color="#fff" />
                    <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.btn, styles.deleteBtn]}
                    onPress={() => handleDelete(item._id, item.busCode)}
                >
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                    <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search bus, NumberPlate, or district..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholderTextColor="#9CA3AF"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearch("")}>
                        <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#1E3A8A" style={styles.loader} />
            ) : (
                <FlatList
                    data={filteredBuses}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            {searchQuery ? "No buses found matching your search." : "No buses found."}
                        </Text>
                    }
                />
            )}

            {/* Initialize Navigation to Add Bus - Button is Floating */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate("AddBus")}
            >
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        margin: 16,
        marginBottom: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        height: 50,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#1F2937",
        height: "100%",
    },
    listContent: {
        padding: 16,
        paddingTop: 8,
        paddingBottom: 80, // Space for FAB
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    headerText: {
        flex: 1,
        marginLeft: 10,
    },
    busCode: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1F2937",
    },
    numberPlate: {
        fontSize: 14,
        color: "#6B7280",
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    statusText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: 'bold'
    },
    detailsContainer: {
        marginBottom: 16,
        backgroundColor: '#F9FAFB',
        padding: 10,
        borderRadius: 8
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4
    },
    detailText: {
        marginLeft: 8,
        color: '#4B5563',
        flex: 1
    },
    actionButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
    },
    btn: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    editBtn: {
        backgroundColor: "#3B82F6",
    },
    deleteBtn: {
        backgroundColor: "#EF4444",
    },
    btnText: {
        color: "#fff",
        marginLeft: 4,
        fontWeight: "600",
        fontSize: 14,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 50,
        color: "#666",
        fontSize: 16,
    },
    fab: {
        position: "absolute",
        bottom: 24,
        right: 24,
        backgroundColor: "#1E3A8A",
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
    },
});
