import axios from "axios";

// Vite proxy forwards /api to http://localhost:5000 (see vite.config.js)
const api = axios.create({ baseURL: "/api" });

export const getCategories = () =>
  api.get("/categories").then((r) => r.data.data ?? r.data);

export const getServices = ({ category, search, page = 1, limit = 10 } = {}) => {
  const params = { page, limit };
  if (category) params.category = category;
  if (search) params.search = search;
  return api.get("/services", { params }).then((r) => r.data);
};

export const getServiceById = (id) =>
  api.get(`/services/${id}`).then((r) => r.data.data ?? r.data);

export const assistWithAI = (message, sessionId) =>
  api.post("/ai/assist", { message, sessionId }).then((r) => r.data.data ?? r.data);

export const createService = (data) =>
  api.post("/services", data).then((r) => r.data);

export const updateService = (id, data) =>
  api.put(`/services/${id}`, data).then((r) => r.data);

export const deleteService = (id) =>
  api.delete(`/services/${id}`).then((r) => r.data);

export const updateCategory = (id, data) =>
  api.put(`/categories/${id}`, data).then((r) => r.data);

export const deleteCategory = (id) =>
  api.delete(`/categories/${id}`).then((r) => r.data);

export default api;
