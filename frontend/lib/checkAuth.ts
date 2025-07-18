// lib/checkAuth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return false;

    const res = await axios.get("http://192.168.0.101:5000/api/auth/check", {
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