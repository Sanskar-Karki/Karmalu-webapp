import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createOrder, isSupabaseConfigured } from "@/lib/orders";
import { createClient } from "@/utils/supabase/server";
import type { CreateOrderInput } from "@/types/order";

// Orders write to the filesystem (local fallback) / external DB — never static.
export const dynamic = "force-dynamic";

function isNonEmpty(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export async function POST(req: Request) {
  let body: Partial<CreateOrderInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // ── Server-side validation of required fields ──
  const errors: string[] = [];
  if (!isNonEmpty(body.customerName)) errors.push("customerName");
  if (!isNonEmpty(body.whatsappNumber)) errors.push("whatsappNumber");
  const addr = body.address;
  if (
    !addr ||
    !isNonEmpty(addr.street) ||
    !isNonEmpty(addr.city) ||
    !isNonEmpty(addr.country)
  ) {
    errors.push("address");
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push("items");
  }
  if (typeof body.total !== "number" || body.total < 0) errors.push("total");

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Missing or invalid fields.", fields: errors },
      { status: 422 },
    );
  }

  try {
    const supabase = isSupabaseConfigured
      ? createClient(await cookies())
      : undefined;

    const order = await createOrder(
      {
      brand: body.brand ?? "activewear",
      customerName: body.customerName!.trim(),
      whatsappNumber: body.whatsappNumber!.trim(),
      email: isNonEmpty(body.email) ? body.email.trim() : undefined,
      address: {
        street: addr!.street.trim(),
        city: addr!.city.trim(),
        state: (addr!.state ?? "").trim(),
        zip: (addr!.zip ?? "").trim(),
        country: addr!.country.trim(),
      },
      notes: isNonEmpty(body.notes) ? body.notes.trim() : undefined,
      items: body.items!.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        size: isNonEmpty(i.size) ? i.size : undefined,
        color: isNonEmpty(i.color) ? i.color : undefined,
      })),
      subtotal: body.subtotal ?? 0,
      deliveryCharge: body.deliveryCharge ?? 0,
      total: body.total!,
      deliveryMethod: isNonEmpty(body.deliveryMethod)
        ? body.deliveryMethod
        : undefined,
      paymentMethod: isNonEmpty(body.paymentMethod)
        ? body.paymentMethod
        : undefined,
      },
      supabase,
    );

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error("[orders] failed to save order:", err);
    return NextResponse.json(
      { error: "We couldn't save your order. Please try again." },
      { status: 500 },
    );
  }
}
