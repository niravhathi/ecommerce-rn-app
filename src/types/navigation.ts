import { Product } from "../model/Product";

export type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  Shop: { product: Product };
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
