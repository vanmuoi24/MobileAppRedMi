// axiosInstance.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "https://api.bhyt.online/api/v1/",
  timeout: 10000,
});

// Interceptor: tự động thêm token nếu có
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token && token.startsWith("ey")) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("Không thể đọc token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
