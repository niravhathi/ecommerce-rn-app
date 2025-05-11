// // src/screens/HomeScreen.tsx
// import React from "react";
// import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../types/navigation";
// import { RouteProp } from "@react-navigation/native";

// type HomeScreenNavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   "Home"
// >;
// type HomeScreenRouteProp = RouteProp<RootStackParamList, "Home">;

// type Props = {
//   navigation: HomeScreenNavigationProp;
//   route: HomeScreenRouteProp;
// };

// const HomeScreen: React.FC<Props> = ({ navigation }) => {
//   console.log("HomeScreen rendered");
//   return (
//     <View style={styles.container}>
//       <Text>Home Screen</Text>
//       <Text>Home Screen</Text>
//       <TouchableOpacity
//         onPress={() => {
//           console.log("Navigating to Details");
//           navigation.navigate("Details");
//         }}
//         style={styles.button}
//       >
//         <Text style={styles.buttonText}>Go to Details</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center" },
//   button: {
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     backgroundColor: "#007bff",
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//   },
// });
// src/screens/HomeScreen.tsx
// import React, { useState, useEffect } from "react";
// import { View, Text, FlatList, StyleSheet } from "react-native";
// import ApiManager from "../api/ApiManager"; // Import ApiManager
// import { APIConstant } from "../api/APIConstants"; // Import API constants
// import { Product } from "../model/Product"; // Import the Product model

// const HomeScreen = () => {
//   const [products, setProducts] = useState<Product[]>([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         // Fetch the raw data from API
//         const response = await ApiManager.get(APIConstant.PRODUCTS);

//         // Directly use the decoded object response
//         setProducts(response); // Assuming the API returns an array of products
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const renderItem = ({ item }: { item: Product }) => (
//     <View style={styles.productCard}>
//       <Text>{item.title}</Text>
//       <Text>${item.price}</Text>
//       <Text>{item.category.name}</Text>
//       <Text>{item.description}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Product List</Text>
//       <FlatList
//         data={products}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id.toString()}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   productCard: {
//     marginBottom: 10,
//     padding: 10,
//     borderWidth: 1,
//     borderRadius: 8,
//   },
// });

// export default HomeScreen;
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
} from "react-native";
import ApiManager from "../api/ApiManager";
import { APIConstant } from "../api/APIConstants";
import { Product } from "../model/Product";
import Icon from "react-native-vector-icons/MaterialIcons"; // For icons like cart, search
import { Category } from "../model/Category";

const HomeScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard}>
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
          // onSubmitEditing={searchProducts} // Trigger search when user presses enter
        />

        {/* Loading Indicator */}
        {isLoading && <Text>Loading...</Text>}

        <Icon
          name="shopping-cart"
          size={30}
          color="black"
          style={styles.cartIcon}
        />
      </View>

      {/* Category Section */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
      />

      {/* Featured Products Section */}
      <Text style={styles.sectionTitle}>Featured Products</Text>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productList}
      />
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
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInput: {
    width: "80%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
  },
  cartIcon: {
    marginLeft: 10,
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
    marginBottom: 15,
    marginRight: 10,
    width: "45%", // Two products per row
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
});

export default HomeScreen;
