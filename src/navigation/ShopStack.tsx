// src/navigation/ShopStack.tsx

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ShopScreen from "../screens/ShopScreen"; // Import ShopScreen
import ProductDetailsScreen from "../screens/ProductDetailsScreen"; // Import ProductDetailsScreen
import { RootStackParamList, ShopStackParamList } from "../types/navigation";

const Stack = createStackNavigator<ShopStackParamList>();

const ShopStack = () => {
  return (
    <Stack.Navigator initialRouteName="ShopMain">
      <Stack.Screen
        name="ShopMain"
        component={ShopScreen}
        options={{ title: "Shop", headerShown: false }} // Show header for ShopMain
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{
          title: "Product Details",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack.Navigator>
  );
};

export default ShopStack;
