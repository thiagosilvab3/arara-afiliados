"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "../../../lib/auth";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

const orderStatusSchema = z.enum([
  "new",
  "contact_pending",
  "contacted",
  "awaiting_payment_manual",
  "redirected_to_affiliate",
  "converted",
  "cancelled",
  "lost",
]);

const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid("ID do pedido inválido."),
  orderStatus: orderStatusSchema,
});

export type UpdateOrderStatusActionResult =
  | { success: true }
  | { success: false; message: string };

export async function updateOrderStatusAction(
  input: z.input<typeof updateOrderStatusSchema>
): Promise<UpdateOrderStatusActionResult> {
  await requireAdmin();

  const parsed = updateOrderStatusSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const data = parsed.data;
  const supabase = await createSupabaseServerClient();

  const { error, data: updated } = await supabase
    .from("orders")
    .update({
      order_status: data.orderStatus,
    })
    .eq("id", data.orderId)
    .select("id")
    .single();

  if (error || !updated) {
    return {
      success: false,
      message: error?.message ?? "Não foi possível atualizar o pedido.",
    };
  }

  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");

  return { success: true };
}