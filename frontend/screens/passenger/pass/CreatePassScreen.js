import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const CLOUD_NAME = "dupn4m9pa";
const UPLOAD_PRESET = "passport_upload";

const GENDERS = ["MALE", "FEMALE", "OTHER"];
const PASS_TYPES = ["MONTHLY", "QUARTERLY", "YEARLY"];
const AP_DISTRICTS = [
  "Anakapalli", "Anantapur", "Annamayya", "Bapatla", "Chittoor",
  "East Godavari", "Eluru", "Guntur", "Kakinada", "Konaseema",
  "Krishna", "Kurnool", "Nandyal", "NTR", "Palnadu",
  "Parvathipuram Manyam", "Prakasam", "Sri Potti Sriramulu Nellore",
  "Sri Sathya Sai", "Srikakulam", "Tirupati", "Visakhapatnam",
  "Vizianagaram", "West Godavari", "YSR Kadapa"
];

/* ------------------ REUSABLE COMPONENTS ------------------ */

function LabeledInput({ label, error, ...props }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        style={[styles.input, error && { borderColor: 'red' }]}
        placeholderTextColor="#9CA3AF"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function Dropdown({ label, value, options, onSelect, isOpen, setOpen }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={styles.input}
        onPress={() => setOpen(label)}
      >
        <Text style={{ color: value ? "#000" : "#9CA3AF" }}>
          {value || `Select ${label}`}
        </Text>
      </Pressable>

      <Modal visible={isOpen === label} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setOpen(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select {label}</Text>
              </View>
              <ScrollView>
                {options.map((opt) => (
                  <Pressable
                    key={opt}
                    style={styles.modalItem}
                    onPress={() => {
                      onSelect(opt);
                      setOpen(null);
                    }}
                  >
                    <Text style={styles.modalItemText}>{opt}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

/* ------------------ MAIN SCREEN ------------------ */

export default function CreatePassScreen({ route }) {
  const navigation = useNavigation();
  const { token } = useAuth();
  
  // 1. Get prefill data from navigation params
  const prefill = route.params?.prefillData;

  const [form, setForm] = useState({
    name: prefill?.name || "",
    gender: prefill?.gender || "",
    dob: prefill?.dateOfBirth || "", // Map backend dateOfBirth to frontend dob
    aadhaar: prefill?.aadhaarNumber || "", // Map backend aadhaarNumber to frontend aadhaar
    bloodGroup: prefill?.bloodGroup || "",
    district: prefill?.district || "",
    passType: prefill?.passType || "MONTHLY",
  });

  const [photoUri, setPhotoUri] = useState(prefill?.photoUrl || null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // 2. Sync form if prefillData changes (e.g. user cancels another attempt)
  useEffect(() => {
    if (route.params?.prefillData) {
      const p = route.params.prefillData;
      setForm({
        name: p.name || "",
        gender: p.gender || "",
        dob: p.dateOfBirth || "",
        aadhaar: p.aadhaarNumber || "",
        bloodGroup: p.bloodGroup || "",
        district: p.district || "",
        passType: p.passType || "MONTHLY",
      });
      if (p.photoUrl) setPhotoUri(p.photoUrl);
    }
  }, [route.params?.prefillData]);

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const isValidDob = (val) => /^\d{4}-\d{2}-\d{2}$/.test(val);
  const isValidAadhaar = (val) => /^\d{12}$/.test(val);

  async function pickPassportPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Allow gallery access");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: true,
      aspect: [3, 4], 
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function uploadPassportPhoto() {
    // If the photoUri is already a web URL (from Cloudinary), don't re-upload
    if (!photoUri) return null;
    if (photoUri.startsWith('http')) return photoUri;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", {
      uri: photoUri,
      type: "image/jpeg",
      name: "passport.jpg"
    });
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      Alert.alert("Upload Failed", "Could not upload image.");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleCreatePass() {
    if (!form.name || !form.gender || !isValidDob(form.dob) || !isValidAadhaar(form.aadhaar) || !form.district || !photoUri) {
      Alert.alert("Invalid Data", "Please fill all required fields correctly.");
      return;
    }

    try {
      setSubmitting(true);
      const photoUrl = await uploadPassportPhoto();
      if (!photoUrl) return;

      const res = await axios.post(`${API_URL}/pass/create`, {
        ...form,
        dateOfBirth: form.dob,
        aadhaarNumber: form.aadhaar,
        photoUrl,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
      });

      navigation.replace("PaymentPending", { 
        intent: res.data,
        formData: {
          ...form,
          photoUrl
        }
      });
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Failed to create pass");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Create City Pass</Text>

          <LabeledInput
            label="Full Name"
            value={form.name}
            onChangeText={(v) => updateForm("name", v)}
            placeholder="Enter full name"
          />

          <Dropdown
            label="Gender"
            value={form.gender}
            options={GENDERS}
            onSelect={(v) => updateForm("gender", v)}
            isOpen={openDropdown}
            setOpen={setOpenDropdown}
          />

          <LabeledInput
            label="Date of Birth"
            value={form.dob}
            onChangeText={(v) => updateForm("dob", v)}
            placeholder="YYYY-MM-DD"
            error={form.dob && !isValidDob(form.dob) ? "Use YYYY-MM-DD format" : null}
          />

          <LabeledInput
            label="Aadhaar Number"
            value={form.aadhaar}
            keyboardType="numeric"
            maxLength={12}
            onChangeText={(v) => updateForm("aadhaar", v)}
            placeholder="12 digit Aadhaar"
            error={form.aadhaar && !isValidAadhaar(form.aadhaar) ? "Must be 12 digits" : null}
          />

          <LabeledInput
            label="Blood Group (optional)"
            value={form.bloodGroup}
            onChangeText={(v) => updateForm("bloodGroup", v)}
            placeholder="e.g. O+"
          />

          <Dropdown
            label="District"
            value={form.district}
            options={AP_DISTRICTS}
            onSelect={(v) => updateForm("district", v)}
            isOpen={openDropdown}
            setOpen={setOpenDropdown}
          />

          <Dropdown
            label="Pass Type"
            value={form.passType}
            options={PASS_TYPES}
            onSelect={(v) => updateForm("passType", v)}
            isOpen={openDropdown}
            setOpen={setOpenDropdown}
          />

          <Pressable style={styles.secondaryBtn} onPress={pickPassportPhoto}>
            <Text style={styles.secondaryBtnText}>
              {photoUri ? "Change Passport Photo" : "Upload Passport Photo"}
            </Text>
          </Pressable>

          {photoUri && <Image source={{ uri: photoUri }} style={styles.preview} />}

          <Pressable
            style={[styles.primaryBtn, (uploading || submitting) && { opacity: 0.6 }]}
            onPress={handleCreatePass}
            disabled={uploading || submitting}
          >
            {uploading || submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Proceed to Payment</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: 'center', color: '#1E3A8A' },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
    justifyContent: 'center'
  },
  errorText: { color: "red", fontSize: 12, marginTop: 4 },
  primaryBtn: {
    backgroundColor: "#1E3A8A",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  secondaryBtn: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#1E3A8A",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryBtnText: { color: "#1E3A8A", fontWeight: "600" },
  preview: {
    width: 120,
    height: 160,
    borderRadius: 8,
    marginTop: 15,
    alignSelf: "center",
    backgroundColor: '#eee'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalItemText: { fontSize: 16, textAlign: "center" },
});