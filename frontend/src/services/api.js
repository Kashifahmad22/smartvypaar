import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const getDashboardStats = () =>
  axios.get(`${BASE_URL}/analytics/dashboard`);

export const getLowStockProducts = () =>
  axios.get(`${BASE_URL}/products/low-stock`);

export const createSale = (data) =>
  axios.post(`${BASE_URL}/sales`, data);

export const getAllProducts = () =>
  axios.get(`${BASE_URL}/products`);

export const getAllSales = () =>
  axios.get(`${BASE_URL}/sales`);
