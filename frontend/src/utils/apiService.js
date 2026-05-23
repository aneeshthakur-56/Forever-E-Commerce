import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const makeApiRequest = async (
  url,
  method = "GET",
  data = null,
  headers = {},
) => {
  try {
    const config = { url, method, data, headers: { ...headers } };
    
    // Let browser automatically set Content-Type with boundary for FormData
    if (data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    console.error(`API Error [${method}] ${url}:`, error);
    throw error.response?.data || error.message;
  }
};
