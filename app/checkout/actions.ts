"use server";

import { z } from "zod";
import { createSupabaseAdminClient } from "../../lib/supabase/admin";
import { getProductBySlug } from "../../lib/repositories/products";

const createOrderSchema = z.object({
  slug: z.string().min(1),
  customerName: z.string().min(2, "Informe seu nome."),
  customerEmail: z.email("Informe um e-mail válido."),
});

export type CreateOrderActionResult =
  | {
      success: true;
      orderId: string;
      productType: "own" | "affiliate";
      affiliateUrl?: string;
    }
  | {
      success: false;
      message: string;
    };

export async function createOrderAction(
  input: z.infer<typeof createOrderSchema>
): Promise<CreateOrderActionResult> {
  const parsed = createOrderSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const { slug, customerName, customerEmail } = parsed.data;

  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      success: false,
      message: "Produto não encontrado.",
    };
  }

  const supabase = createSupabaseAdminClient();

  const payload = {
    product_id: product.id,
    product_type: product.type,
    product_title_snapshot: product.title,
    product_price_snapshot: product.price,
    affiliate_destination_url_snapshot:
      product.type === "affiliate" ? product.affiliateUrl : null,
    customer_name: customerName.trim(),
    customer_email: customerEmail.trim().toLowerCase(),
    source: "site",
    checkout_type: product.type === "affiliate" ? "affiliate" : "internal",
    order_status: product.type === "affiliate" ? "redirected_to_affiliate" : "new",
    payment_status: product.type === "affiliate" ? "not_applicable" : "pending",
    referrer_path: `/produto/${product.slug}`,
  };

  const { data, error } = await supabase
    .from("orders")
    .insert(payload)
    .select("id")
    .single();

  if (error || !data) {
    return {
      success: false,
      message: error?.message ?? "Não foi possível criar o pedido.",
    };
  }

  return {
    success: true,
    orderId: data.id,
    productType: product.type,
    affiliateUrl: product.type === "affiliate" ? product.affiliateUrl : undefined,
  };
}