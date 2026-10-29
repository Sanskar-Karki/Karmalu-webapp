import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createOrder, isSupabaseConfigured } from "@/lib/orders";
import { createClient } from "@/utils/supabase/server";
import type { CreateOrderInput } from "@/types/order";
import { getCatalog } from "@/lib/catalog-server";

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

  const brand = body.brand;
  if (brand !== "originals" && brand !== "decor") {
    return NextResponse.json(
      { error: "Invalid brand." },
      { status: 422 },
    );
  }
  const errors: string[] = [];
  if (!isNonEmpty(body.customerName)) errors.push("customerName");
  if (!isNonEmpty(body.whatsappNumber)) errors.push("whatsappNumber");
  const phoneDigits = isNonEmpty(body.whatsappNumber)
    ? body.whatsappNumber.replace(/\D/g, "").length
    : 0;
  if (phoneDigits < 10 || phoneDigits > 15) errors.push("whatsappNumber");
  const addr = body.address;
  if (
    !addr ||
    !isNonEmpty(addr.street) ||
    !isNonEmpty(addr.province) ||
    !isNonEmpty(addr.district) ||
    !isNonEmpty(addr.municipality) ||
    !isNonEmpty(addr.ward) ||
    !isNonEmpty(addr.country)
  ) {
    errors.push("address");
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push("items");
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Missing or invalid fields.", fields: errors },
      { status: 422 },
    );
  }

  const items: CreateOrderInput["items"] = [];
  for (const [index, requested] of body.items!.entries()) {
    if (!requested || !isNonEmpty(requested.productSlug)) {
      errors.push(`items.${index}.productSlug`);
      continue;
    }
    const product = (await getCatalog()).getProduct(brand, requested.productSlug);
    if (!product) {
      errors.push(`items.${index}.productSlug`);
      continue;
    }
    if (!Number.isInteger(requested.quantity) || requested.quantity < 1 || requested.quantity > 99) {
      errors.push(`items.${index}.quantity`);
      continue;
    }
    if (
      (product.sizes?.length && (!isNonEmpty(requested.size) || !product.sizes.includes(requested.size))) ||
      (requested.size && !product.sizes?.includes(requested.size))
    ) {
      errors.push(`items.${index}.size`);
      continue;
    }
    if (
      product.colors?.length &&
      (!isNonEmpty(requested.color) ||
        !product.colors.some((color) => color.label === requested.color))
    ) {
      errors.push(`items.${index}.color`);
      continue;
    }

    items.push({
      productSlug: product.slug,
      name: product.name,
      quantity: requested.quantity,
      price: product.price,
      size: requested.size,
      color: product.colors?.length ? requested.color : undefined,
    });
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Some product or variant details are invalid. Please check your selections.", fields: errors },
      { status: 422 },
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = 0;

  try {
    const supabase = isSupabaseConfigured
      ? createClient(await cookies())
      : undefined;

    const order = await createOrder(
      {
      brand,
      customerName: body.customerName!.trim(),
      whatsappNumber: body.whatsappNumber!.trim(),
      email: isNonEmpty(body.email) ? body.email.trim() : undefined,
      address: {
        street: addr!.street.trim(),
        province: addr!.province.trim(),
        district: addr!.district.trim(),
        municipality: addr!.municipality.trim(),
        ward: addr!.ward.trim(),
        country: addr!.country.trim(),
      },
      notes: isNonEmpty(body.notes) ? body.notes.trim() : undefined,
      items,
      subtotal,
      deliveryCharge,
      total: subtotal + deliveryCharge,
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
