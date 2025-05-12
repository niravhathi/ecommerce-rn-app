import { Product } from "../model/Product";

export type RootStackParamList = {
  Home: {
    screen?: keyof HomeStackParamList;
    params?: any;
  };
  Details: undefined;
  Shop: {
    screen?: keyof ShopStackParamList;
    params?: any;
  };
  Filter: undefined; // Add the Filter screen
  Account: {
    screen?: keyof AccountStackParamList;
    params?: any;
  };
  Cart: undefined;
  // ProductDetails: { productId: number };
};
// navigation/types.ts
export type AccountStackParamList = {
  AccountMain: undefined;
  Settings: undefined;
  ProductDetails: { productId: number };
  PaymentMethod: undefined;
  About: undefined;
};

// navigation/types.ts
export type ShopStackParamList = {
  ShopMain: undefined;
  ProductDetails: { productId: number };
};

export type HomeStackParamList = {
  HomeMain: undefined;
  ProductDetails: { productId: number };
};
