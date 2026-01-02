import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const ROLES = ["passenger", "conductor", "admin"];

export default function LoginScreen() {
  const { login } = useAuth();

  const [role, setRole] = useState("passenger");
  const [isRegister, setIsRegister] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function getPlaceholder() {
    if (role === "passenger") return "Phone Number";
    if (role === "conductor") return "Conductor ID";
    return "Admin Code";
  }

  function getEndpoint() {
    if (role === "passenger") {
      return isRegister
        ? "/auth/passenger/register"
        : "/auth/passenger/login";
    }
    if (role === "conductor") return "/auth/conductor/login";
    return "/auth/admin/login";
  }

  function getPayload() {
    if (role === "passenger") {
      return { phone: identifier, password };
    }
    if (role === "conductor") {
      return { conductorId: identifier, password };
    }
    return { adminCode: identifier, password };
  }

  async function handleSubmit() {
    if (!identifier || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}${getEndpoint()}`,
        getPayload()
      );

      // REGISTER FLOW
      if (role === "passenger" && isRegister) {
        Alert.alert("Success", "Registration successful. Please login.");
        setIsRegister(false);
        setPassword("");
        return;
      }

      // LOGIN FLOW
      const { token } = res.data;
      await login(token);

    } catch (err) {
      Alert.alert(
        isRegister ? "Registration Failed" : "Login Failed",
        err.response?.data?.error || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text style={styles.title}>
        {isRegister ? "Passenger Registration" : "SmartCommute Login"}
      </Text>

      {/* ROLE SELECTOR */}
      <View style={styles.roleContainer}>
        {ROLES.map((r) => (
          <Pressable
            key={r}
            onPress={() => {
              setRole(r);
              setIsRegister(false);
              setIdentifier("");
              setPassword("");
            }}
            style={[
              styles.roleBtn,
              role === r && styles.roleBtnActive,
            ]}
          >
            <Text
              style={[
                styles.roleText,
                role === r && styles.roleTextActive,
              ]}
            >
              {r.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* IDENTIFIER */}
      <TextInput
        placeholder={getPlaceholder()}
        value={identifier}
        onChangeText={setIdentifier}
        style={styles.input}
        autoCapitalize="none"
        autoFocus = {true}
      />

      {/* PASSWORD */}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      {/* SUBMIT BUTTON */}
      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading
            ? "Please wait..."
            : isRegister
            ? "Register"
            : "Login"}
        </Text>
      </Pressable>

      {/* REGISTER TOGGLE (PASSENGER ONLY) */}
      {role === "passenger" && (
        <Pressable
          onPress={() => setIsRegister((prev) => !prev)}
          style={styles.toggle}
        >
          <Text style={styles.toggleText}>
            {isRegister
              ? "Already registered? Login"
              : "New passenger? Register"}
          </Text>
        </Pressable>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  roleBtn: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 4,
    borderRadius: 6,
    alignItems: "center",
  },
  roleBtnActive: {
    backgroundColor: "#1E3A8A",
  },
  roleText: {
    color: "#333",
    fontWeight: "bold",
  },
  roleTextActive: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#1E3A8A",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  toggle: {
    marginTop: 16,
    alignItems: "center",
  },
  toggleText: {
    color: "#1E3A8A",
    fontWeight: "bold",
  },
});
