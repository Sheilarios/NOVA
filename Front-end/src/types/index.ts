export interface Product {
  date?: string | Date;
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "men" | "women";
  sizes: string[];
  colors: string[];
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  wishlist: number[];
  cart: CartItem[];
  guest?: boolean;
}
export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total_amount: number;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  estimatedDelivery?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  fechaNacimiento?: string;
  esPremium?: boolean;
  fechaCreacion: string;
  pedidos?: Order[];
  favoritos?: string[];
  guest?: boolean;
}
