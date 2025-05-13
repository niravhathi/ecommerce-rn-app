// components/CategoryList.tsx
import React from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Category } from "../../model/Category";

const CategoryList = ({ categories }: { categories: Category[] }) => {
  console.log("Categories:", categories);

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.tag}>
      <Text style={styles.tagText} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.name}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  tagList: {
    paddingVertical: 10,
  },
  tag: {
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  tagText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
});

export default CategoryList;
