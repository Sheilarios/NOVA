import api from "../api/axiosInstance";
import type { User } from "../../src/types/user";
import type { AuthResponse, RegisterData } from "./authService";
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface UpdateProfileData {
  nombre?: string;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  completedOrders: number;
  pendingOrders: number;
  favoriteItems: number;
  memberSince: string;
  loyaltyPoints?: number;
  tier?: "bronze" | "silver" | "gold" | "platinum";
}

export interface WishlistItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  added_at: string;
}

export interface Address {
  id: string;
  title: string;
  full_name: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
}

const userService = {
  async getProfile(userId: string): Promise<ApiResponse<User>> {
    try {
      const response = await api.get(`/users/${userId}/profile`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener perfil",
      };
    }
  },

  async updateProfile(
    userId: string,
    data: UpdateProfileData,
  ): Promise<ApiResponse<User>> {
    try {
      const response = await api.put(`/users/${userId}/profile`, data);

      const currentUser = JSON.parse(localStorage.getItem("nova_user") || "{}");
      if (currentUser.id === userId) {
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem("nova_user", JSON.stringify(updatedUser));
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al actualizar perfil",
      };
    }
  },

  async changePassword(
    userId: string,
    data: ChangePasswordData,
  ): Promise<ApiResponse<null>> {
    try {
      await api.post(`/users/${userId}/change-password`, data);
      return {
        success: true,
        message: "Contraseña cambiada exitosamente",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al cambiar contraseña",
      };
    }
  },

  async uploadAvatar(
    userId: string,
    file: File,
  ): Promise<ApiResponse<{ avatar_url: string }>> {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await api.post(`/users/${userId}/avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const currentUser = JSON.parse(localStorage.getItem("nova_user") || "{}");
      if (currentUser.id === userId) {
        currentUser.avatar = response.data.avatar_url;
        localStorage.setItem("nova_user", JSON.stringify(currentUser));
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al subir avatar",
      };
    }
  },

  async deleteAccount(
    userId: string,
    password: string,
  ): Promise<ApiResponse<null>> {
    try {
      await api.delete(`/users/${userId}`, {
        data: { password },
      });

      localStorage.removeItem("nova_token");
      localStorage.removeItem("nova_user");
      localStorage.removeItem("nova_session_active");

      return {
        success: true,
        message: "Cuenta eliminada exitosamente",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al eliminar cuenta",
      };
    }
  },

  async getUserStats(userId: string): Promise<ApiResponse<UserStats>> {
    try {
      const response = await api.get(`/users/${userId}/stats`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al obtener estadísticas",
      };
    }
  },

  async getWishlist(userId: string): Promise<ApiResponse<WishlistItem[]>> {
    try {
      const response = await api.get(`/users/${userId}/wishlist`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener wishlist",
      };
    }
  },

  async addToWishlist(
    userId: string,
    productId: string,
  ): Promise<ApiResponse<WishlistItem>> {
    try {
      const response = await api.post(`/users/${userId}/wishlist`, {
        product_id: productId,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al agregar a wishlist",
      };
    }
  },

  async removeFromWishlist(
    userId: string,
    wishlistItemId: string,
  ): Promise<ApiResponse<null>> {
    try {
      await api.delete(`/users/${userId}/wishlist/${wishlistItemId}`);
      return {
        success: true,
        message: "Producto eliminado de wishlist",
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al eliminar de wishlist",
      };
    }
  },

  async isInWishlist(
    userId: string,
    productId: string,
  ): Promise<ApiResponse<{ in_wishlist: boolean }>> {
    try {
      const response = await api.get(
        `/users/${userId}/wishlist/check/${productId}`,
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al verificar wishlist",
      };
    }
  },

  async getAddresses(userId: string): Promise<ApiResponse<Address[]>> {
    try {
      const response = await api.get(`/users/${userId}/addresses`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al obtener direcciones",
      };
    }
  },

  async addAddress(
    userId: string,
    address: Omit<Address, "id" | "is_default">,
  ): Promise<ApiResponse<Address>> {
    try {
      const response = await api.post(`/users/${userId}/addresses`, address);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al agregar dirección",
      };
    }
  },

  async updateAddress(
    userId: string,
    addressId: string,
    address: Partial<Address>,
  ): Promise<ApiResponse<Address>> {
    try {
      const response = await api.put(
        `/users/${userId}/addresses/${addressId}`,
        address,
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al actualizar dirección",
      };
    }
  },

  async deleteAddress(
    userId: string,
    addressId: string,
  ): Promise<ApiResponse<null>> {
    try {
      await api.delete(`/users/${userId}/addresses/${addressId}`);
      return {
        success: true,
        message: "Dirección eliminada",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al eliminar dirección",
      };
    }
  },

  async setDefaultAddress(
    userId: string,
    addressId: string,
  ): Promise<ApiResponse<Address[]>> {
    try {
      const response = await api.patch(
        `/users/${userId}/addresses/${addressId}/default`,
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Error al establecer dirección por defecto",
      };
    }
  },

  async getNotificationPreferences(userId: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(
        `/users/${userId}/notifications/preferences`,
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al obtener preferencias",
      };
    }
  },

  async updateNotificationPreferences(
    userId: string,
    preferences: any,
  ): Promise<ApiResponse<any>> {
    try {
      const response = await api.put(
        `/users/${userId}/notifications/preferences`,
        preferences,
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al actualizar preferencias",
      };
    }
  },

  async subscribeToNewsletter(
    userId: string,
    email: string,
  ): Promise<ApiResponse<null>> {
    try {
      await api.post(`/users/${userId}/newsletter/subscribe`, { email });
      return {
        success: true,
        message: "Suscrito al newsletter exitosamente",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al suscribirse",
      };
    }
  },

  async unsubscribeFromNewsletter(userId: string): Promise<ApiResponse<null>> {
    try {
      await api.post(`/users/${userId}/newsletter/unsubscribe`);
      return {
        success: true,
        message: "Suscripción cancelada",
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al cancelar suscripción",
      };
    }
  },

  async checkNewsletterSubscription(
    userId: string,
  ): Promise<ApiResponse<{ subscribed: boolean }>> {
    try {
      const response = await api.get(`/users/${userId}/newsletter/status`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al verificar suscripción",
      };
    }
  },

  async getActivityHistory(
    userId: string,
    limit: number = 10,
  ): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get(
        `/users/${userId}/activity?limit=${limit}`,
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener historial",
      };
    }
  },

  async updatePremiumStatus(
    userId: string,
    isPremium: boolean,
  ): Promise<ApiResponse<User>> {
    try {
      const response = await api.patch(`/users/${userId}/premium`, {
        isPremium,
      });

      const currentUser = JSON.parse(localStorage.getItem("nova_user") || "{}");
      if (currentUser.id === userId) {
        currentUser.esPremium = isPremium;
        localStorage.setItem("nova_user", JSON.stringify(currentUser));
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al actualizar membresía",
      };
    }
  },

  async getLoyaltyPoints(
    userId: string,
  ): Promise<ApiResponse<{ points: number; tier: string }>> {
    try {
      const response = await api.get(`/users/${userId}/loyalty`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al obtener puntos de lealtad",
      };
    }
  },
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      console.log("Enviando registro:", {
        ...userData,
        password: "[PROTECTED]",
        confirmPassword: "[PROTECTED]",
      });

      const response = await api.post("/auth/register", userData);

      console.log("Respuesta de registro:", response.data);

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
      console.error("Error detallado en registro:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
        },
      });

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.response?.statusText ||
          "Error al registrar usuario",
      };
    }
  },
};

export default userService;
