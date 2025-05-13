import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ApiManager from "../api/ApiManager";
import { APIConstant } from "../api/APIConstants";
import ReactNativeBiometrics from "react-native-biometrics";
import { saveUser } from "../utils/UserStorage";
import { User } from "../model/User";

const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Validation Error", "Please enter username and password");
      return;
    }

    try {
      const response = await ApiManager.post(`${APIConstant.AUTH_LOGIN}`, {
        username,
        password,
        expiresInMins: 30,
      });
      console.log("Login response:", response.accessToken);
      if (response?.accessToken) {
        // const { access_token, refresh_token } = response;

        // const profileRes = await ApiManager.get(`${APIConstant.AUTH_PROFILE}`, {
        //   headers: {
        //     Authorization: `Bearer ${access_token}`,
        //   },
        // });

        const user: User = {
          id: response.id,
          firstName: response.firstName,
          email: response.email,
          role: response.role,
          image: response.image,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          lastName: response.lastName,
          username: response.username,
          gender: response.gender,
        };

        await saveUser(user);

        Alert.alert("Login Success", `Welcome ${user.firstName}!`);
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });
      } else {
        Alert.alert("Login Failed", "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Login failed. Please try again.");
    }
  };

  const handleBiometricLogin = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    const { available } = await rnBiometrics.isSensorAvailable();

    if (!available) {
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
        handleLogin();
      } else {
        Alert.alert("Failed", "Biometric authentication failed");
      }
    } catch (e) {
      console.warn("Biometric error", e);
      Alert.alert("Error", "Something went wrong during biometric auth");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.logo}>🛒 ShopEasy</Text>

          <TextInput
            style={styles.input}
            placeholder="Username or Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.rememberRow}>
            <Text style={styles.rememberText}>Remember Me</Text>
            <Switch value={rememberMe} onValueChange={setRememberMe} />
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
            <Text style={styles.registerLink}>
              👉 Don’t have an account?{" "}
              <Text style={styles.registerNow}>Register Now</Text>
            </Text>
          </TouchableOpacity>

          <View style={{ height: 30 }} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f4f4f4",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderColor: "#ddd",
    borderWidth: 1,
    fontSize: 16,
  },
  rememberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  rememberText: {
    fontSize: 14,
    color: "#555",
  },
  faceLockBtn: {
    alignItems: "center",
    marginBottom: 20,
  },
  faceLockText: {
    color: "#555",
    fontSize: 15,
  },
  loginBtn: {
    backgroundColor: "#00b894",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: 20,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
  registerNow: {
    color: "#00cec9",
    fontWeight: "bold",
  },
});

export default LoginScreen;
