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
} from "react-native";
import ApiManager from "../api/ApiManager";
import { APIConstant } from "../api/APIConstants";
import { Product, Category } from "../model/Product";
import { useApp } from "../context/AppContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import { useNavigation } from "@react-navigation/native";

const ShopScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<string>("");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { addToCart } = useApp();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [categoryFilter, priceFilter]);

  const fetchCategories = async () => {
    try {
      const data = await ApiManager.get(APIConstant.CATEGORY);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await ApiManager.get(APIConstant.PRODUCTS);
      setProducts(data);
      setDeals(data.filter((item: Product) => item.price < 50)); // Sample logic for deals
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    const filters: Record<string, any> = {};
    if (categoryFilter) filters.categoryId = categoryFilter;

    try {
      setLoading(true);
      const endpoint = APIConstant.PRODUCT_FILTER(filters);
      const data = await ApiManager.get(endpoint);

      let filtered = data;

      if (priceFilter === "under50") {
        filtered = data.filter((item: Product) => item.price < 50);
      } else if (priceFilter === "50to200") {
        filtered = data.filter(
          (item: Product) => item.price >= 50 && item.price <= 200
        );
      } else if (priceFilter === "above200") {
        filtered = data.filter((item: Product) => item.price > 200);
      }

      setProducts(filtered);
    } catch (error) {
      console.error("Error applying filters", error);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to Product Details screen
  const handleProductPress = (productId: number) => {
    navigation.navigate("Shop", {
      screen: "ProductDetails",
      params: { productId: productId }, // Pass the productId here
    }); // Passing productId to ProductDetails screen
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <TouchableOpacity onPress={() => handleProductPress(item.id)}>
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

  const renderDealCard = ({ item }: { item: Product }) => (
    <View style={styles.dealCard}>
      <Image source={{ uri: item.images[0] }} style={styles.dealImage} />
      <Text numberOfLines={1} style={styles.dealTitle}>
        {item.title}
      </Text>
      <Text style={styles.dealPrice}>${item.price}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.header}>Shop</Text> */}

      {/* Filters */}
      <View style={styles.filters}>
        <Text style={styles.filterLabel}>Category</Text>
        {/* Horizontal Category Pills */}
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: 8 }}
          renderItem={({ item }) => {
            const isSelected = categoryFilter === String(item.id);
            return (
              <TouchableOpacity
                onPress={() =>
                  setCategoryFilter((prev) =>
                    prev === String(item.id) ? "" : String(item.id)
                  )
                }
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

        <Text style={styles.filterLabel}>Price</Text>
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
        </View>
      </View>

      {/* Products */}
      <Text style={styles.sectionTitle}>Products</Text>
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

      {/* Deals */}
      <Text style={styles.sectionTitle}>Deals</Text>
      <FlatList
        data={deals}
        renderItem={renderDealCard}
        keyExtractor={(item) => item.id.toString() + "deal"}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "600", marginVertical: 16 },
  filters: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
  },
  filterLabel: { fontSize: 16, fontWeight: "500", marginVertical: 8 },
  priceButtons: { flexDirection: "row", justifyContent: "space-between" },
  priceButton: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  priceButtonSelected: {
    backgroundColor: "#007bff",
  },
  priceText: { color: "#333" },
  priceTextSelected: { color: "#fff", fontWeight: "bold" },
  row: { justifyContent: "space-between" },
  productCard: {
    backgroundColor: "#fff",
    flex: 1,
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 4,
    padding: 10,
    elevation: 3,
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

  dealCard: {
    width: 140,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 12,
    padding: 10,
    elevation: 3,
  },
  dealImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
  },
  dealTitle: { fontSize: 13, fontWeight: "500", marginTop: 6 },
  dealPrice: { fontSize: 13, color: "#e53935", fontWeight: "bold" },

  // Styles for Category Pills
  categoryPill: {
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  categoryPillSelected: {
    backgroundColor: "#2f56f7",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  categoryTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ShopScreen;
