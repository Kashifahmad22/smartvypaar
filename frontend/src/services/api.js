import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export const getDashboardStats = () =>
  API.get("/analytics/dashboard");

export const getLowStockProducts = () =>
  API.get("/products/low-stock");

export const getUpcomingExpiry = () =>
  API.get("/products/upcoming-expiry");

export const getTopProducts = () =>
  API.get("/analytics/top-products");

export const getWeeklyProfit = () =>
  API.get("/analytics/weekly-profit");

export const getBusinessHealth = () =>
  API.get("/analytics/business-health");

export const getAllProducts = () =>
  API.get("/products");

export const createProduct = (data) =>
  API.post("/products", data);

export const createSale = (data) =>
  API.post("/sales", data);

export const getAllSales = () =>
  API.get("/sales");

export const restockProduct = (id, data) =>
  API.patch(`/products/${id}/restock`, data);

export default API;