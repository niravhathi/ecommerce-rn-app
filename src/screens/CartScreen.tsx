import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useApp } from "../context/AppContext";
import { CartItem, Product } from "../model/Product";

// interface Product {
//   id: string;
//   title: string;
//   price: number;
//   image: string;
//   size?: string;
//   tags?: string[];
// }

//const mockCart: Product[] = []; // simulate empty or filled
const mockWishlist: Product[] = [
  {
    id: 4,
    title: "Classic Grey Hooded Sweatshirt",
    slug: "classic-grey-hooded-sweatshirt",
    price: 90,
    description:
      "Elevate your casual wear with our Classic Grey Hooded Sweatshirt. Made from a soft cotton blend, this hoodie features a front kangaroo pocket, an adjustable drawstring hood, and ribbed cuffs for a snug fit. Perfect for those chilly evenings or lazy weekends, it pairs effortlessly with your favorite jeans or joggers.",
    category: {
      id: 1,
      name: "Clothessssss",
      slug: "clothessssss",
      image: "https://i.imgur.com/QkIa5tT.jpeg",
      creationAt: "2025-05-04T08:28:47.000Z",
      updatedAt: "2025-05-04T10:18:02.000Z",
    },
    images: [
      "https://i.imgur.com/R2PN9Wq.jpeg",
      "https://i.imgur.com/IvxMPFr.jpeg",
      "https://i.imgur.com/7eW9nXP.jpeg",
    ],
    creationAt: "2025-05-04T08:28:47.000Z",
    updatedAt: "2025-05-04T08:28:47.000Z",
  },
  {
    id: 5,
    title: "Classic Black Hooded Sweatshirt",
    slug: "classic-black-hooded-sweatshirt",
    price: 79,
    description:
      "Elevate your casual wardrobe with our Classic Black Hooded Sweatshirt. Made from high-quality, soft fabric that ensures comfort and durability, this hoodie features a spacious kangaroo pocket and an adjustable drawstring hood. Its versatile design makes it perfect for a relaxed day at home or a casual outing.",
    category: {
      id: 1,
      name: "Clothessssss",
      slug: "clothessssss",
      image: "https://i.imgur.com/QkIa5tT.jpeg",
      creationAt: "2025-05-04T08:28:47.000Z",
      updatedAt: "2025-05-04T10:18:02.000Z",
    },
    images: [
      "https://i.imgur.com/cSytoSD.jpeg",
      "https://i.imgur.com/WwKucXb.jpeg",
      "https://i.imgur.com/cE2Dxh9.jpeg",
    ],
    creationAt: "2025-05-04T08:28:47.000Z",
    updatedAt: "2025-05-04T08:28:47.000Z",
  },
];
const mockPopular: Product[] = [
  {
    id: 6,
    title: "Classic Comfort Fit Joggers",
    slug: "classic-comfort-fit-joggers",
    price: 25,
    description:
      "Discover the perfect blend of style and comfort with our Classic Comfort Fit Joggers. These versatile black joggers feature a soft elastic waistband with an adjustable drawstring, two side pockets, and ribbed ankle cuffs for a secure fit. Made from a lightweight and durable fabric, they are ideal for both active days and relaxed lounging.",
    category: {
      id: 1,
      name: "Clothessssss",
      slug: "clothessssss",
      image: "https://i.imgur.com/QkIa5tT.jpeg",
      creationAt: "2025-05-04T08:28:47.000Z",
      updatedAt: "2025-05-04T10:18:02.000Z",
    },
    images: [
      "https://i.imgur.com/ZKGofuB.jpeg",
      "https://i.imgur.com/GJi73H0.jpeg",
      "https://i.imgur.com/633Fqrz.jpeg",
    ],
    creationAt: "2025-05-04T08:28:47.000Z",
    updatedAt: "2025-05-04T08:28:47.000Z",
  },
  {
    id: 7,
    title: "Classic Comfort Drawstring Joggers",
    slug: "classic-comfort-drawstring-joggers",
    price: 79,
    description:
      "Experience the perfect blend of comfort and style with our Classic Comfort Drawstring Joggers. Designed for a relaxed fit, these joggers feature a soft, stretchable fabric, convenient side pockets, and an adjustable drawstring waist with elegant gold-tipped detailing. Ideal for lounging or running errands, these pants will quickly become your go-to for effortless, casual wear.",
    category: {
      id: 1,
      name: "Clothessssss",
      slug: "clothessssss",
      image: "https://i.imgur.com/QkIa5tT.jpeg",
      creationAt: "2025-05-04T08:28:47.000Z",
      updatedAt: "2025-05-04T10:18:02.000Z",
    },
    images: [
      "https://i.imgur.com/mp3rUty.jpeg",
      "https://i.imgur.com/JQRGIc2.jpeg",
    ],
    creationAt: "2025-05-04T08:28:47.000Z",
    updatedAt: "2025-05-04T08:28:47.000Z",
  },
];

