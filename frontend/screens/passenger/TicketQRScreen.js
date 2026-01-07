import { View, Text, StyleSheet, Pressable } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { BackHandler } from "react-native";
import { useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function TicketQRScreen({ route, navigation }) {
  useFocusEffect(
  useCallback(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });

    return () => {
      parent?.setOptions({ tabBarStyle: { display: "flex" } });
    };
  }, [navigation])
);
  const { ticket } = route.params;
  useEffect(() => {
  const backAction = () => {
    navigation.popToTop();
    return true; // prevent default behavior
  };

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => backHandler.remove();
}, []);
    

  return (
    <View style={styles.container}>


      {/* Status */}
      <Text
        style={[
          styles.status,
          ticket.isUsed ? styles.used : styles.valid
        ]}
      >
        {ticket.isUsed ? "TICKET USED" : "VALID TICKET"}
      </Text>

      {/* QR */}
      <View style={styles.qrContainer}>
        <QRCode
            value={JSON.stringify({
                ticketId: ticket._id,
                validTill: ticket.validTill,
                signature: ticket.qrSignature
            })}
            size={260}
        />
      </View>

      {/* Ticket details */}
      <View style={styles.details}>
        <Text style={styles.bus}>{ticket.busCode}</Text>
        <Text style={styles.route}>
          {ticket.boardingStop} → {ticket.destinationStop}
        </Text>
        <Text style={styles.fare}>Fare: ₹{ticket.fare}</Text>
        <Text style={styles.time}>
          Valid till {new Date(ticket.validTill).toLocaleTimeString()}
        </Text>
      </View>

      {/* Action */}
      <Pressable
        style={styles.doneBtn}
        onPress={() => navigation.popToTop()}
      >
        <Text style={styles.doneText}>Done</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    padding: 24
  },

  status: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "700"
  },

  valid: {
    color: "green"
  },

  used: {
    color: "red"
  },

  qrContainer: {
    marginVertical: 32,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },

  details: {
    alignItems: "center"
  },

  bus: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6
  },

  route: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4
  },

  fare: {
    fontSize: 14,
    marginBottom: 4
  },

  time: {
    fontSize: 12,
    color: "#6B7280"
  },

  doneBtn: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 32
  },

  doneText: {
    color: "#1E3A8A",
    fontWeight: "600",
    fontSize: 16
  }
});
