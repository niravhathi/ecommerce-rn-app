// src/navigation/RootStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashCarousel from "../screens/SplashCarousel";
import LoginScreen from "../screens/LoginScreen";
import RegistrationScreen from "../screens/RegistrationScreen";
import RootNavigator from "./RootNavigator";

export type RootStackParams = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParams>();

export default function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashCarousel} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="Register"
        component={RegistrationScreen}
        options={{ headerShown: true, title: "" }}
      />
      <Stack.Screen
        name="MainTabs"
        component={RootNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
