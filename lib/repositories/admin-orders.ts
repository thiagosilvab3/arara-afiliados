import { createSupabaseServerClient } from "../supabase/server";
import type { AdminOrder } from "../types";

type OrderRow = {
  id: string;
  product_id: string | null;
  product_type: AdminOrder["productType"];
  product_title_snapshot: string;
  product_price_snapshot: number | string;
  affiliate_destination_url_snapshot: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  preferred_contact_channel: AdminOrder["preferredContactChannel"] | null;
  payment_preference: AdminOrder["paymentPreference"] | null;
  notes: string | null;
  source: string;
  checkout_type: string;
  order_status: AdminOrder["orderStatus"];
  payment_status: AdminOrder["paymentStatus"];
  created_at: string;
};

function mapOrder(row: OrderRow): AdminOrder {
  return {
    id: row.id,
    productId: row.product_id ?? undefined,
    productType: row.product_type,
    productTitleSnapshot: row.product_title_snapshot,
    productPriceSnapshot: Number(row.product_price_snapshot),
    affiliateDestinationUrlSnapshot:
      row.affiliate_destination_url_snapshot ?? undefined,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone ?? undefined,
    preferredContactChannel: row.preferred_contact_channel ?? undefined,
    paymentPreference: row.payment_preference ?? undefined,
    notes: row.notes ?? undefined,
    source: row.source,
    checkoutType: row.checkout_type,
    orderStatus: row.order_status,
    paymentStatus: row.payment_status,
    createdAt: row.created_at,
  };
}

export async function listAdminOrders() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapOrder(row as OrderRow));
}