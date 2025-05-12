// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import ApiManager from "../api/ApiManager";
import { APIConstant } from "../api/APIConstants";
import { Product } from "../model/Product";
import Icon from "react-native-vector-icons/MaterialIcons"; // For icons like cart, search
import { Category } from "../model/Category";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { HomeStackParamList, RootStackParamList } from "../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import BannerCarousel from "../screens/components/BannerCarousel";
import CategoryList from "../screens/components/CategoryList";
import FlashSale from "../screens/components/FlashSale";
import ProductGrid from "../screens/components/ProductGrid";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

type HomeNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootStackParamList>,
  StackNavigationProp<HomeStackParamList, "HomeMain">
>;

const HomeScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  // const navigation = useNavigation<ShopNavProp>();
  const navigation = useNavigation<HomeNavProp>();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ApiManager.get(APIConstant.PRODUCTS);
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ApiManager.get(APIConstant.CATEGORY);
        console.log("Categories:", response);
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle search input
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    searchProducts();
    console.log("Search query:", text);
    // You could filter products here based on search query, but for now it's just setting the state
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
      <Text style={styles.categoryText} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  // Navigate to Product Details screen
  const handleProductPress = (productId: number) => {
    // navigation.navigate("Account", {
    //   screen: "ProductDetails",
    //   params: { productId: productId }, // Pass the productId here
    // }); // Passing productId to ProductDetails screen
    navigation.navigate("ProductDetails", { productId: productId });
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item.id)}
    >
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
    </TouchableOpacity>
  );

  // Function to fetch search results
  const searchProducts = async () => {
    if (searchQuery.trim().length === 0) {
      try {
        const response = await ApiManager.get(APIConstant.PRODUCTS);
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      return; // Prevent API call if search term is empty
    }

    setIsLoading(true);

    try {
      // Call the search API
      const filters = { title: searchQuery }; // You can add more filters like price, category, etc.
      const url = APIConstant.PRODUCT_FILTER(filters); // Generate dynamic URL
      console.log("Search URL:", url); // Log the URL being fetched
      const response = await ApiManager.get(url);
      if (response && response.length > 0) {
        setProducts(response); // Set products in state
      } else {
        setProducts([]); // Clear products if no results found
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false); // Stop the loading state
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Search Bar */}
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        {/* {isLoading && <Text>Loading...</Text>} */}
        <Icon
          name="shopping-cart"
          size={30}
          color="black"
          style={styles.cartIcon}
        />
      </View>
      {/* <ScrollView style={styles.container}>
        <BannerCarousel />
        <CategoryList categories={categories} />
        {isLoading ? (
          <View style={styles.inlineLoader}>
            <ActivityIndicator size="large" color="#f57c00" />
          </View>
        ) : (
          <>
            <FlashSale products={products} navigation={navigation} />
            <ProductGrid
              title="Featured Products"
              products={products}
              navigation={navigation}
            />
          </>
        )}
      </ScrollView> */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => handleProductPress(item.id)}
          >
            <Image
              source={{ uri: item.images[0] }}
              style={styles.productImage}
            />
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
          </TouchableOpacity>
        )}
        numColumns={2} // Two products per row
        ListHeaderComponent={
          <>
            <BannerCarousel />
            <CategoryList categories={categories} />
            {isLoading ? (
              <View style={styles.inlineLoader}>
                <ActivityIndicator size="large" color="#f57c00" />
              </View>
            ) : (
              <FlashSale products={products} navigation={navigation} />
            )}
          </>
        }
        contentContainerStyle={{ padding: 8 }}
      />

      {/* <Modal visible={isLoading} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#f57c00" />
        </View>
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryList: {
    paddingVertical: 10,
  },
  categoryItem: {
    alignItems: "center",
    width: 80, // fixed width for consistency
    height: 120, // enough space for both image and text
    backgroundColor: "#fff",
    borderRadius: 8,
    marginRight: 10,
  },

  categoryImage: {
    width: 50, // image width
    height: 50, // image height
    borderRadius: 25, // circular image
    marginBottom: 8, // padding between image and text
    marginTop: 8,
    resizeMode: "cover", // keep the image aspect ratio
  },

  categoryText: {
    fontSize: 12, // text size
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    maxWidth: 70, // prevent overflow horizontally
    lineHeight: 16, // line height for better spacing
  },
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 8,
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  searchInput: {
    width: "90%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
  },
  cartIcon: {
    marginLeft: 16,
    paddingRight: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  productRow: {
    justifyContent: "space-between",
  },
  productList: {
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    width: "50%", // fit 2 columns with some spacing
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    color: "#888",
  },
  // loadingOverlay: {
  //   flex: 1,
  //   backgroundColor: "rgba(0, 0, 0, 0.4)", // semi-transparent background
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  inlineLoader: {
    marginVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
