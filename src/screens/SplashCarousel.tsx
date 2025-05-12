import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParams } from "../navigation/RootStack";

const { width, height } = Dimensions.get("window");

const splashData = [
  {
    key: "1",
    title: "Shop Now!",
    description: "in any Where, at any Time...",
    image: require("../assets/splash1.png"),
  },
  {
    key: "2",
    title: "Free Shipping!",
    description: "recive your orders Fast & Free...",
    image: require("../assets/splash2.png"),
  },
  {
    key: "3",
    title: "Easy & Secure",
    description: "Payment",
    image: require("../assets/splash3.png"),
  },
];

export default function SplashCarousel() {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
  const flatListRef = useRef<FlatList<any>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (flatListRef.current) {
      if (currentIndex < splashData.length - 1) {
        flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
      } else {
        navigation.navigate("Login");
      }
    }
  };

  const handleJoin = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ccc" />
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        data={splashData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <ImageBackground source={item.image} style={styles.image}>
            <View style={styles.overlay} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </ImageBackground>
        )}
      />

      <View style={styles.dotsContainer}>
        {splashData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : null,
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>
            {currentIndex < splashData.length - 1 ? "Next" : "Start"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.joinBtn} onPress={handleJoin}>
          <Text style={styles.joinBtnText}>Join us Now!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width,
    height,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, )",
    zIndex: 1,
  },
  textContainer: {
    marginTop: 60,
    alignItems: "center",
    zIndex: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 6,
    textAlign: "center",
    textShadowColor: "#fff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 110,
    width: "100%",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#4CAF50",
  },
  buttonRow: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 30,
  },
  nextBtn: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  nextBtnText: {
    color: "#000",
    fontWeight: "600",
  },
  joinBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  joinBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  skipContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 3,
  },
  skipText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
});
