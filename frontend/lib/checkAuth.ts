// lib/checkAuth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem("token");
    const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL
    if (!token) return false;

    const res = await axios.get(`${API_BASE_URL}/api/auth/check`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.status === 200;
  } catch (error) {
    console.log("Auth check failed:", error);
    return false;
  }
};