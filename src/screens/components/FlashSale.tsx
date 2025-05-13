// components/FlashSale.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Product } from "../../model/Product";

const FlashSale = ({
  products,
  navigation,
}: {
  products: Product[];
  navigation: any;
}) => {
  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.flashCard}
      onPress={() =>
        navigation.navigate("Shop", {
          screen: "ProductDetails",
          params: { productId: item.id },
        })
      }
    >
      <Image source={{ uri: item.images[0] }} style={styles.flashImage} />
      <Text numberOfLines={1} style={styles.title}>
        {item.title}
      </Text>
      <Text style={styles.price}>${item.price}</Text>
      <Text style={styles.discount}>20% OFF</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <Text style={styles.heading}>🔥 Flash Sale</Text>
      {/* <FlatList
        data={products?.slice(0, 5) || []} // just show first 5
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  heading: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  flashCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginRight: 10,
    width: 120,
    padding: 10,
  },
  flashImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
  },
  title: { fontSize: 12, marginTop: 5 },
  price: { fontWeight: "bold", color: "#444" },
  discount: { color: "red", fontSize: 12 },
});

export default FlashSale;
