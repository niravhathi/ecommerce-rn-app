import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import ApiManager from "../api/ApiManager";
import { APIConstant } from "../api/APIConstants";
import { Product, Category } from "../model/Product";
import { RootStackParamList } from "../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { useApp } from "../context/AppContext";
import { useRoute, RouteProp } from "@react-navigation/native";
//type ShopRouteParams = StackNavigationProp<RootStackParamList, "Shop">;

// Define the route params for this screen
type ShopRouteParams = {
  Shop: {
    product?: Product; // product is optional if passed via navigation
  };
};
// Define Props type for the component
type Props = {
  product?: Product; // product is optional
};

const ShopScreen = ({ product }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<string>("");
  const { addToCart, addToWishlist, removeFromCart, removeFromWishlist } =
    useApp();
  const route = useRoute<RouteProp<ShopRouteParams, "Shop">>();

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
      console.log("Categories fetched:", data);
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
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    const filters: Record<string, any> = {};
    if (categoryFilter) filters.categoryId = categoryFilter;

    // Price filter isn't supported directly, so we'll filter client-side
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

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
      <TouchableOpacity onPress={() => addToCart(item)}>
        <Text style={styles.addToCart}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Shop</Text>

      <View style={styles.filterBox}>
        <Text style={styles.sectionTitle}>Filters</Text>

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value)}
            style={styles.picker}
          >
            <Picker.Item label="All Categories" value="" />
            {categories.map((cat) => (
              <Picker.Item
                label={cat.name}
                value={String(cat.id)} // Ensure it's a string
                key={cat.id}
              />
            ))}
          </Picker>
        </View>
        <Text style={styles.label}>Price Range</Text>
        <View style={styles.buttonRow}>
          {[
            { label: "Under $50", value: "under50" },
            { label: "$50 - $200", value: "50to200" },
            { label: "Above $200", value: "above200" },
          ].map((btn) => (
            <TouchableOpacity
              key={btn.value}
              onPress={() => setPriceFilter(btn.value)}
              style={[
                styles.priceButton,
                priceFilter === btn.value && styles.priceButtonSelected,
              ]}
            >
              <Text style={styles.priceText}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Deals</Text>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  filterBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  label: { fontSize: 16, marginTop: 10, marginBottom: 4 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
  },
  picker: { height: 44, width: "100%" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
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
  priceText: {
    color: "#000",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
  },
  productImage: {
    height: 160,
    borderRadius: 8,
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  productPrice: {
    fontSize: 16,
    color: "#888",
    marginVertical: 4,
  },
  addToCart: {
    color: "#007bff",
    marginTop: 8,
  },
});

export default ShopScreen;
