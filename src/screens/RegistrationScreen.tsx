import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import DatePicker from "@react-native-community/datetimepicker"; // Importing DatePicker to create custom DatePicker UI
import axios from "axios"; // Import axios for API requests
import { APIConstant } from "../api/APIConstants"; // Import API constants
import { User } from "../model/User"; // adjust path if needed

export default function RegistrationScreen({ navigation }: any) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState(new Date());
  const [agree, setAgree] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const genderOptions = ["Mr", "Ms"];

  const validateForm = () => {
    if (
      !firstName ||
      !lastName ||
      !gender ||
      !email ||
      !phone ||
      !address ||
      !password ||
      !confirmPassword ||
      !agree
    ) {
      Alert.alert(
        "Validation Error",
        "Please fill all required fields and agree to our Privacy Policy"
      );
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters");
      return false;
    } else if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match");
      return false;
    }

    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert(
        "Validation Error",
        "Phone number must contain at least 10 digits"
      );
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Validation Error", "Enter a valid email address");
      return false;
    }

    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 18);
    if (dob > minDate) {
      Alert.alert("Validation Error", "You must be at least 18 years old");
      return false;
    }

    return true;
  };
  const newUser: User = {
    name: `${firstName} ${lastName}`,
    email: email,
    password: password,
    avatar: "https://picsum.photos/800", // or let user pick later
  };
  // Create User API call
  const handleRegister = async () => {
    if (validateForm()) {
      try {
        const response = await axios.post(
          `${APIConstant.BASE_URL}/users`,
          newUser
        );
        // Check if the response is successful
        if (response.status === 201) {
          // If the registration is successful, navigate to the Login screen
          Alert.alert("Success", "Registration Complete");
          navigation.navigate("Login"); // Assuming "Login" is the name of the login screen in your stack
        } else {
          Alert.alert("Error", "Something went wrong, please try again.");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    }
  };

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 1);

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
          <Text style={styles.title}>Register</Text>
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
            <Text style={{ color: gender ? "#000" : "#999" }}>
              {gender || "Select Gender"}
            </Text>
          </TouchableOpacity>

          {/* Gender Modal */}
          <Modal visible={showGenderModal} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Gender</Text>
                {genderOptions.map((option) => (
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
            </View>
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

          {/* Date Picker Section */}
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {dob ? dob.toDateString() : "Select Date of Birth"}
            </Text>
          </TouchableOpacity>

          {/* Date Picker Modal */}
          {showDatePicker && (
            <Modal visible={showDatePicker} transparent animationType="fade">
              <View style={styles.datePickerModal}>
                <View style={styles.datePickerContainer}>
                  <Text style={styles.datePickerTitle}>
                    Select Date of Birth
                  </Text>

                  <DatePicker
                    value={dob}
                    mode="date"
                    display="spinner"
                    maximumDate={maxDate}
                    onChange={(event, selectedDate) => {
                      if (event.type === "set" && selectedDate) {
                        setDob(selectedDate);
                      }
                    }}
                    style={styles.nativePicker} // optional
                  />

                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.datePickerButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
          {/* Password Fields */}
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
          <View style={styles.checkboxRow}>
            <CheckBox
              value={agree}
              onValueChange={setAgree}
              tintColors={{ true: "#f57c00", false: "gray" }}
            />
            <Text style={styles.checkboxText}>
              I agree to the Privacy Policy
            </Text>
          </View>

          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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

  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  dateInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  dateText: {
    color: "#000",
    fontSize: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkboxText: { marginLeft: 8 },
  registerBtn: {
    backgroundColor: "#f57c00",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  registerText: { color: "white", fontWeight: "bold", fontSize: 16 },
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
  modalCloseBtn: {
    backgroundColor: "#f57c00",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  modalCloseText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
