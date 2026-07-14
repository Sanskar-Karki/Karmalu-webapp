import type { SupabaseClient } from "@supabase/supabase-js";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { CreateOrderInput, Order } from "@/types/order";

/**
 * Order persistence layer (the "Karmify database").
 *
 * Source of truth = Supabase when NEXT_PUBLIC_SUPABASE_URL +
 * NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set. Until then it transparently
 * falls back to a local JSON file so the checkout flow stays functional in
 * development. Either way an order is always persisted BEFORE the customer is
 * redirected to WhatsApp.
 *
 * The publishable (anon) key respects Row Level Security, so the `orders`
 * table must have an INSERT policy for the anon role (see supabase/orders.sql).
 */

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);

const LOCAL_FILE = path.join(process.cwd(), "data", "orders.json");

function pad(n: number, width: number) {
  return String(n).padStart(width, "0");
}

/** KRM-YYYYMMDD-NNNN — NNNN is the count of orders already placed today + 1. */
function buildOrderId(todayCount: number): string {
  const now = new Date();
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(
    now.getDate(),
    2,
  )}`;
  return `KRM-${datePart}-${pad(todayCount + 1, 4)}`;
}

function todayPrefix(): string {
  const now = new Date();
  return `KRM-${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(
    now.getDate(),
    2,
  )}-`;
}

// ── Local JSON fallback ──────────────────────────────────────────────
async function readLocal(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8");
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

async function writeLocal(orders: Order[]): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(orders, null, 2), "utf8");
}

async function createLocalOrder(input: CreateOrderInput): Promise<Order> {
  const orders = await readLocal();
  const prefix = todayPrefix();
  const todayCount = orders.filter((o) => o.orderId.startsWith(prefix)).length;
  const order: Order = {
    ...input,
    orderId: buildOrderId(todayCount),
    status: "Awaiting WhatsApp Confirmation",
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  await writeLocal(orders);
  return order;
}

// ── Public API ───────────────────────────────────────────────────────
/**
 * Persist an order. Pass a Supabase server client to use the database;
 * omit it (or leave env unset) to use the local JSON fallback.
 */
export async function createOrder(
  input: CreateOrderInput,
  supabase?: SupabaseClient,
): Promise<Order> {
  if (!supabase || !isSupabaseConfigured) {
    return createLocalOrder(input);
  }

  // Atomic, RLS-safe insert via the security-definer RPC, which generates the
  // sequential KRM-YYYYMMDD-NNNN id server-side and returns it.
  const { data, error } = await supabase.rpc("create_order", {
    payload: {
      brand: input.brand,
      customerName: input.customerName,
      whatsappNumber: input.whatsappNumber,
      email: input.email ?? null,
      address: input.address,
      notes: input.notes ?? null,
      items: input.items,
      subtotal: input.subtotal,
      deliveryCharge: input.deliveryCharge,
      total: input.total,
      deliveryMethod: input.deliveryMethod ?? null,
      paymentMethod: input.paymentMethod ?? null,
    },
  });
  if (error) throw new Error(error.message);

  return {
    ...input,
    orderId: data as string,
    status: "Awaiting WhatsApp Confirmation",
    createdAt: new Date().toISOString(),
  };
}
