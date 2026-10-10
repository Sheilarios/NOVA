/// <reference types="vite/client" />
import axios from "axios";
import type { AxiosInstance } from "axios";

const isDevelopment = import.meta.env.DEV;
const apiURL = isDevelopment ? "http://localhost:3001/api" : "";  // ← DEBE SER ASÍ

console.log(` Modo: ${isDevelopment ? "Desarrollo" : "Producción"}`);
console.log(` API URL base: ${apiURL}`);

const api: AxiosInstance = axios.create({
  baseURL: apiURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("nova_token") ||
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("nova_token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.method?.toUpperCase() === "GET") {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    if (import.meta.env.DEV) {
      console.log("Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        fullUrl: apiURL + config.url,
        baseURL: config.baseURL,
        headers: { ...config.headers },
      });
    }

    return config;
  },
  (error) => {
    console.error("Error en interceptor de request:", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log("Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (import.meta.env.DEV) {
      console.error("Error de API:", {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url,
        fullUrl: apiURL + error.config?.url,
        data: error.response?.data,
      });
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("nova_refresh_token");
        if (refreshToken) {
          const response = await axios.post(`${apiURL}/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data;

          localStorage.setItem("nova_token", token);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.warn("No se pudo refrescar el token");
        localStorage.removeItem("nova_token");
        localStorage.removeItem("nova_user");
        localStorage.removeItem("nova_refresh_token");
        localStorage.removeItem("nova_session_active");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (!originalRequest._retry) {
            console.warn("No autorizado - Token inválido o expirado");
            localStorage.removeItem("nova_token");
            localStorage.removeItem("nova_user");
            localStorage.removeItem("nova_session_active");
            if (
              typeof window !== "undefined" &&
              !window.location.pathname.includes("/login")
            ) {
              window.location.href = "/login?session=expired";
            }
          }
          break;
        case 403:
          console.warn("Acceso prohibido - No tienes permisos");
          if (typeof window !== "undefined") {
            window.location.href = "/acceso-denegado";
          }
          break;
        case 404:
          console.warn("Recurso no encontrado");
          break;
        case 422:
          console.warn("Error de validación:", error.response.data?.errors);
          break;
        case 429:
          console.warn("Demasiadas peticiones - Rate limit excedido");
          break;
        case 500:
          console.error("Error interno del servidor", {
            url: error.config?.url,
            method: error.config?.method,
            requestData: error.config?.data,
            responseData: error.response?.data,
            headers: error.response?.headers,
          });
          if (typeof window !== "undefined") {
            const errorEvent = new CustomEvent("server-error", {
              detail: {
                message: "Error en el servidor. Por favor, intente más tarde.",
                originalError:
                  error.response?.data || "Sin detalles del servidor",
              },
            });
            window.dispatchEvent(errorEvent);
          }
          break;
        case 503:
          console.error("Servicio no disponible");
          break;
      }
    } else if (error.request) {
      console.error("Error de red - No se pudo conectar al servidor");
      if (typeof window !== "undefined") {
        const event = new CustomEvent("network-error", {
          detail: { message: "No hay conexión al servidor" },
        });
        window.dispatchEvent(event);
      }
    } else {
      console.error("Error de configuración:", error.message);
    }
    return Promise.reject({
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      originalError: error,
    });
  },
);
export const updateApiConfig = (config: {
  baseURL?: string;
  timeout?: number;
}) => {
  if (config.baseURL) {
    api.defaults.baseURL = config.baseURL;
  }
  if (config.timeout) {
    api.defaults.timeout = config.timeout;
  }
};
export const testConnection = async () => {
  try {
    const response = await api.get("/health");
    return {
      connected: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
export default api;
