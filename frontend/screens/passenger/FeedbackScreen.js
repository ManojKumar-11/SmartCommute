import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FeedbackScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Feedback</Text>
            <Text style={styles.subtitle}>Feature coming soon...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
    },
});
