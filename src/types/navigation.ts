import { Product } from "../model/Product";

export type RootStackParamList = {
  Home: undefined;
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
};
// navigation/types.ts
export type AccountStackParamList = {
  AccountMain: undefined;
  Settings: undefined;
};

// navigation/types.ts
export type ShopStackParamList = {
  ShopMain: undefined;
  ProductDetails: { productId: number };
};