export default function CartScreen() {
  const { cartItems } = useApp();
  console.log("Cart Items:", cartItems);
  const [wishlistItems] = useState<Product[]>(mockWishlist);

  const renderProduct = (item: CartItem, isCart = false) => (
    <View key={item.id} style={styles.productRow}>
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text>{item.title}</Text>
        <Text>${item.price.toFixed(2)}</Text>
        {isCart ? (
          <View style={styles.qtyRow}>
            <TouchableOpacity>
              <Text>➖</Text>
            </TouchableOpacity>
            <Text style={styles.qty}>{item.quantity}</Text>
            <TouchableOpacity>
              <Text>➕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          item.slug && <Text>{item.slug}</Text>
        )}
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.addressBox}>
      <Text style={styles.addressLabel}>Shipping Address</Text>
      <Text style={styles.addressText}>
        26. Duong So 2, Thao Dien Ward, An Phu, District 2, Ho Chi Minh city
      </Text>
      <TouchableOpacity style={styles.editBtn}>
        <Text>✏️</Text>
      </TouchableOpacity>
    </View>
  );
  console.log("Cart Screen Loaded");
  console.log("Cart Items:", cartItems);
  console.log("Wishlist Items:", wishlistItems);
  console.log("Popular Items:", mockPopular);
  console.log("Cart Screen Loaded");
  console.log("Cart Items:", cartItems);
  console.log("Wishlist Items:", wishlistItems);
  console.log("Popular Items:", mockPopular);
  const renderEmptyCartIcon = () => (
    <View style={styles.emptyIconBox}>
      <Text style={{ fontSize: 48 }}>🛍️</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>
        Cart <Text style={styles.cartCount}>{cartItems.length}</Text>
      </Text>
      {renderHeader()}
      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item) => renderProduct(item, true))}
          <Text style={styles.total}>
            Total ${cartItems.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
          </Text>
        </>
      ) : wishlistItems.length > 0 ? (
        <>
          {renderEmptyCartIcon()}
          <Text style={styles.sectionTitle}>From Your Wishlist</Text>
          {wishlistItems.map((item) => renderProduct(item))}
          <Text style={styles.total}>Total $0.00</Text>
        </>
      ) : (
        <>{renderEmptyCartIcon()}</>
      )}
      <Text style={styles.sectionTitle}>Most Popular</Text>dgg
      <FlatList
        data={mockPopular}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.popularItem}>
            <Image
              source={{ uri: item.images[0] }}
              style={styles.popularImage}
            />
            <Text>${item.price.toFixed(2)}</Text>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />
      {/* <Text style={styles.total}>Total $0.00</Text> */}
      <TouchableOpacity style={styles.checkoutBtn}>
        <Text style={styles.checkoutText}>Checkout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold" },
  cartCount: {
    backgroundColor: "#eee",
    paddingHorizontal: 8,
    borderRadius: 16,
    fontSize: 14,
  },
  addressBox: {
    marginVertical: 16,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    position: "relative",
  },
  addressLabel: { fontWeight: "bold", marginBottom: 4 },
  addressText: { fontSize: 14 },
  editBtn: { position: "absolute", top: 10, right: 10 },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 8,
  },
  productImage: { width: 80, height: 80, marginRight: 12, borderRadius: 8 },
  productInfo: { flex: 1 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  qty: { fontSize: 16 },
  emptyIconBox: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 16 },
  popularItem: {
    width: 100,
    marginRight: 12,
    alignItems: "center",
  },
  popularImage: { width: 80, height: 80, borderRadius: 8 },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginVertical: 16,
  },
  checkoutBtn: {
    backgroundColor: "#0066FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
