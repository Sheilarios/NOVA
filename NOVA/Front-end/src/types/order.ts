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
  paymentMethod: string;
  date?: string;
  orderNumber?: string;
  shippingAddress?: {
    name: string;
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
}
