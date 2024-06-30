import { create } from "apisauce";
import authStorage from "../auth/storage";

const apiClient = create({
  baseURL: "http://192.168.1.130:9000/api",
});

// Get the axios instance from the apisauce client
const axiosInstance = apiClient.axiosInstance;

// Set the x-auth-token header interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const authToken = await authStorage.getToken();
    config.headers["x-auth-token"] = authToken;

    // Log the endpoint
    // console.log("API Endpoint:", config.baseURL + config.url);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
