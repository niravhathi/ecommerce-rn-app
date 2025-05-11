import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import screens
import HomeScreen from "../screens/HomeScreen";
import CartScreen from "../screens/CartScreen";
import AccountStack from "./AccountStack";
import ShopStack from "./ShopStack";

const Tab = createBottomTabNavigator();

const RootNavigator = () => {
  return (
    //<NavigationContainer>
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = "";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Shop") {
            iconName = focused ? "pricetag" : "pricetag-outline";
          } else if (route.name === "Cart") {
            iconName = focused ? "cart" : "cart-outline";
          } else if (route.name === "Account") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Shop"
        component={ShopStack}
        options={({ navigation }) => ({
          headerLeft: () => (
            <Ionicons
              name="filter-outline"
              size={30}
              color="black"
              onPress={() => navigation.navigate("Filter")}
            />
          ),
          headerShown: false,
        })}
      />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen
        name="Account"
        component={AccountStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>

    //  </NavigationContainer>
  );
};

export default RootNavigator;
