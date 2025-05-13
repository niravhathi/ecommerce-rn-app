import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import { User } from "../model/User";
import ApiManager from "../api/ApiManager";
import { APIConstant } from "../api/APIConstants";

const RegistrationScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [birthDate, setDob] = useState<Date | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const handleRegister = async () => {
    if (
      !firstName ||
      !lastName ||
      !gender ||
      !email ||
      !phone ||
      !address ||
      !birthDate ||
      !password ||
      !confirmPassword ||
      !agree
    ) {
      alert("Please fill out all fields and accept the privacy policy.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Construct user object matching API expectation
    const user: User = {
      firstName,
      lastName,
      email,
      password,
      username: `${firstName.toLowerCase()}${lastName.toLowerCase()}`, // or any custom logic
      gender,
      birthDate: birthDate.toISOString().split("T")[0], // "YYYY-MM-DD"
      phone,
      image: "https://dummyjson.com/icon/default/128", // optional default
      role: "customer", // default role
    };

    try {
      const response = await ApiManager.post(APIConstant.REGISTER_USER, user);
      console.log("User registered:", response);
      alert("Registration successful!");
      // Optionally save response to local storage or navigate to login
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to register. Please try again.");
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create an Account</Text>

          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowGenderModal(true)}
          >
            <Text style={{ color: gender ? "#000" : "#999", fontSize: 16 }}>
              {gender || "Select Gender"}
            </Text>
          </TouchableOpacity>

          <Modal
            visible={showGenderModal}
            animationType="fade"
            transparent
            onRequestClose={() => setShowGenderModal(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPressOut={() => setShowGenderModal(false)}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Gender</Text>
                {["Male", "Female", "Other"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.modalOption}
                    onPress={() => {
                      setGender(option);
                      setShowGenderModal(false);
                    }}
                  >
                    <Text style={styles.modalText}>{option}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => setShowGenderModal(false)}>
                  <Text style={styles.modalCancel}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />

          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {birthDate ? birthDate.toDateString() : "Select Date of Birth"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <Modal
              transparent
              animationType="fade"
              visible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
            >
              <View style={styles.datePickerModal}>
                <View style={styles.datePickerContainer}>
                  <Text style={styles.datePickerTitle}>Choose Your DOB</Text>
                  <DateTimePicker
                    value={birthDate || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                    style={styles.nativePicker}
                  />
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.datePickerButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            onPress={() => setAgree((prev) => !prev)}
            style={styles.checkboxRow}
            activeOpacity={0.8}
          >
            <View
              style={[styles.customCheckbox, agree && styles.checkedCheckbox]}
            >
              {agree && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>
              I agree to the Privacy Policy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>

          <View style={{ height: 30 }} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderColor: "#ddd",
    borderWidth: 1,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dateInput: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  registerBtn: {
    backgroundColor: "#f57c00",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  registerText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
  datePickerModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  datePickerButton: {
    marginTop: 15,
    backgroundColor: "#f57c00",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  datePickerButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  nativePicker: {
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalOption: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  modalText: { fontSize: 16, color: "#000" },
  modalCancel: { marginTop: 15, color: "red" },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  customCheckbox: {
    height: 20,
    width: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#999",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkedCheckbox: {
    backgroundColor: "#f57c00",
    borderColor: "#f57c00",
  },
  checkmark: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#555",
  },
});
