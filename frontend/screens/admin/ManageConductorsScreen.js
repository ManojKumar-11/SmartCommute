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
    Modal,
} from "react-native";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ManageConductorsScreen({ navigation }) {
    const { token } = useAuth();
    const [conductors, setConductors] = useState([]);
    const [filteredConductors, setFilteredConductors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedConductor, setSelectedConductor] = useState(null);
    const [busCodeInput, setBusCodeInput] = useState("");
    const [assignLoading, setAssignLoading] = useState(false);


    const fetchConductors = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/all-conductors`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setConductors(res.data);
            setFilteredConductors(res.data);
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to load conductors");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchConductors();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchConductors();
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredConductors(conductors);
            return;
        }
        const lower = query.toLowerCase();
        const filtered = conductors.filter(
            (c) =>
                c.name.toLowerCase().includes(lower) ||
                c.conductorId.toLowerCase().includes(lower)
        );
        setFilteredConductors(filtered);
    };

    const openAssignModal = (conductor) => {
        setSelectedConductor(conductor);
        setBusCodeInput("");
        setModalVisible(true);
    };

    const handleAssignBus = async () => {
        if (!busCodeInput.trim()) {
            Alert.alert("Error", "Please enter a Bus Code");
            return;
        }

        try {
            setAssignLoading(true);
            await axios.post(
                `${API_URL}/admin/assign-bus`,
                { conductorId: selectedConductor.conductorId, busCode: busCodeInput.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert("Success", `Bus ${busCodeInput} assigned to ${selectedConductor.name}`);
            setModalVisible(false);
            fetchConductors();
        } catch (err) {
            Alert.alert("Error", err.response?.data?.error || "Failed to assign bus");
        } finally {
            setAssignLoading(false);
        }
    };

    const handleUnassignBus = (conductor) => {
        Alert.alert(
            "Unassign Bus",
            `Remove bus from ${conductor.name}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Unassign",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await axios.post(
                                `${API_URL}/admin/unassign-bus`,
                                { conductorId: conductor.conductorId },
                                { headers: { Authorization: `Bearer ${token}` } }
                            );
                            fetchConductors();
                        } catch (err) {
                            Alert.alert("Error", "Failed to unassign bus");
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardRow}>
                <View style={styles.iconBg}>
                    <Ionicons name="person" size={20} color="#10B981" />
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.id}>ID: {item.conductorId}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.busInfoRow}>
                <View style={styles.busStatus}>
                    <Ionicons name="bus-outline" size={18} color="#6B7280" />
                    {item.assignedBus ? (
                        <Text style={styles.busText}>
                            Assigned: <Text style={styles.busCodeHighlight}>{item.assignedBus.busCode}</Text> ({item.assignedBus.numberPlate || 'No Plate'})
                        </Text>
                    ) : (
                        <Text style={styles.noBusText}>No bus assigned</Text>
                    )}
                </View>

                {item.assignedBus ? (
                    <TouchableOpacity onPress={() => handleUnassignBus(item)}>
                        <Text style={styles.unassignText}>Unassign</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.assignBtn} onPress={() => openAssignModal(item)}>
                        <Text style={styles.assignBtnText}>Assign</Text>
                    </TouchableOpacity>
                )}
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
                    placeholder="Search by Name or ID..."
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
                <ActivityIndicator size="large" color="#10B981" style={styles.loader} />
            ) : (
                <FlatList
                    data={filteredConductors}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={<Text style={styles.emptyText}>No conductors found.</Text>}
                />
            )}

            {/* Assign Bus Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Assign Bus</Text>
                        <Text style={styles.modalSubtitle}>To: {selectedConductor?.name} ({selectedConductor?.conductorId})</Text>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Enter Bus Code (e.g. A-01)"
                            value={busCodeInput}
                            onChangeText={setBusCodeInput}
                            autoCapitalize="sentences"
                            placeholderTextColor="#9CA3AF"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.confirmBtn, assignLoading && { opacity: 0.7 }]}
                                onPress={handleAssignBus}
                                disabled={assignLoading}
                            >
                                <Text style={styles.confirmBtnText}>{assignLoading ? "Assigning..." : "Assign"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("AddConductor")}>
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
    loader: { flex: 1, justifyContent: "center" },
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
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, fontSize: 16, color: "#1F2937", height: '100%' },
    listContent: { padding: 16, paddingTop: 8, paddingBottom: 80 },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    cardRow: { flexDirection: "row", alignItems: "center" },
    iconBg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#ECFDF5",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: "bold", color: "#1F2937" },
    id: { fontSize: 14, color: "#6B7280" },
    divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 12 },
    busInfoRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    busStatus: { flexDirection: "row", alignItems: "center", flex: 1 },
    busText: { marginLeft: 8, color: "#374151", fontSize: 14, flex: 1 },
    noBusText: { marginLeft: 8, color: "#9CA3AF", fontSize: 14, fontStyle: "italic" },
    busCodeHighlight: { fontWeight: "bold", color: "#1E3A8A" },
    assignBtn: { backgroundColor: "#1E3A8A", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 6 },
    assignBtnText: { color: "#fff", fontWeight: "600", fontSize: 12 },
    unassignText: { color: "#EF4444", fontWeight: "600", fontSize: 12, paddingHorizontal: 10 },
    fab: {
        position: "absolute", bottom: 24, right: 24,
        backgroundColor: "#10B981", // Emerald matches Manage Conductors theme
        width: 56, height: 56, borderRadius: 28,
        justifyContent: "center", alignItems: "center",
        elevation: 5, shadowColor: "#000", shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 },
    },
    emptyText: { textAlign: "center", marginTop: 50, color: "#666" },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#1F2937' },
    modalSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
    modalInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20
    },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
    cancelBtn: { paddingVertical: 10, paddingHorizontal: 16 },
    cancelBtnText: { color: '#6B7280', fontWeight: '600' },
    confirmBtn: { backgroundColor: '#1E3A8A', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    confirmBtnText: { color: '#fff', fontWeight: '600' }
});
