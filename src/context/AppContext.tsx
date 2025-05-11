// src/context/AppContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "../model/Product";
import {
  getCartItems,
  saveCartItems,
  getWishlistItems,
  saveWishlistItems,
} from "../utils/storage";

interface AppContextType {
  cartItems: Product[];
  wishlistItems: Product[];
  addToCart: (product: Product) => void;
  addToWishlist: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setCartItems(await getCartItems());
      setWishlistItems(await getWishlistItems());
    };
    loadData();
  }, []);

  const addToCart = (product: Product) => {
    const updated = [...cartItems, product];
    setCartItems(updated);
    saveCartItems(updated);
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

  return (
    <AppContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        addToWishlist,
        removeFromCart,
        removeFromWishlist,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
