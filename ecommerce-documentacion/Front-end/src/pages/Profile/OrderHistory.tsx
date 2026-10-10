import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiDownload,
  FiRefreshCw,
  FiChevronRight,
  FiChevronLeft,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useLocale } from "../../context/LocaleContext";
import { orderService } from "../../../services/orderService";
import type { Order } from "../../../services/orderService";

const OrderHistory = () => {
  const { user } = useAuth();
  const { locale } = useLocale();

  const language = locale?.language || "es";

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const statusFilters = [
    {
      value: "all",
      label: language === "en" ? "All Orders" : "Todos los pedidos",
    },
    { value: "pending", label: language === "en" ? "Pending" : "Pendientes" },
    {
      value: "processing",
      label: language === "en" ? "Processing" : "Procesando",
    },
    { value: "shipped", label: language === "en" ? "Shipped" : "Enviados" },
    {
      value: "delivered",
      label: language === "en" ? "Delivered" : "Entregados",
    },
    {
      value: "cancelled",
      label: language === "en" ? "Cancelled" : "Cancelados",
    },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        console.log("No user ID available");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        console.log(`Fetching orders for user ${user.id}...`);

        const result = await orderService.getOrders(user.id, {
          status: selectedStatus === "all" ? undefined : selectedStatus,
          page: currentPage,
          limit: itemsPerPage,
        });

        console.log("Orders fetch result:", result);

        if (result.success && result.data) {
          console.log(`Loaded ${result.data.length} orders`);
          setOrders(result.data);
          setFilteredOrders(result.data);
        } else {
          console.warn("No orders or error:", result.message);
          setOrders([]);
          setFilteredOrders([]);
          if (orders.length > 0) {
            const errorMsg =
              language === "en"
                ? `Could not load orders: ${result.message}`
                : `No se pudieron cargar los pedidos: ${result.message}`;
            alert(errorMsg);
          }
        }
      } catch (error) {
        console.error("Error in fetchOrders:", error);
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id, selectedStatus, currentPage, language]);

  useEffect(() => {
    if (!orders.length) {
      setFilteredOrders([]);
      return;
    }

    if (selectedStatus === "all") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => {
        const orderStatus = order.status?.toLowerCase() || "";
        const filterStatus = selectedStatus.toLowerCase();
        return orderStatus === filterStatus;
      });
      setFilteredOrders(filtered);
    }
  }, [selectedStatus, orders]);

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
      pending: orders.filter((o) => o.status === "pending").length,
      totalSpent: orders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, order) => sum + (order.total_amount || 0), 0),
    };
    return stats;
  };

  const stats = getOrderStats();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FiClock className="text-yellow-500" />;
      case "processing":
        return <FiPackage className="text-blue-500" />;
      case "shipped":
        return <FiTruck className="text-purple-500" />;
      case "delivered":
        return <FiCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiPackage className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    if (language === "en") {
      const texts: Record<string, string> = {
        pending: "Pending",
        processing: "Processing",
        shipped: "Shipped",
        delivered: "Delivered",
        cancelled: "Cancelled",
      };
      return texts[status] || status;
    } else {
      const texts: Record<string, string> = {
        pending: "Pendiente",
        processing: "Procesando",
        shipped: "Enviado",
        delivered: "Entregado",
        cancelled: "Cancelado",
      };
      return texts[status] || status;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return language === "en" ? "No date" : "Sin fecha";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return language === "en" ? "Invalid date" : "Fecha inválida";
      }

      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "short",
        year: "numeric",
      };

      if (language === "en") {
        return date.toLocaleDateString("en-US", options);
      } else {
        return date.toLocaleDateString("es-ES", options);
      }
    } catch (error) {
      return language === "en" ? "Date error" : "Error en fecha";
    }
  };

  const formatCurrency = (amount?: number) => {
    const safeAmount = amount || 0;
    const currency = locale?.currency || "PEN";

    if (currency.includes("PEN")) {
      return `S/. ${safeAmount.toFixed(2)}`;
    } else if (currency.includes("EUR")) {
      return `€ ${safeAmount.toFixed(2)}`;
    } else if (currency.includes("USD")) {
      return `$ ${safeAmount.toFixed(2)}`;
    } else {
      return `S/. ${safeAmount.toFixed(2)}`;
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const cancelOrder = async (orderId: string) => {
    const confirmMessage =
      language === "en"
        ? "Are you sure you want to cancel this order?"
        : "¿Estás seguro de que quieres cancelar este pedido?";

    if (window.confirm(confirmMessage)) {
      setActionLoading(orderId);
      try {
        const result = await orderService.cancelOrder(orderId, {
          reason:
            language === "en"
              ? "Cancelled by customer"
              : "Cancelado por el cliente",
        });

        if (result.success) {
          setOrders(
            orders.map((order) =>
              order.id === orderId
                ? {
                    ...order,
                    status: "cancelled",
                    updated_at: new Date().toISOString(),
                    payment_status: "refunded",
                  }
                : order,
            ),
          );

          const successMessage =
            language === "en"
              ? "Order cancelled successfully"
              : "Pedido cancelado exitosamente";
          alert(successMessage);

          if (selectedOrder?.id === orderId) {
            setSelectedOrder(null);
          }
        } else {
          alert(
            result.message ||
              (language === "en"
                ? "Error cancelling order"
                : "Error al cancelar el pedido"),
          );
        }
      } catch (error) {
        console.error("Cancel order error:", error);
        const errorMessage =
          language === "en"
            ? "Error cancelling order"
            : "Error al cancelar el pedido";
        alert(errorMessage);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const downloadInvoice = async (orderId: string) => {
    setActionLoading(`invoice-${orderId}`);
    try {
      const result = await orderService.downloadInvoice(orderId);

      if (result.success && result.data) {
        const url = window.URL.createObjectURL(result.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        alert(
          result.message ||
            (language === "en"
              ? "Error downloading invoice"
              : "Error al descargar la factura"),
        );
      }
    } catch (error) {
      console.error("Download invoice error:", error);
      const errorMessage =
        language === "en"
          ? "Error downloading invoice"
          : "Error al descargar la factura";
      alert(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const repeatOrder = async (orderId: string) => {
    setActionLoading(`repeat-${orderId}`);
    try {
      const result = await orderService.repeatOrder(orderId);

      if (result.success) {
        const successMessage =
          language === "en"
            ? "Products added to cart"
            : "Productos añadidos al carrito";
        alert(successMessage);

        window.location.href = "/cart";
      } else {
        alert(
          result.message ||
            (language === "en"
              ? "Error repeating order"
              : "Error al repetir el pedido"),
        );
      }
    } catch (error) {
      console.error("Repeat order error:", error);
      const errorMessage =
        language === "en"
          ? "Error repeating order"
          : "Error al repetir el pedido";
      alert(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const trackOrder = (order: Order) => {
    if (order.tracking_number) {
      window.open(
        `https://tracking.example.com/${order.tracking_number}`,
        "_blank",
      );
    } else {
      const alertMessage =
        language === "en"
          ? "No tracking number available for this order"
          : "No hay número de seguimiento disponible para este pedido";
      alert(alertMessage);
    }
  };

  const translations = {
    myOrders: language === "en" ? "My Orders" : "Mis Pedidos",
    reviewStatus:
      language === "en"
        ? "Review your previous purchases"
        : "Revisa el estado de tus compras anteriores",
    continueShopping:
      language === "en" ? "Continue Shopping" : "Seguir comprando",
    totalOrders: language === "en" ? "Total Orders" : "Total Pedidos",
    delivered: language === "en" ? "Delivered" : "Entregados",
    inProcess: language === "en" ? "In Process" : "En Proceso",
    totalSpent: language === "en" ? "Total Spent" : "Total Gastado",
    order: language === "en" ? "Order" : "Pedido",
    placedOn: language === "en" ? "Placed on" : "Realizado el",
    estimatedDelivery:
      language === "en" ? "Estimated delivery" : "Entrega estimada",
    products: language === "en" ? "products" : "productos",
    product: language === "en" ? "product" : "producto",
    moreProducts: language === "en" ? "more products" : "productos más",
    shippingAddress:
      language === "en" ? "Shipping Address" : "Dirección de envío",
    paymentMethod: language === "en" ? "Payment Method" : "Método de pago",
    viewDetails: language === "en" ? "View Details" : "Ver detalles",
    trackOrder: language === "en" ? "Track Order" : "Seguir pedido",
    downloadInvoice:
      language === "en" ? "Download Invoice" : "Descargar factura",
    cancelOrder: language === "en" ? "Cancel Order" : "Cancelar pedido",
    repeatOrder: language === "en" ? "Repeat Order" : "Repetir pedido",
    noOrders:
      language === "en" ? "You have no orders yet" : "No tienes pedidos aún",
    noFilteredOrders:
      language === "en"
        ? "No orders with this filter"
        : "No hay pedidos con este filtro",
    firstPurchase:
      language === "en"
        ? "When you make your first purchase, it will appear here"
        : "Cuando realices tu primera compra, aparecerá aquí",
    noOrdersWithStatus:
      language === "en"
        ? "No orders found with this status"
        : "No encontramos pedidos con este estado",
    exploreProducts:
      language === "en" ? "Explore Products" : "Explorar productos",
    orderDetails: language === "en" ? "Order Details" : "Detalles del Pedido",
    orderInformation:
      language === "en" ? "Order Information" : "Información del pedido",
    orderNumber: language === "en" ? "Order Number" : "Número de pedido",
    date: language === "en" ? "Date" : "Fecha",
    status: language === "en" ? "Status" : "Estado",
    paymentStatus: language === "en" ? "Payment Status" : "Estado de pago",
    shippingInfo:
      language === "en" ? "Shipping Information" : "Información de envío",
    shippingMethod: language === "en" ? "Shipping Method" : "Método de envío",
    trackingNumber:
      language === "en" ? "Tracking Number" : "Número de seguimiento",
    address: language === "en" ? "Address" : "Dirección",
    items: language === "en" ? "Items" : "Productos",
    size: language === "en" ? "Size" : "Talla",
    color: language === "en" ? "Color" : "Color",
    quantity: language === "en" ? "Quantity" : "Cantidad",
    each: language === "en" ? "each" : "c/u",
    paymentSummary: language === "en" ? "Payment Summary" : "Resumen de pago",
    subtotal: language === "en" ? "Subtotal" : "Subtotal",
    shipping: language === "en" ? "Shipping" : "Envío",
    taxes: language === "en" ? "Taxes" : "Impuestos",
    total: language === "en" ? "Total" : "Total",
    customerNote: language === "en" ? "Customer Note" : "Nota del cliente",
    close: language === "en" ? "Close" : "Cerrar",
    loadingOrders:
      language === "en"
        ? "Loading order history..."
        : "Cargando historial de pedidos...",
    toggleDetails:
      language === "en" ? "Show/Hide Details" : "Mostrar/Ocultar detalles",
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 mt-[200px] lg:mt-[120px] pb-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
          <p className="text-gray-600">{translations.loadingOrders}</p>
        </div>
      </div>
    );
  }

  return (
     <div className="min-h-screen bg-gray-50 mt-[200px] lg:mt-[120px] pb-12">
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif tracking-tight mb-2">
                {translations.myOrders}
              </h1>
              <p className="text-gray-600">{translations.reviewStatus}</p>
            </div>

            <Link
              to="/collection"
              className="px-6 py-3 bg-black text-white text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              {translations.continueShopping}
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-500">
                {translations.totalOrders}
              </p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-500">{translations.delivered}</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.delivered}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-500">{translations.inProcess}</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.processing + stats.shipped + stats.pending}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-500">{translations.totalSpent}</p>
              <p className="text-2xl font-bold">
                {formatCurrency(stats.totalSpent)}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setSelectedStatus(filter.value);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    selectedStatus === filter.value
                      ? "bg-black text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border overflow-hidden"
              >
                <div className="p-6 border-b">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(order.status)}
                        <h3 className="text-lg font-bold">
                          {translations.order} #{order.order_number}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {translations.placedOn} {formatDate(order.created_at)}
                      </p>
                      {order.estimated_delivery &&
                        order.status !== "cancelled" &&
                        order.status !== "delivered" && (
                          <p className="text-xs text-gray-500 mt-1">
                            {translations.estimatedDelivery}:{" "}
                            {formatDate(order.estimated_delivery)}
                          </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {formatCurrency(order.total_amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.items?.length || 0}{" "}
                          {order.items?.length === 1
                            ? translations.product
                            : translations.products}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setExpandedOrderId(
                            expandedOrderId === order.id ? null : order.id,
                          )
                        }
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title={translations.toggleDetails}
                      >
                        {expandedOrderId === order.id ? (
                          <FiChevronUp size={20} />
                        ) : (
                          <FiChevronDown size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {expandedOrderId === order.id && (
                  <div className="p-6 border-t">
                    <div className="mb-6">
                      <h4 className="font-medium mb-3">{translations.items}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {order.items?.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-3 p-3 border rounded-lg"
                          >
                            <img
                              src={item.image}
                              alt={item.product_name}
                              className="w-16 h-20 object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/64x80?text=Product";
                              }}
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm mb-1">
                                {item.product_name}
                              </h4>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {item.size && (
                                  <span className="text-xs text-gray-500">
                                    {translations.size}: {item.size}
                                  </span>
                                )}
                                {item.color && (
                                  <span className="text-xs text-gray-500">
                                    {translations.color}: {item.color}
                                  </span>
                                )}
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-500">
                                  {translations.quantity}: {item.quantity}
                                </p>
                                <p className="text-sm font-bold">
                                  {formatCurrency(item.unit_price)}{" "}
                                  {translations.each}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}

                        {order.items?.length > 3 && (
                          <div className="flex items-center justify-center">
                            <p className="text-gray-500 text-sm">
                              + {order.items.length - 3}{" "}
                              {translations.moreProducts}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                      <div>
                        <p className="font-medium mb-1">
                          {translations.shippingAddress}:
                        </p>
                        <p className="text-gray-600">
                          {order.shipping_address || "No especificada"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium mb-1">
                          {translations.paymentMethod}:
                        </p>
                        <p className="text-gray-600">
                          {order.payment_method || "No especificado"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4 border-t">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-4 py-2 text-sm border border-black text-black hover:bg-black hover:text-white transition-colors"
                      >
                        {translations.viewDetails}
                      </button>

                      {order.tracking_number && (
                        <button
                          onClick={() => trackOrder(order)}
                          className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <FiTruck size={14} />
                          {translations.trackOrder}
                        </button>
                      )}

                      <button
                        onClick={() => downloadInvoice(order.id)}
                        className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        disabled={
                          order.status === "cancelled" ||
                          actionLoading === `invoice-${order.id}`
                        }
                      >
                        {actionLoading === `invoice-${order.id}` ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                        ) : (
                          <FiDownload size={14} />
                        )}
                        {translations.downloadInvoice}
                      </button>

                      {["pending", "processing"].includes(order.status) && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="px-4 py-2 text-sm border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                          disabled={actionLoading === order.id}
                        >
                          {actionLoading === order.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            translations.cancelOrder
                          )}
                        </button>
                      )}

                      {order.status === "delivered" && (
                        <button
                          onClick={() => repeatOrder(order.id)}
                          className="px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
                          disabled={actionLoading === `repeat-${order.id}`}
                        >
                          {actionLoading === `repeat-${order.id}` ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <FiRefreshCw size={14} />
                              {translations.repeatOrder}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border">
              <FiPackage className="mx-auto text-gray-300 text-5xl mb-4" />
              <h3 className="text-xl font-light mb-2">
                {selectedStatus === "all"
                  ? translations.noOrders
                  : translations.noFilteredOrders}
              </h3>
              <p className="text-gray-500 mb-6">
                {selectedStatus === "all"
                  ? translations.firstPurchase
                  : translations.noOrdersWithStatus}
              </p>
              <Link
                to="/collection"
                className="inline-block bg-black text-white px-6 py-3 text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors"
              >
                {translations.exploreProducts}
              </Link>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 rounded-full"
            >
              <FiChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`w-8 h-8 rounded-full text-sm font-medium ${
                      currentPage === page
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 rounded-full"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 mt-[120px] lg:mt-[160px]">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {translations.orderDetails} #{selectedOrder.order_number}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-black"
              >
                <FiChevronLeft size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-medium mb-3">
                    {translations.orderInformation}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">
                        {translations.orderNumber}:
                      </span>{" "}
                      {selectedOrder.order_number}
                    </p>
                    <p>
                      <span className="text-gray-500">
                        {translations.date}:
                      </span>{" "}
                      {formatDate(selectedOrder.created_at)}
                    </p>
                    <p>
                      <span className="text-gray-500">
                        {translations.status}:
                      </span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}
                      >
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">
                        {translations.paymentStatus}:
                      </span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          selectedOrder.payment_status === "paid"
                            ? "bg-green-100 text-green-800"
                            : selectedOrder.payment_status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : selectedOrder.payment_status === "refunded"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedOrder.payment_status}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">
                    {translations.shippingInfo}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">
                        {translations.shippingMethod}:
                      </span>{" "}
                      {selectedOrder.shipping_method || "No especificado"}
                    </p>
                    {selectedOrder.tracking_number && (
                      <p>
                        <span className="text-gray-500">
                          {translations.trackingNumber}:
                        </span>{" "}
                        {selectedOrder.tracking_number}
                      </p>
                    )}
                    {selectedOrder.estimated_delivery && (
                      <p>
                        <span className="text-gray-500">
                          {translations.estimatedDelivery}:
                        </span>{" "}
                        {formatDate(selectedOrder.estimated_delivery)}
                      </p>
                    )}
                    <p className="mt-4">
                      <span className="text-gray-500 block mb-1">
                        {translations.address}:
                      </span>
                      {selectedOrder.shipping_address || "No especificada"}
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="font-medium mb-4">{translations.items}</h3>
              <div className="border rounded-lg overflow-hidden mb-8">
                {selectedOrder.items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center p-4 ${index !== selectedOrder.items.length - 1 ? "border-b" : ""}`}
                  >
                    <img
                      src={item.image}
                      alt={item.product_name}
                      className="w-20 h-24 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/80x96?text=Product";
                      }}
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium mb-1">{item.product_name}</h4>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
                        {item.size && (
                          <span>
                            {translations.size}: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span>
                            {translations.color}: {item.color}
                          </span>
                        )}
                        <span>
                          {translations.quantity}: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {formatCurrency(item.unit_price * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.unit_price)} {translations.each}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-medium mb-4">
                  {translations.paymentSummary}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {translations.subtotal}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(
                        selectedOrder.items.reduce(
                          (sum, item) => sum + item.unit_price * item.quantity,
                          0,
                        ),
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {translations.shipping}
                    </span>
                    <span className="font-medium">
                      {selectedOrder.shipping_method?.includes("Express")
                        ? formatCurrency(15.0)
                        : formatCurrency(8.0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{translations.taxes}</span>
                    <span className="font-medium">
                      {formatCurrency(selectedOrder.total_amount * 0.18)}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>{translations.total}</span>
                      <span>{formatCurrency(selectedOrder.total_amount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedOrder.customer_note && (
                <div className="mt-8">
                  <h3 className="font-medium mb-2">
                    {translations.customerNote}
                  </h3>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-gray-700">
                      {selectedOrder.customer_note}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t">
                <button
                  onClick={() => downloadInvoice(selectedOrder.id)}
                  className="px-6 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors flex items-center gap-2"
                  disabled={
                    selectedOrder.status === "cancelled" ||
                    actionLoading === `invoice-${selectedOrder.id}`
                  }
                >
                  {actionLoading === `invoice-${selectedOrder.id}` ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                  ) : (
                    <FiDownload size={16} />
                  )}
                  {translations.downloadInvoice}
                </button>

                {selectedOrder.tracking_number && (
                  <button
                    onClick={() => trackOrder(selectedOrder)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <FiTruck size={16} />
                    {translations.trackOrder}
                  </button>
                )}

                {["pending", "processing"].includes(selectedOrder.status) && (
                  <button
                    onClick={() => cancelOrder(selectedOrder.id)}
                    className="px-6 py-2 border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                    disabled={actionLoading === selectedOrder.id}
                  >
                    {actionLoading === selectedOrder.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    ) : (
                      translations.cancelOrder
                    )}
                  </button>
                )}

                {selectedOrder.status === "delivered" && (
                  <button
                    onClick={() => repeatOrder(selectedOrder.id)}
                    className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
                    disabled={actionLoading === `repeat-${selectedOrder.id}`}
                  >
                    {actionLoading === `repeat-${selectedOrder.id}` ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <FiRefreshCw size={16} />
                        {translations.repeatOrder}
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 text-gray-600 hover:text-black transition-colors ml-auto"
                >
                  {translations.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
