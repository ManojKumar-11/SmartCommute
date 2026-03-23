import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function FeedbackScreen() {
    const navigation = useNavigation();
    const { token } = useAuth();

    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    const [rating, setRating] = useState(0);
    const [busCode, setBusCode] = useState('');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // 1. Check Access on Mount
    useEffect(() => {
        async function checkAccess() {
            try {
                // Parallel requests for tickets and pass
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    'X-Tunnel-Skip-AntiPhishing-Page': 'true',
                };

                const [ticketRes, passRes] = await Promise.all([
                    axios.get(`${API_URL}/ticket/active`, { headers }).catch(e => ({ data: [] })),
                    axios.get(`${API_URL}/pass/me`, { headers }).catch(e => ({ data: { uiState: 'NO_PASS' } }))
                ]);

                const activeTickets = ticketRes.data;
                const passData = passRes.data;

                const hasActiveTicket = Array.isArray(activeTickets) && activeTickets.length > 0;

                // Check if pass is active based on uiState or status logic from backend
                // backend returns { uiState, pass ... }
                // uiState can be 'ACTIVE_PASS'
                const hasActivePass = passData?.uiState === 'ACTIVE_PASS';

                if (hasActiveTicket || hasActivePass) {
                    setHasAccess(true);
                } else {
                    Alert.alert(
                        "Access Denied",
                        "You need an active pass or ticket to submit feedback.",
                        [{ text: "OK", onPress: () => navigation.goBack() }]
                    );
                }

            } catch (err) {
                console.error("Feedback access check failed:", err.response?.data || err.message);
                Alert.alert("Error", "Failed to verify access. Please try again later.",
                    [{ text: "OK", onPress: () => navigation.goBack() }]
                );
            } finally {
                setLoading(false);
            }
        }

        if (token) {
            checkAccess();
        } else {
            setLoading(false); // Should probably redirect to login if no token, but navigation handles that usually
        }
    }, [token, navigation]);

    const handleSubmit = async () => {
        if (rating === 0) {
            Alert.alert("Rating Required", "Please select a star rating.");
            return;
        }
        if (!busCode.trim()) {
            Alert.alert("Bus Code Required", "Please enter the bus code you traveled in.");
            return;
        }

        setSubmitting(true);

        setSubmitting(true);
        // console.log("Submitting feedback to:", `${API_URL}/feedback/submit`);
        // console.log("Payload:", { busCode, rating, comment });

        try {
            const payload = {
                busCode: busCode.toUpperCase(),
                rating,
                comment
            };

            const response = await axios.post(`${API_URL}/feedback/submit`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    'X-Tunnel-Skip-AntiPhishing-Page': 'true',
                },
            });

            // console.log("Response status:", response.status);
            // console.log("Response data:", response.data);

            Alert.alert("Thank You!", "Your feedback has been submitted.", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (err) {
            console.error("Feedback submit error full:", err);
            console.error("Response data:", err.response?.data);
            Alert.alert(
                "Submission Failed",
                err.response?.data?.error || "Could not submit feedback. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1E3A8A" />
                <Text style={{ marginTop: 10, color: '#666' }}>Verifying eligibility...</Text>
            </View>
        );
    } // End loading

    if (!hasAccess) {
        return <View style={styles.container} />; // Render empty or placeholder while alerting/navigating back
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <Text style={styles.header}>Rate Your Ride</Text>
                <Text style={styles.subHeader}>We value your feedback to improve our service.</Text>

                {/* Star Rating */}
                <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                            key={star}
                            onPress={() => setRating(star)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={star <= rating ? "star" : "star-outline"}
                                size={40}
                                color={star <= rating ? "#FBBF24" : "#D1D5DB"}
                                style={{ marginHorizontal: 4 }}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                <Text style={styles.ratingLabel}>
                    {rating > 0 ? `${rating} / 5` : "Tap to rate"}
                </Text>

                {/* Form Fields */}
                <View style={styles.form}>
                    <Text style={styles.label}>Bus Code</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. KA01F1234"
                        placeholderTextColor="#9CA3AF"
                        value={busCode}
                        onChangeText={setBusCode}
                        autoCapitalize="characters"
                    />

                    <Text style={styles.label}>Comments (Optional)</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Tell us about your experience..."
                        placeholderTextColor="#9CA3AF"
                        value={comment}
                        onChangeText={setComment}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
                    onPress={handleSubmit}
                    disabled={submitting}
                    activeOpacity={0.8}
                >
                    {submitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitBtnText}>Submit Feedback</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    scrollContainer: {
        padding: 24,
        flexGrow: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1E3A8A',
        marginBottom: 8,
        textAlign: 'center',
    },
    subHeader: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 32,
        textAlign: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    ratingLabel: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 32,
    },
    form: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: '#1F2937',
        marginBottom: 20,
    },
    textArea: {
        minHeight: 120,
    },
    submitBtn: {
        backgroundColor: '#1E3A8A',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: "#1E3A8A",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    submitBtnDisabled: {
        opacity: 0.7,
    },
    submitBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
