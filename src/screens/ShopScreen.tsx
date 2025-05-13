import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import ApiManager from "../api/ApiManager";
import { APIConstant } from "../api/APIConstants";
import { Product, Category } from "../model/Product";
import { useApp } from "../context/AppContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import { Recipe } from "../model/Recipe";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;

const ShopScreen = () => {
  const [activeTab, setActiveTab] = useState<"Products" | "Recipes">(
    "Products"
  );

  // Product State
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  // const [priceFilter, setPriceFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Recipe State
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { addToCart } = useApp();

  // Load data based on tab
  useEffect(() => {
    if (activeTab === "Products") {
      fetchCategories();
      fetchInitialProducts();
    } else {
      fetchRecipes();
    }
  }, [activeTab]);

  const fetchCategories = async () => {
    try {
      const data = await ApiManager.get(APIConstant.CATEGORY);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchInitialProducts = async () => {
    try {
      setLoading(true);
      const data = await ApiManager.get(APIConstant.PRODUCTS);
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching initial products", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = async (categoryName: string) => {
    try {
      setLoading(true);
      const endpoint = APIConstant.PRODUCT_SEARCH_BY_CATEGORY(categoryName);
      const data = await ApiManager.get(endpoint);
      setProducts(data.products);
    } catch (error) {
      console.error("Error applying category filter", error);
    } finally {
      setLoading(false);
    }
  };

  const applySort = async () => {
    try {
      setLoading(true);
      const endpoint = APIConstant.PRODUCT_SORT(
        categoryFilter,
        sortBy,
        sortOrder
      );
      const data = await ApiManager.get(endpoint);
      let sorted = data.products;

      // // Apply local price filter
      // if (priceFilter === "under50") {
      //   sorted = sorted.filter((item: Product) => item.price < 50);
      // } else if (priceFilter === "50to200") {
      //   sorted = sorted.filter(
      //     (item: Product) => item.price >= 50 && item.price <= 200
      //   );
      // } else if (priceFilter === "above200") {
      //   sorted = sorted.filter((item: Product) => item.price > 200);
      // }

      setProducts(sorted);
    } catch (error) {
      console.error("Error applying sort", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sortBy && activeTab === "Products") {
      applySort();
    }
  }, [sortBy, sortOrder]);

  const handleCategorySelect = (name: string) => {
    const newValue = categoryFilter === name ? "" : name;
    setCategoryFilter(newValue);
    if (newValue !== "") {
      applyFilter(newValue);
    } else {
      fetchInitialProducts();
    }
  };

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await ApiManager.get(APIConstant.RECIPES);
      setRecipes(data.recipes);
    } catch (error) {
      console.error("Error fetching recipes", error);
    } finally {
      setLoading(false);
    }
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Shop", {
            screen: "ProductDetails",
            params: { productId: item.id },
          })
        }
      >
        <Image source={{ uri: item.images[0] }} style={styles.image} />
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        <Text style={styles.price}>${item.price}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cartBtn} onPress={() => addToCart(item)}>
        <Text style={styles.cartBtnText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRecipeCard = ({ item }: { item: any }) => (
    <View style={styles.recipeCard}>
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <Text numberOfLines={2} style={styles.title}>
        {item.name}
      </Text>
      <Text style={styles.recipeMeta}>
        ⏱ {item.prepTimeMinutes + item.cookTimeMinutes} min | 🍽 {item.servings}{" "}
        servings
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <View style={styles.container}>
        {/* Segmented Control */}
        <View style={styles.tabContainer}>
          {["Products", "Recipes"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab(tab as "Products" | "Recipes")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "Products" ? (
          <ScrollView>
            <View style={styles.filters}>
              <Text style={styles.filterLabel}>Category</Text>
              <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => {
                  const isSelected = categoryFilter === item.name;
                  return (
                    <TouchableOpacity
                      onPress={() => handleCategorySelect(item.name)}
                      style={[
                        styles.categoryPill,
                        isSelected && styles.categoryPillSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          isSelected && styles.categoryTextSelected,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />

              {/* <Text style={styles.filterLabel}>Price</Text>
            <View style={styles.priceButtons}>
              {[
                { label: "Under $50", value: "under50" },
                { label: "$50 - $200", value: "50to200" },
                { label: "Above $200", value: "above200" },
              ].map((btn) => (
                <TouchableOpacity
                  key={btn.value}
                  style={[
                    styles.priceButton,
                    priceFilter === btn.value && styles.priceButtonSelected,
                  ]}
                  onPress={() => setPriceFilter(btn.value)}
                >
                  <Text
                    style={[
                      styles.priceText,
                      priceFilter === btn.value && styles.priceTextSelected,
                    ]}
                  >
                    {btn.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View> */}

              <Text style={styles.filterLabel}>Sort By</Text>
              <View style={styles.sortContainer}>
                {["price", "rating", "title"].map((field) => (
                  <TouchableOpacity
                    key={field}
                    style={[
                      styles.sortButton,
                      sortBy === field && styles.sortButtonSelected,
                    ]}
                    onPress={() => setSortBy(field)}
                  >
                    <Text
                      style={[
                        styles.sortText,
                        sortBy === field && styles.sortTextSelected,
                      ]}
                    >
                      {field.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.sortOrderButton}
                  onPress={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                >
                  <Text style={styles.sortOrderText}>
                    {sortOrder === "asc" ? "⬆️ ASC" : "⬇️ DESC"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {loading ? (
              <ActivityIndicator size="large" />
            ) : (
              <FlatList
                data={products}
                renderItem={renderProductCard}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={styles.row}
                contentContainerStyle={{ paddingBottom: 10 }}
              />
            )}
          </ScrollView>
        ) : (
          <ScrollView>
            {loading ? (
              <ActivityIndicator size="large" />
            ) : (
              <FlatList
                data={recipes}
                renderItem={renderRecipeCard}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={styles.row}
                contentContainerStyle={{ paddingBottom: 10 }}
              />
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  tabContainer: {
    marginTop: 16,
    flexDirection: "row",
    margin: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: "#007bff",
  },
  tabText: { fontSize: 16, color: "#444" },
  tabTextActive: { color: "#fff", fontWeight: "600" },
  filters: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    margin: 16,
    elevation: 2,
  },
  filterLabel: { fontSize: 16, fontWeight: "500", marginVertical: 8 },
  categoryPill: {
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  categoryPillSelected: { backgroundColor: "#007bff" },
  categoryText: { fontSize: 14, color: "#333" },
  categoryTextSelected: { color: "#fff", fontWeight: "bold" },
  priceButtons: { flexDirection: "row", justifyContent: "space-between" },
  priceButton: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  priceButtonSelected: { backgroundColor: "#007bff" },
  priceText: { color: "#333" },
  priceTextSelected: { color: "#fff", fontWeight: "bold" },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 8,
  },
  sortButton: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  sortButtonSelected: { backgroundColor: "#007bff" },
  sortText: { color: "#333", fontWeight: "500" },
  sortTextSelected: { color: "#fff", fontWeight: "600" },
  sortOrderButton: {
    backgroundColor: "#444",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sortOrderText: { color: "#fff", fontWeight: "600" },
  row: { justifyContent: "space-between", paddingHorizontal: 16 },
  productCard: {
    backgroundColor: "#fff",
    flex: 1,
    borderRadius: 12,
    marginBottom: 16,
    padding: 10,
    elevation: 3,
    marginHorizontal: 4,
  },
  image: {
    width: "100%",
    height: 130,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: { fontSize: 14, fontWeight: "500" },
  price: { fontSize: 14, color: "#666", marginTop: 4 },
  cartBtn: {
    backgroundColor: "#2f56f7",
    paddingVertical: 6,
    marginTop: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  cartBtnText: { color: "#fff", fontWeight: "600" },
  recipeCard: {
    backgroundColor: "#fff",
    flex: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    marginHorizontal: 4,
    elevation: 3,
  },
  recipeImage: {
    width: "100%",
    height: 130,
    borderRadius: 8,
    marginBottom: 8,
  },
  recipeMeta: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
});

export default ShopScreen;
