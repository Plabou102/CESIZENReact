import axios from "axios";
import { getToken } from "../../utils/authStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();

  console.group("AXIOS REQUEST");
  console.log("baseURL =", config.baseURL);
  console.log("url =", config.url);
  console.log("full URL =", `${config.baseURL || ""}${config.url || ""}`);
  console.log("method =", config.method);
  console.log("data =", config.data);
  console.log("headers before token =", config.headers);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("headers after token =", config.headers);
  console.groupEnd();

  return config;
});

api.interceptors.response.use(
  (response) => {
    console.group("AXIOS RESPONSE");
    console.log("status =", response.status);
    console.log("url =", response.config.url);
    console.log("data =", response.data);
    console.groupEnd();
    return response;
  },
  (error) => {
    console.group("AXIOS RESPONSE ERROR");
    console.log("message =", error?.message);
    console.log("code =", error?.code);
    console.log("response =", error?.response);
    console.log("request =", error?.request);
    console.log("config =", error?.config);
    console.groupEnd();
    return Promise.reject(error);
  },
);

export default api;