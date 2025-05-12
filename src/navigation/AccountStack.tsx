// src/navigation/AccountStack.tsx

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import SettingsScreen from "../screens/SettingScreen";
import { AccountStackParamList } from "../types/navigation";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import PaymentMethodScreen from "../screens/payment/PaymentMethodScreen";
import AboutScreen from "../screens/AboutScreen";

const Stack = createStackNavigator<AccountStackParamList>();

const AccountStack = () => {
  return (
    <Stack.Navigator initialRouteName="AccountMain">
      <Stack.Screen
        name="AccountMain"
        component={AccountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings", headerBackButtonDisplayMode: "minimal" }} // Use minimal back button display
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{
          title: "Product Details",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="PaymentMethod"
        component={PaymentMethodScreen}
        options={{
          title: "Payment Method",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: "About", headerBackButtonDisplayMode: "minimal" }}
      />
    </Stack.Navigator>
  );
};

export default AccountStack;
