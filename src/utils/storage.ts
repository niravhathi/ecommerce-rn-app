import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "../model/Product";

const CART_KEY = "@cart_items";
const WISHLIST_KEY = "@wishlist_items";

export const saveCartItems = async (items: Product[]) => {
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const getCartItems = async (): Promise<Product[]> => {
  const result = await AsyncStorage.getItem(CART_KEY);
  return result ? JSON.parse(result) : [];
};

export const saveWishlistItems = async (items: Product[]) => {
  await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
};

export const getWishlistItems = async (): Promise<Product[]> => {
  const result = await AsyncStorage.getItem(WISHLIST_KEY);
  return result ? JSON.parse(result) : [];
};
