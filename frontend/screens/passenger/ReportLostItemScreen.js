import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from "../../context/AuthContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ReportLostItemScreen({ navigation }) {
    const { token } = useAuth();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [commuteType, setCommuteType] = useState('ticket'); // 'ticket' or 'pass'
    const [ticketPassId, setTicketPassId] = useState('');
    const [busCode, setBusCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState(null);

    const handleCall = async (phoneNumber) => {
        if (!phoneNumber) return;

        const telUrl = `tel:${phoneNumber}`;
        const canOpen = await Linking.canOpenURL(telUrl);

        if (canOpen) {
            Alert.alert(
                "Call Conductor?",
                `Do you want to call ${searchResult?.conductorName || 'the conductor'} regarding your lost item?`,
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Call", onPress: () => Linking.openURL(telUrl) }
                ]
            );
        } else {
            Alert.alert("Error", "Unable to open dialer on this device.");
        }
    };

    const handleSubmit = async () => {
        if (!name || !phone || !ticketPassId) {
            Alert.alert('Error', 'Please fill in Name, Phone, and ID fields');
            return;
        }

        if (commuteType === 'pass' && !busCode) {
            Alert.alert('Error', 'Bus Code is required for Pass users to locate the correct conductor.');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/passenger/find-lost-item-contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    'X-Tunnel-Skip-AntiPhishing-Page': 'true',
                },
                body: JSON.stringify({
                    id: ticketPassId,
                    type: commuteType,
                    busCode: commuteType === 'pass' ? busCode : null // Send busCode only if pass
                })
            });

            const data = await res.json();

            if (res.ok) {
                if (data.conductorPhone) {
                    setSearchResult(data);
                } else if (data.note) {
                    Alert.alert('Notice', data.note, [{ text: 'OK' }]);
                } else {
                    Alert.alert('Info', data.message || "No conductor info available.", [{ text: 'OK' }]);
                }
            } else {
                Alert.alert('Error', data.error || 'Failed to submit report');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1E3A8A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Report Lost Item</Text>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    {searchResult ? (
                        <View style={styles.successCard}>
                            <View style={styles.verifiedBadge}>
                                <MaterialIcons name="verified" size={24} color="#10B981" />
                                <Text style={styles.verifiedText}>Passenger Verified</Text>
                            </View>

                            <View style={styles.conductorInfo}>
                                <Text style={styles.conductorLabel}>Conductor Found</Text>
                                <Text style={styles.conductorName}>{searchResult.conductorName}</Text>
                                <Text style={styles.busInfo}>Bus Code: {searchResult.busCode}</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.callButton}
                                onPress={() => handleCall(searchResult.conductorPhone)}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="call" size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
                                <Text style={styles.callButtonText}>Call Conductor</Text>
                            </TouchableOpacity>

                            <Text style={styles.disclaimerText}>
                                Notice: This contact is provided for lost & found inquiries only. Please be respectful of our commute partners.
                            </Text>

                            <TouchableOpacity
                                style={styles.searchAgainButton}
                                onPress={() => {
                                    setSearchResult(null);
                                    setName('');
                                    setPhone('');
                                    setTicketPassId('');
                                    setBusCode('');
                                }}
                            >
                                <Text style={styles.searchAgainText}>Report Another Item</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your name"
                                value={name}
                                onChangeText={setName}
                            />

                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your phone number"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />

                            <Text style={styles.label}>Commute Type</Text>
                            <View style={styles.radioGroup}>
                                <TouchableOpacity
                                    style={[styles.radioButton, commuteType === 'ticket' && styles.radioButtonSelected]}
                                    onPress={() => setCommuteType('ticket')}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.radioCircle}>
                                        {commuteType === 'ticket' && <View style={styles.selectedRb} />}
                                    </View>
                                    <Text style={[styles.radioText, commuteType === 'ticket' && styles.radioTextSelected]}>Ticket</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.radioButton, commuteType === 'pass' && styles.radioButtonSelected]}
                                    onPress={() => setCommuteType('pass')}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.radioCircle}>
                                        {commuteType === 'pass' && <View style={styles.selectedRb} />}
                                    </View>
                                    <Text style={[styles.radioText, commuteType === 'pass' && styles.radioTextSelected]}>Pass</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>{commuteType === 'ticket' ? 'Ticket ID' : 'Pass ID'}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={`Enter your ${commuteType} ID`}
                                value={ticketPassId}
                                onChangeText={setTicketPassId}
                            />

                            {commuteType === 'pass' && (
                                <>
                                    <Text style={styles.label}>Bus Code (Required)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Bus Code (e.g., BUS001)"
                                        value={busCode}
                                        onChangeText={setBusCode}
                                    />
                                </>
                            )}

                            <TouchableOpacity
                                style={[styles.submitButton, loading && styles.disabledButton]}
                                onPress={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.submitButtonText}>Submit Report</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E3A8A',
    },
    content: {
        padding: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#111827',
    },
    radioGroup: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
    },
    radioButtonSelected: {
        borderColor: '#1E3A8A',
        backgroundColor: '#EFF6FF',
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#1E3A8A',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    selectedRb: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#1E3A8A',
    },
    radioText: {
        fontSize: 16,
        color: '#374151',
    },
    radioTextSelected: {
        color: '#1E3A8A',
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#1E3A8A',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 40,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.7,
    },
    successCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginTop: 20,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 20,
    },
    verifiedText: {
        color: '#10B981',
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 14,
    },
    conductorInfo: {
        alignItems: 'center',
        marginBottom: 24,
    },
    conductorLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    conductorName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
        textAlign: 'center',
    },
    busInfo: {
        fontSize: 16,
        color: '#4B5563',
    },
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#10B981', // Green for call
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        marginBottom: 16,
    },
    callButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disclaimerText: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 24,
    },
    searchAgainButton: {
        paddingVertical: 12,
    },
    searchAgainText: {
        color: '#1E3A8A',
        fontWeight: '600',
        fontSize: 16,
    },
});
