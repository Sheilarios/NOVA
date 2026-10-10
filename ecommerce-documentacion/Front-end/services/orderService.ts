import api from "../api/axiosInstance";

export interface OrderFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
  updated_at: string;
  shipping_address: string;
  billing_address: string;
  payment_method: string;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  shipping_method: string;
  tracking_number?: string;
  estimated_delivery?: string;
  items: OrderItem[];
  customer_note?: string;
}

export interface OrderItem {
  id: string;
  product_name: string;
  product_id: string;
  image: string;
  quantity: number;
  unit_price: number;
  size?: string;
  color?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const orderService = {
  async getOrders(userId: string, filters?: OrderFilters): Promise<ApiResponse<Order[]>> {
    try {
      let url = `/users/${userId}/orders`;
      
      if (filters) {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }
      
      const response = await api.get(url);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener pedidos",
      };
    }
  },

  async getOrderById(userId: string, orderId: string): Promise<ApiResponse<Order>> {
    try {
      const response = await api.get(`/users/${userId}/orders/${orderId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener el pedido",
      };
    }
  },

  async cancelOrder(orderId: string, data: { reason: string }): Promise<ApiResponse<null>> {
    try {
      await api.post(`/orders/${orderId}/cancel`, data);
      return {
        success: true,
        message: "Pedido cancelado exitosamente",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al cancelar el pedido",
      };
    }
  },

  async downloadInvoice(orderId: string): Promise<ApiResponse<Blob>> {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob'
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al descargar factura",
      };
    }
  },

  async repeatOrder(orderId: string): Promise<ApiResponse<null>> {
    try {
      await api.post(`/orders/${orderId}/repeat`);
      return {
        success: true,
        message: "Productos agregados al carrito",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al repetir el pedido",
      };
    }
  },
};