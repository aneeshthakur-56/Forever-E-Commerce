import axios from "axios";
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});
export const makeApiRequest = async (
  url,
  method = "GET",
  data = null,
  headers = {},
) => {
  try {
    const isFormData = data instanceof FormData;
    const response = await apiClient({
      url,
      method,
      data,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
    });
    return response;
  } catch (error) {
    console.error(`API Error [${method}] ${url}:`, error);
    throw error.response?.data || error.message;
  }
};
