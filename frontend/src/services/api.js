import axios from "axios";

/* ==============================
   AXIOS INSTANCE
============================== */

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* ==============================
   AUTH INTERCEPTOR
============================== */

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

/* ==============================
   PROFILE
============================== */

export const getProfile = () =>
  API.get("/profile");

export const updateProfile = (data) =>
  API.put("/profile", data);

/* ==============================
   DASHBOARD / ANALYTICS
============================== */

export const getDashboardStats = () =>
  API.get("/analytics/dashboard");

export const getBusinessHealth = () =>
  API.get("/analytics/business-health");

export const getTopProducts = () =>
  API.get("/analytics/top-products");

export const getWeeklyProfit = () =>
  API.get("/analytics/weekly-profit");

export const getMonthlySummary = () =>
  API.get("/analytics/monthly-summary");

export const getGrowthAnalytics = () =>
  API.get("/analytics/growth");

export const getTopProfitProducts = () =>
  API.get("/analytics/top-profit");

export const getDeadStockProducts = () =>
  API.get("/analytics/dead-stock");

export const getTrendAnalytics = (period) =>
  API.get(`/analytics/trend?period=${period}`);

/* =============================
   SMART RECOMMENDATIONS 
============================== */

export const getReorderRecommendations = async () => {
  const res = await API.get("/reorder/recommendations");
  return res.data.data;
};

/* ==============================
   PRODUCTS
============================== */

export const getAllProducts = (page = 1, limit = 5) =>
  API.get(`/products?page=${page}&limit=${limit}`);

export const getLowStockProducts = () =>
  API.get("/products/low-stock");

export const getUpcomingExpiry = () =>
  API.get("/products/upcoming-expiry");

export const createProduct = (data) =>
  API.post("/products", data);

export const restockProduct = (id, data) =>
  API.patch(`/products/${id}/restock`, data);

export const updateBatchQuantity = (batchId, data) =>
  API.patch(`/products/batch/${batchId}`, data);

export const deleteBatch = (batchId) =>
  API.delete(`/products/batch/${batchId}`);

/* ==============================
   SALES
============================== */

export const createSale = (data) =>
  API.post("/sales", data);

export const getAllSales = () =>
  API.get("/sales");

/* ==============================
   PARTIES (Customers & Suppliers)
============================== */

export const getParties = (type) =>
  API.get(`/parties?type=${type}`);

export const createParty = (data) =>
  API.post("/parties", data);

export const getPartyById = (id) =>
  API.get(`/parties/${id}`);

/* ==============================
   LEDGER
============================== */

export const addLedgerEntry = (data) =>
  API.post("/ledger", data);

export const getLedgerHistory = (partyId, page = 1) =>
  API.get(`/ledger/${partyId}?page=${page}`);


// ==============================
// FINANCIAL SUMMARY
// ==============================

export const getFinancialSummary = () =>
  API.get("/analytics/financial-summary");
/* ==============================
   EXPORT DEFAULT
============================== */

export default API;