// src/navigation/ShopStack.tsx

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ShopScreen from "../screens/ShopScreen"; // Import ShopScreen
import ProductDetailsScreen from "../screens/ProductDetailsScreen"; // Import ProductDetailsScreen
import { ShopStackParamList } from "../types/navigation";

const Stack = createStackNavigator<ShopStackParamList>();

const ShopStack = () => {
  return (
    <Stack.Navigator initialRouteName="ShopMain">
      <Stack.Screen
        name="ShopMain"
        component={ShopScreen}
        options={{ title: "Shop", headerShown: true }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: "Product Details", headerShown: true }} // ✅ this shows back button
      />
    </Stack.Navigator>
  );
};

export default ShopStack;
