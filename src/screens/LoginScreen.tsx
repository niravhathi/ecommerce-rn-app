import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Switch,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParams } from "../navigation/RootStack";
import ApiManager from "../api/ApiManager";
import { APIConstant } from "../api/APIConstants";
import ReactNativeBiometrics from "react-native-biometrics";
import { saveUser } from "../utils/UserStorage";
import { User } from "../model/User";

const LoginScreen = ({ navigation }: any) => {
  //const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
  const [email, setEmail] = useState("john@mail.com");
  const [password, setPassword] = useState("changeme");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please enter email and password");
      return;
    }
    console.log("Attempting login with email:", email, "password:", password);
    try {
      const response = await ApiManager.post(`${APIConstant.AUTH_LOGIN}`, {
        email,
        password,
      });
      //console.log("Login response:", response);
      if (response?.access_token) {
        const { access_token, refresh_token } = response;
        console.log("Login successful, tokens received:", {
          access_token,
          refresh_token,
        });
        // Fetch user profile with access token
        const profileRes = await ApiManager.get(`${APIConstant.AUTH_PROFILE}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        console.log("User profile response:", profileRes);
        const user: User = {
          id: profileRes.id,
          name: profileRes.name,
          email: profileRes.email,
          role: profileRes.role,
          avatar: profileRes.avatar,
          accessToken: access_token,
          refreshToken: refresh_token,
        };

        await saveUser(user); // Save to AsyncStorage

        Alert.alert("Login Success", `Welcome ${user.name}!`);
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }], // 👈 replace with your Tab.Navigator wrapper name if defined
        }); // Or any protected route
      } else {
        Alert.alert("Login Failed", "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Login failed. Please try again.");
    }
  };

  const handleBiometricLogin = async () => {
    console.log("Attempting biometric login");
    const rnBiometrics = new ReactNativeBiometrics();
    console.log("Checking biometric availability");
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    console.log("Biometric available:", available, "Type:", biometryType);
    if (!available) {
      console.log("Biometric not available");
      Alert.alert(
        "Biometric Not Available",
        "Your device does not support biometric authentication."
      );
      return;
    }

    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: "Authenticate with biometrics",
      });

      if (success) {
        // Auto-login after biometric
        // If storing email/password (securely), you can auto-login here
        handleLogin(); // You can cache last email/password or use token
      } else {
        Alert.alert("Failed", "Biometric authentication failed");
      }
    } catch (e) {
      console.warn("Biometric error", e);
      Alert.alert("Error", "Something went wrong during biometric auth");
    }
  };
  return (
    // <ImageBackground
    //   source={require("../assets/login-bg.jpg")}
    //   style={styles.bg}
    // >
    <View style={styles.overlay}>
      <Text style={styles.logo}>🛒 ShopEasy</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.rememberRow}>
        <Text style={styles.rememberText}>Remember Me</Text>
        <Switch />
      </View>

      <TouchableOpacity
        style={styles.faceLockBtn}
        onPress={handleBiometricLogin}
      >
        <Text style={styles.faceLockText}>🔒 Use Face/Fingerprint</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerLink}>Register Now</Text>
      </TouchableOpacity>
    </View>
    // </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
    justifyContent: "center",
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginBottom: 40,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  rememberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  rememberText: { color: "white" },
  faceLockBtn: { alignItems: "center", marginBottom: 20 },
  faceLockText: { color: "white" },
  loginBtn: {
    backgroundColor: "#00b894",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  loginText: { color: "white", fontWeight: "bold" },
  registerLink: { marginTop: 15, color: "#0984e3", textAlign: "center" },
});
export default LoginScreen;
