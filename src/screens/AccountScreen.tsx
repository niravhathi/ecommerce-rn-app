import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { RootStackParamList, AccountStackParamList } from "../types/navigation";

import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { getUser } from "../utils/UserStorage";
import { User } from "../model/User";
import { useApp } from "../context/AppContext";

type AccountNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootStackParamList, "Account">,
  StackNavigationProp<AccountStackParamList, "AccountMain">
>;

const AccountScreen = () => {
  const navigation = useNavigation<AccountNavProp>();
  const [user, setUser] = useState<User | null>(null);
  const { recentlyViewed } = useApp();
  console.log("Recently Viewed Items:", recentlyViewed);
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getUser();
      setUser(storedUser);
    };
    loadUser();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder} />
          <TouchableOpacity style={styles.activityButton}>
            <Text style={styles.activityButtonText}>My Activity</Text>
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color="black"
              style={styles.icon}
            />
            <FontAwesome
              name="cog"
              size={24}
              color="black"
              style={styles.icon}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Account", { screen: "Settings" })
              }
            >
              <Ionicons name="settings-outline" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting */}
        <Text style={styles.greeting}>Hello, {user?.name || "Guest"}!</Text>

        {/* Announcement */}
        <View style={styles.announcementBox}>
          <View>
            <Text style={styles.announcementTitle}>Announcement</Text>
            <Text style={styles.announcementText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
              hendrerit luctus libero ac vulputate.
            </Text>
          </View>
          <TouchableOpacity>
            <Entypo name="chevron-right" size={24} color="blue" />
          </TouchableOpacity>
        </View>

        {/* Recently Viewed */}
        <Text style={styles.sectionTitle}>Recently viewed</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.recentlyViewed}
        >
          {recentlyViewed.map((product) => (
            <View key={product.id} style={styles.viewedItem}>
              <Image
                source={{ uri: product.images[0] }}
                style={styles.viewedItem}
              />
            </View>
          ))}
        </ScrollView>

        {/* My Orders */}
        <Text style={styles.sectionTitle}>My Orders</Text>
        <View style={styles.ordersRow}>
          <TouchableOpacity style={styles.orderButton}>
            <Text>To Pay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderButtonActive}>
            <Text style={styles.orderActiveText}>To Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderButton}>
            <Text>To Review</Text>
          </TouchableOpacity>
        </View>

        {/* Stories */}
        <Text style={styles.sectionTitle}>Stories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.storiesRow}
        >
          {[...Array(4)].map((_, index) => (
            <View key={index} style={styles.storyCard}>
              {index === 0 && (
                <View style={styles.liveTag}>
                  <Text style={styles.liveText}>Live</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ddd",
  },
  activityButton: {
    marginLeft: 10,
    backgroundColor: "#2F56F7",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activityButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    marginLeft: "auto",
  },
  icon: {
    marginHorizontal: 6,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
  },
  announcementBox: {
    backgroundColor: "#f4f4f4",
    padding: 16,
    borderRadius: 10,
    marginVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  announcementTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  announcementText: {
    color: "#333",
    fontSize: 12,
    maxWidth: "90%",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginVertical: 12,
  },
  recentlyViewed: {
    flexDirection: "row",
  },
  viewedItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ddd",
    marginRight: 10,
  },
  ordersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  orderButton: {
    backgroundColor: "#e6e6f0",
    padding: 10,
    borderRadius: 20,
    width: "30%",
    alignItems: "center",
  },
  orderButtonActive: {
    backgroundColor: "#2F56F7",
    padding: 10,
    borderRadius: 20,
    width: "30%",
    alignItems: "center",
  },
  orderActiveText: {
    color: "white",
  },
  storiesRow: {
    flexDirection: "row",
  },
  storyCard: {
    width: 100,
    height: 160,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginRight: 12,
    position: "relative",
  },
  liveTag: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "green",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default AccountScreen;
