import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Order } from "../context/AuthContext";

export interface CancelOrderParams {
  orderId: string;
  reason: string;
}

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      setTimeout(() => {
        setOrders(user.pedidos || []);
        setIsLoading(false);
      }, 1000);
    }
  }, [user]);
  type OrderStats = {
    total: number;
    delivered: number;
    processing: number;
    shipped: number;
    totalSpent: number;
  };
  const cancelOrder = async ({
    orderId,
    reason,
  }: CancelOrderParams): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order,
        ),
      );
      console.log(`Pedido ${orderId} cancelado: ${reason}`);
    } catch (error) {
      console.error("Error al cancelar pedido:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInvoice = async ({
    orderId,
  }: {
    orderId: string;
  }): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log(`Factura para pedido ${orderId} descargada`);
    } catch (error) {
      console.error("Error al descargar factura:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderStats = (): OrderStats => {
    return {
      total: orders.length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      totalSpent: orders.reduce((sum, order) => sum + order.total_amount, 0),
    };
  };

  const addOrder = (newOrder: Order): void => {
    setOrders((prevOrders) => [...prevOrders, newOrder]);
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((order) => order.id === orderId);
  };

  return {
    orders,
    isLoading,
    cancelOrder,
    downloadInvoice,
    getOrderStats,
    addOrder,
    getOrderById,
  };
};

export default useOrders;
