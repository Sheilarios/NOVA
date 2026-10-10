import type { Order } from "./order";
export type User = {
  id: string;
  nombre: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  esPremium: boolean;
  fechaCreacion: string;
  pedidos: any[];
  favoritos: any[];
  guest: boolean;
  avatar: string;
  role: "admin" | "user"; 
  permisos: any[];
};
export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export interface UserType {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: string;
  fechaCreacion: string;
  esPremium: boolean;
  guest?: boolean;
  pedidos?: Order[];
  favoritos?: string[];
  avatar?: string;
}
