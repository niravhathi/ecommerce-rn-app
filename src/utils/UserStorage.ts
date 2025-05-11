// src/storage/UserStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../model/User";

const USER_KEY = "@user_data";

export const saveUser = async (user: User) => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = async (): Promise<User | null> => {
  const result = await AsyncStorage.getItem(USER_KEY);
  return result ? JSON.parse(result) : null;
};

export const clearUser = async () => {
  await AsyncStorage.removeItem(USER_KEY);
};
