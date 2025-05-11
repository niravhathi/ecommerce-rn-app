import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParams } from "../navigation/RootStack";

const { width } = Dimensions.get("window");
const splashData = [
  {
    key: "1",
    title: "Welcome to ShopEasy",
    description: "Your smart shopping partner",
    backgroundColor: "#FFDDC1",
  },
  {
    key: "2",
    title: "Great Deals",
    description: "Find best offers every day",
    backgroundColor: "#FFABAB",
  },
  {
    key: "3",
    title: "Fast Delivery",
    description: "Get products to your door",
    backgroundColor: "#FFC3A0",
  },
  {
    key: "4",
    title: "Secure Payments",
    description: "Shop safely and easily",
    backgroundColor: "#FF6F61",
  },
];

export default function SplashCarousel() {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
  const flatListRef = useRef<FlatList<any>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const backgroundColor = splashData[currentIndex].backgroundColor;

  const handleNext = () => {
    if (flatListRef.current) {
      // Scroll to the next item or navigate to Login
      if (currentIndex < splashData.length - 1) {
        flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
      } else {
        navigation.navigate("Login");
      }
    }
  };

  const handleSkip = () => {
    navigation.navigate("Login"); // Skip to the login screen directly
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={splashData}
        keyExtractor={(item) => item.key}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.description}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.skip} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>
          {currentIndex < splashData.length - 1 ? "Next" : "Start"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  slide: {
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  desc: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginHorizontal: 20,
  },
  skip: {
    position: "absolute",
    top: 40,
    right: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25,
  },
  skipText: {
    fontSize: 18,
    color: "#fff",
  },
  nextButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: "#FF6F61",
    borderRadius: 30,
  },
  nextButtonText: {
    fontSize: 18,
    color: "#fff",
  },
});
