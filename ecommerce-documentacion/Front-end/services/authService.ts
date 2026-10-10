import api from "../api/axiosInstance";
import type { User } from "../src/types/user";
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  nombre: string;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

export interface SocialLoginData {
  provider: "google" | "facebook";
  token: string;
  email: string;
  name: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}
const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/login", credentials);

      if (response.data.token) {
        localStorage.setItem("nova_token", response.data.token);
        localStorage.setItem("nova_user", JSON.stringify(response.data.user));
        localStorage.setItem("nova_session_active", "true");
      }

      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
  },
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/register", {
        // ← Solo "/auth/register", no la URL completa
        nombre: userData.nombre,
        email: userData.email,
        password: userData.password,
      });

      console.log("authService - Respuesta API:", response.data); // ← AGREGAR

      if (response.data.token) {
        localStorage.setItem("nova_token", response.data.token);
        localStorage.setItem("nova_user", JSON.stringify(response.data.user));
        localStorage.setItem("nova_session_active", "true");
      }

      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error: any) {
      console.error("authService - Error completo:", {
        // ← AGREGAR MÁS DETALLES
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
        },
      });

      return {
        success: false,
        message: error.response?.data?.message || "Error al registrar usuario",
      };
    }
  },

  async socialLogin(data: SocialLoginData): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/social", data);

      if (response.data.token) {
        localStorage.setItem("nova_token", response.data.token);
        localStorage.setItem("nova_user", JSON.stringify(response.data.user));
        localStorage.setItem("nova_session_active", "true");
      }

      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error en login social",
      };
    }
  },
  logout(): void {
    localStorage.removeItem("nova_token");
    localStorage.removeItem("nova_user");
    localStorage.removeItem("nova_session_active");
    localStorage.removeItem("nova_location_set");
    localStorage.removeItem("nova_auth_skipped");
  },
  isAuthenticated(): boolean {
    const token = localStorage.getItem("nova_token");
    const sessionActive = localStorage.getItem("nova_session_active");

    return !!token && sessionActive === "true";
  },
  getToken(): string | null {
    return localStorage.getItem("nova_token");
  },
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("nova_user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
  async updateProfile(userData: Partial<User>): Promise<AuthResponse> {
    try {
      const response = await api.put("/auth/profile", userData);

      const currentUser = this.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem("nova_user", JSON.stringify(updatedUser));
      }

      return {
        success: true,
        user: response.data.user,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al actualizar perfil",
      };
    }
  },

  async forgotPassword(
    data: ForgotPasswordData,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      await api.post("/auth/forgot-password", data);
      return {
        success: true,
        message: "Se ha enviado un correo con instrucciones",
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Error al solicitar restablecimiento",
      };
    }
  },

  async resetPassword(
    data: ResetPasswordData,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      await api.post("/auth/reset-password", data);
      return {
        success: true,
        message: "Contraseña restablecida exitosamente",
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al restablecer contraseña",
      };
    }
  },
  async validateToken(): Promise<{ valid: boolean; user?: User }> {
    try {
      const token = this.getToken();
      if (!token) return { valid: false };

      const response = await api.get("/auth/validate");
      return {
        valid: true,
        user: response.data.user,
      };
    } catch {
      return { valid: false };
    }
  },
  guestLogin(): User {
    const guestUser: User = {
      id: "guest_" + Date.now(),
      nombre: "Invitado",
      email: "",
      phone: "",
      address: "",
      fechaCreacion: new Date().toISOString(),
      esPremium: false,
      guest: true,
      pedidos: [],
      favoritos: [],
      birthDate: "",
      avatar: "",
      role: "user",
      permisos: [],
    };
    localStorage.setItem("nova_user", JSON.stringify(guestUser));
    localStorage.setItem("nova_session_active", "true");
    return guestUser;
  },
  saveLocationSession(): void {
    localStorage.setItem("nova_location_set", "true");
  },
  skipAuth(): void {
    localStorage.setItem("nova_auth_skipped", "true");
    this.guestLogin();
  },
  isAuthSkipped(): boolean {
    return localStorage.getItem("nova_auth_skipped") === "true";
  },
  isLocationSet(): boolean {
    return localStorage.getItem("nova_location_set") === "true";
  },
  isGuestUser(): boolean {
    const user = this.getCurrentUser();
    return user?.guest === true;
  },
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem("nova_refresh_token");
      if (!refreshToken) return false;

      const response = await api.post("/auth/refresh", { refreshToken });

      if (response.data.token) {
        localStorage.setItem("nova_token", response.data.token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
  clearGuestSession(): void {
    if (this.isGuestUser()) {
      this.logout();
    }
  },
};
export const socialLogin = async (
  provider: "google" | "facebook",
  accessToken: string,
): Promise<AuthResponse> => {
  try {
    const response = await api.post(`/auth/social/${provider}`, {
      token: accessToken,
    });

    if (response.data.token) {
      localStorage.setItem("nova_token", response.data.token);
      localStorage.setItem("nova_user", JSON.stringify(response.data.user));
      localStorage.setItem("nova_session_active", "true");
    }

    return {
      success: true,
      token: response.data.token,
      user: response.data.user,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || `Error al autenticar con ${provider}`,
    };
  }
};
export default authService;
