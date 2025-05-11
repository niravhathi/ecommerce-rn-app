// src/screens/SettingsScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingScreen = () => {
  const navigation = useNavigation();
  // Inside SettingScreen component
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // Clear all saved data

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }], // Name of your Login screen
        })
      );
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.section}>Personal</Text>
      <Option label="Profile" />
      <Option label="Shipping Address" />
      <Option label="Payment methods" />

      <Text style={styles.section}>Shop</Text>
      <Option label="Country" value="Vietnam" />
      <Option label="Currency" value="$ USD" />
      <Option label="Sizes" value="UK" />
      <Option label="Terms and Conditions" />

      <Text style={styles.section}>Account</Text>
      <Option label="Language" value="English" />
      <Option label="About Slada" />
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.delete}>
        <Text style={styles.deleteText}>Delete My Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const Option = ({ label, value }: { label: string; value?: string }) => (
  <TouchableOpacity style={styles.option}>
    <Text style={styles.optionText}>{label}</Text>
    {value && <Text style={styles.optionValue}>{value}</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  section: { fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 10 },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionText: { fontSize: 16 },
  optionValue: { fontSize: 16, color: "#999" },
  delete: { marginTop: 30 },
  deleteText: { color: "red", textAlign: "left" },
  footer: {
    marginTop: 30,
    fontSize: 12,
    color: "#999",
    textAlign: "left",
  },
  logout: {
    marginTop: 20,
    paddingVertical: 12,
  },
  logoutText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SettingScreen;
