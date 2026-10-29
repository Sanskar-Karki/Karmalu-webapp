import type { Brand } from "@/types";

export type OrderStatus =
  | "Pending WhatsApp"
  | "Contacted"
  | "Confirmed"
  | "Packing"
  | "Dispatched"
  | "Delivered"
  | "Cancelled"
  | "Expired";

export interface OrderItem {
  productSlug: string;
  name: string;
  quantity: number;
  price: number; // unit price
  size?: string;
  color?: string;
}

export interface OrderAddress {
  province: string;
  district: string;
  municipality: string;
  ward: string;
  street: string;
  country: string;
}

/** Payload the checkout form sends to /api/orders. */
export interface CreateOrderInput {
  brand: Brand;
  customerName: string;
  whatsappNumber: string;
  email?: string;
  address: OrderAddress;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  deliveryMethod?: string;
  paymentMethod?: string;
}

/** A persisted order (what /api/orders returns). */
export interface Order extends CreateOrderInput {
  orderId: string;
  status: OrderStatus;
  createdAt: string; // ISO timestamp
}
