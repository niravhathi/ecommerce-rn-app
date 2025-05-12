import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const SettingsScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => console.log("Delete account"),
        },
      ]
    );
  };

  const navigateTo = (screen: string) => {
    navigation.navigate(screen as never); // Cast for type safety
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.section}>Personal</Text>
      <Option label="Profile" onPress={() => navigateTo("Profile")} />
      <Option label="Shipping Address" onPress={() => navigateTo("Shipping")} />
      <Option
        label="Payment Methods"
        onPress={() => navigateTo("PaymentMethod")}
      />

      <Text style={styles.section}>Shop</Text>
      <Option label="Country" value="Vietnam" />
      <Option label="Currency" value="$ USD" />
      <Option label="Sizes" value="UK" />
      <Option
        label="Terms and Conditions"
        onPress={() => navigateTo("Terms")}
      />

      <Text style={styles.section}>Account</Text>
      <Option
        label="Language"
        value="English"
        onPress={() => navigateTo("Language")}
      />
      <Option label="About App" onPress={() => navigateTo("About")} />

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.delete} onPress={handleDeleteAccount}>
        <Text style={styles.deleteText}>Delete My Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const Option = ({
  label,
  value,
  onPress,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <Text style={styles.optionText}>{label}</Text>
    {value ? (
      <Text style={styles.optionValue}>{value}</Text>
    ) : (
      onPress && <Icon name="keyboard-arrow-right" size={20} color="#999" />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  section: { fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 10 },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: { fontSize: 16 },
  optionValue: { fontSize: 16, color: "#999" },
  delete: { marginBottom: 30 },
  deleteText: { color: "red", textAlign: "left" },
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

export default SettingsScreen;
