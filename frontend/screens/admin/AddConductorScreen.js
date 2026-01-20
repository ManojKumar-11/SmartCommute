import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function AddConductorScreen({ navigation }) {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [conductorId, setConductorId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async () => {
        if (!name || !conductorId || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            await axios.post(
                `${API_URL}/admin/add-conductor`,
                {
                    name,
                    conductorId,
                    password,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Alert.alert("Success", "Conductor created successfully", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (err) {
            Alert.alert("Error", err.response?.data?.error || "Failed to add conductor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.formContainer}>
                {/* <Text style={styles.headerTitle}>Add New Conductor</Text> */}

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Krishna Kumar"
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Conductor ID</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. CND-001"
                        value={conductorId}
                        onChangeText={setConductorId}
                        autoCapitalize="none"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Set a secure password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            placeholderTextColor="#9CA3AF"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                            <Text style={{ fontSize: 22 }}>{!showPassword ? "🙈" : "👀"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showPassword}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.submitBtn, loading && styles.disabledBtn]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.submitBtnText}>
                        {loading ? "Creating..." : "Create Account"}
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
        padding: 20,
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1E3A8A",
        marginBottom: 20,
        textAlign: 'center'
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
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: "#1F2937",
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: "#1F2937",
    },
    eyeIcon: {
        padding: 4
    },
    submitBtn: {
        backgroundColor: "#10B981", // Emerald green for adding people
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
