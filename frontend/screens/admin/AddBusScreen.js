import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function AddBusScreen({ navigation }) {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);

    const [busCode, setBusCode] = useState("");
    const [numberPlate, setNumberPlate] = useState("");
    const [district, setDistrict] = useState("");
    const [stops, setStops] = useState(["", ""]); // Start with 2 empty stops

    const handleAddStop = () => {
        setStops([...stops, ""]);
    };

    const handleRemoveStop = (index) => {
        if (stops.length <= 2) {
            Alert.alert("Error", "A bus route must have at least 2 stops");
            return;
        }
        const newStops = stops.filter((_, i) => i !== index);
        setStops(newStops);
    };

    const handleStopChange = (text, index) => {
        const newStops = [...stops];
        newStops[index] = text;
        setStops(newStops);
    };

    const handleSubmit = async () => {
        if (!busCode || !numberPlate || !district) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
        }

        if (stops.some((stop) => stop.trim() === "")) {
            Alert.alert("Error", "Please fill in all stops");
            return;
        }

        try {
            setLoading(true);
            await axios.post(
                `${API_URL}/admin/add-bus`,
                {
                    busCode,
                    numberPlate,
                    district,
                    stops: stops.map(s => s.trim())
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Alert.alert("Success", "Bus added successfully", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (err) {
            Alert.alert("Error", err.response?.data?.error || "Failed to add bus");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerTitle}>Add New Bus</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Bus Code</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. KS-01"
                        value={busCode}
                        onChangeText={setBusCode}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Number Plate</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. KA 01 AB 1234"
                        value={numberPlate}
                        onChangeText={setNumberPlate}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>District</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Visakhapatnam"
                        value={district}
                        onChangeText={setDistrict}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View style={styles.stopsContainer}>
                    <Text style={styles.label}>Stops (In Order)</Text>
                    {stops.map((stop, index) => (
                        <View key={index} style={styles.stopRow}>
                            <View style={styles.stopInputContainer}>
                                <Text style={styles.stopIndex}>{index + 1}.</Text>
                                <TextInput
                                    style={styles.stopInput}
                                    placeholder={`Stop ${index + 1}`}
                                    value={stop}
                                    onChangeText={(text) => handleStopChange(text, index)}
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                            {stops.length > 2 && (
                                <TouchableOpacity onPress={() => handleRemoveStop(index)}>
                                    <Ionicons name="trash-outline" size={24} color="#EF4444" />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}

                    <TouchableOpacity style={styles.addStopBtn} onPress={handleAddStop}>
                        <Ionicons name="add-circle-outline" size={20} color="#1E3A8A" />
                        <Text style={styles.addStopText}>Add Stop</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.submitBtn, loading && styles.disabledBtn]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.submitBtnText}>
                        {loading ? "Creating..." : "Create Bus"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1E3A8A",
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#4B5563",
        marginBottom: 6,
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: "#1F2937",
    },
    stopsContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    stopRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    stopInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        paddingHorizontal: 12,
        marginRight: 10,
    },
    stopIndex: {
        color: "#9CA3AF",
        marginRight: 8,
        fontWeight: 'bold'
    },
    stopInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: "#1F2937",
    },
    addStopBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderWidth: 1,
        borderColor: "#1E3A8A",
        borderRadius: 8,
        borderStyle: "dashed",
        marginTop: 5,
    },
    addStopText: {
        color: "#1E3A8A",
        fontWeight: "600",
        marginLeft: 6,
    },
    submitBtn: {
        backgroundColor: "#1E3A8A",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    disabledBtn: {
        opacity: 0.7,
    },
    submitBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
