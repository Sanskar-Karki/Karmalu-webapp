import type { Brand } from "@/types";

export type OrderStatus =
  | "Awaiting WhatsApp Confirmation"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number; // unit price
  size?: string;
  color?: string;
}

export interface OrderAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
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
