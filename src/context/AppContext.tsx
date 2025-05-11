// src/context/AppContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product, CartItem } from "../model/Product";
import {
  getCartItems,
  saveCartItems,
  getWishlistItems,
  saveWishlistItems,
} from "../utils/storage";

interface AppContextType {
  cartItems: CartItem[];
  wishlistItems: CartItem[];
  addToCart: (product: CartItem) => void;
  addToWishlist: (product: CartItem) => void;
  removeFromCart: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  addRecentlyViewed: (product: CartItem) => void;
  recentlyViewed: CartItem[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const [recentlyViewed, setRecentlyViewed] = useState<CartItem[]>([]);
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setCartItems(await getCartItems());
      setWishlistItems(await getWishlistItems());
    };
    loadData();
  }, []);

  const addToCart = (product: Product) => {
    const existing = cartItems.find((item) => item.id === product.id);

    let updatedCart;
    if (existing) {
      updatedCart = cartItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }
    setCartItems(updatedCart);
    saveCartItems(updatedCart);
  };

  const addToWishlist = (product: Product) => {
    const updated = [...wishlistItems, product];
    setWishlistItems(updated);
    saveWishlistItems(updated);
  };

  const removeFromCart = (productId: number) => {
    const updated = cartItems.filter((item) => item.id !== productId);
    setCartItems(updated);
    saveCartItems(updated);
  };

  const removeFromWishlist = (productId: number) => {
    const updated = wishlistItems.filter((item) => item.id !== productId);
    setWishlistItems(updated);
    saveWishlistItems(updated);
  };

  const increaseQuantity = (productId: number) => {
    const updated = cartItems.map((item) =>
      item.id === productId
        ? { ...item, quantity: (item.quantity || 1) + 1 }
        : item
    );
    setCartItems(updated);
    saveCartItems(updated);
  };

  const decreaseQuantity = (productId: number) => {
    const updated = cartItems
      .map((item) =>
        item.id === productId
          ? { ...item, quantity: (item.quantity || 1) - 1 }
          : item
      )
      .filter((item) => (item.quantity ?? 0) > 0); // Remove if quantity is 0

    setCartItems(updated);
    saveCartItems(updated);
  };

  const addRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 5);
      console.log("Updated recently viewed:", updated);
      return updated;
    });
  };
  return (
    <AppContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        addToWishlist,
        removeFromCart,
        removeFromWishlist,
        increaseQuantity,
        decreaseQuantity,
        addRecentlyViewed,
        recentlyViewed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
