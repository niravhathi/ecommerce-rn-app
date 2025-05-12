// components/ProductGrid.tsx
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

const ProductGrid = ({
  title,
  products,
  navigation,
}: {
  title: string;
  products: Product[];
  navigation: any;
}) => {
  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("Shop", {
          screen: "ProductDetails",
          params: { productId: item.id },
        })
      }
    >
      <Image source={{ uri: item.images[0] }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>${item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  container: { paddingBottom: 20 },
  row: { justifyContent: "space-between" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    marginRight: 10,
    width: "47%",
  },
  image: { width: "100%", height: 140, borderRadius: 8 },
  title: { fontSize: 14, fontWeight: "bold", marginTop: 5 },
  price: { fontSize: 13, color: "#555" },
});

export default ProductGrid;
