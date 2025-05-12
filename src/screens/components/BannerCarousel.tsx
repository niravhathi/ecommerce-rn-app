// components/BannerCarousel.tsx
import React from "react";
import { ScrollView, Image, StyleSheet, View } from "react-native";
import { Dimensions } from "react-native";
const banners = [
  "https://picsum.photos/id/1018/800/400",
  "https://picsum.photos/id/1015/800/400",
  "https://picsum.photos/id/1019/800/400",
];

const screenDimension = Dimensions.get("window");
const BannerCarousel = () => (
  <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
    {banners.map((banner, index) => (
      <Image key={index} source={{ uri: banner }} style={styles.banner} />
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  banner: {
    width: screenDimension.width - 32,
    height: 180,
    marginBottom: 10,
    borderRadius: 8,
  },
});

export default BannerCarousel;
