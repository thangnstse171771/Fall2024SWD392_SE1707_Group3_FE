import axios from "axios";
import { BASE_URL } from "../constant/api";

const config = {
  baseURL: BASE_URL,
  timeout: 30000,
};

const api = axios.create(config);

// Lấy token từ localStorage
const getLocalToken = () => localStorage.getItem("token");
const getLocalRefreshToken = () => localStorage.getItem("refreshToken");

// Lưu token vào localStorage
const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Hàm refresh token
const refreshToken = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/identity/refresh`, {
      headers: {
        Authorization: `Bearer ${getLocalRefreshToken()}`,
      },
    });
    setToken(response.data.token);
    return response.data.token;
  } catch (error) {
    console.error("Token refresh failed:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.assign("/sign-in"); // Đảm bảo địa chỉ này là hợp lệ
    return Promise.reject(error);
  }
};

// Interceptor cho yêu cầu
const handleRequest = (config) => {
  const token = getLocalToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
};

// Xử lý lỗi yêu cầu
const handleRequestError = (error) => {
  return Promise.reject(error);
};

// Xử lý phản hồi
const handleResponse = (response) => {
  return response;
};

// Thêm interceptors
api.interceptors.request.use(handleRequest, handleRequestError);

export default api;
