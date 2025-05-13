import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import ApiManager from "../api/ApiManager";
import { APIConstant } from "../api/APIConstants";
import { Product } from "../model/Product";
import { useApp } from "../context/AppContext"; // Import your context

type ProductDetailsRouteProp = RouteProp<
  { ProductDetails: { productId: number } },
  "ProductDetails"
>;
const screenDimension = Dimensions.get("window");
const ProductDetailsScreen = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Get product id from route params
  const route = useRoute<ProductDetailsRouteProp>();
  const productId = route.params?.productId;

  // Get the addToCart function from context
  const { addToCart, addRecentlyViewed } = useApp();

  const fetchProductDetails = useCallback(async (id: number) => {
    try {
      const data = await ApiManager.get(APIConstant.PRODUCT_BY_ID(id));
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product details", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
    }
  }, [productId, fetchProductDetails]);

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product]);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>No product details available.</Text>
      </View>
    );
  }

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product); // Adding the product to cart via context API
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Product Images */}
      <ScrollView
        horizontal
        pagingEnabled
        style={styles.imageCarousel}
        showsHorizontalScrollIndicator={false}
      >
        {product.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={styles.productImage}
          />
        ))}
      </ScrollView>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{product.title}</Text>
        <Text style={styles.productPrice}>${product.price}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>

        {/* Category */}
        <View style={styles.categoryBox}>
          <Image
            // source={{ uri: product.category.image }}
            style={styles.categoryImage}
          />
          <Text style={styles.categoryText}>{product.category}</Text>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  loader: {
    marginTop: 20,
  },
  imageCarousel: {
    height: 250,
  },
  productImage: {
    width: screenDimension.width - 32,
    height: 250,
    resizeMode: "cover",
    borderRadius: 10,
  },
  productInfo: {
    marginTop: 20,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 20,
    color: "#e53935",
    marginVertical: 10,
  },
  productDescription: {
    fontSize: 16,
    color: "#555",
    marginVertical: 10,
  },
  categoryBox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  categoryImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "500",
  },
  addToCartButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 50,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProductDetailsScreen;
