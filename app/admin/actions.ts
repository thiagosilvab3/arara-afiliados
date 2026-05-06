"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "../../lib/auth";
import { createSupabaseServerClient } from "../../lib/supabase/server";

const productStatusSchema = z.enum(["draft", "active", "inactive", "archived"]);
const productTypeSchema = z.enum(["own", "affiliate"]);
const nicheSchema = z.enum([
  "Marketing Digital",
  "Finanças",
  "Fitness",
  "Idiomas",
]);

const baseProductSchema = z
  .object({
    slug: z
      .string()
      .min(1, "Slug é obrigatório.")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use apenas letras minúsculas, números e hífen no slug."
      ),
    title: z.string().min(2, "Título é obrigatório."),
    niche: nicheSchema,
    shortDescription: z.string().min(5, "Descrição curta é obrigatória."),
    longDescription: z.string().min(10, "Descrição longa é obrigatória."),
    price: z.coerce.number().min(0, "Preço inválido."),
    originalPrice: z.coerce.number().min(0).optional().nullable(),
    popularity: z.coerce.number().min(0).max(100),
    rating: z.coerce.number().min(0).max(5),
    platform: z.string().min(2, "Plataforma é obrigatória."),
    affiliateUrl: z.string().optional().nullable(),
    productType: productTypeSchema,
    highlights: z.array(z.string()).default([]),
    imageUrl: z.string().optional().nullable(),
    featured: z.coerce.boolean().default(false),
    productStatus: productStatusSchema.default("draft"),
  })
  .superRefine((data, ctx) => {
    if (data.productType === "affiliate") {
      if (!data.affiliateUrl || data.affiliateUrl.trim().length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["affiliateUrl"],
          message: "URL de afiliado é obrigatória para produto afiliado.",
        });
      }
    }
  });

const createProductSchema = baseProductSchema;

const updateProductSchema = baseProductSchema.extend({
  productId: z.string().uuid("ID do produto inválido."),
});

export type CreateProductActionResult =
  | { success: true; productId: string }
  | { success: false; message: string };

export type UpdateProductActionResult =
  | { success: true }
  | { success: false; message: string };

export type DeleteProductActionResult =
  | { success: true }
  | { success: false; message: string };

export async function createProductAction(
  input: z.input<typeof createProductSchema>
): Promise<CreateProductActionResult> {
  const admin = await requireAdmin();

  const parsed = createProductSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const data = parsed.data;
  const supabase = await createSupabaseServerClient();

  const { data: inserted, error } = await supabase
    .from("products")
    .insert({
      slug: data.slug.trim(),
      title: data.title.trim(),
      niche: data.niche,
      short_description: data.shortDescription.trim(),
      long_description: data.longDescription.trim(),
      price: data.price,
      original_price: data.originalPrice ?? null,
      popularity: data.popularity,
      rating: data.rating,
      platform: data.platform.trim(),
      affiliate_url:
        data.productType === "affiliate"
          ? data.affiliateUrl?.trim() || null
          : null,
      product_type: data.productType,
      highlights: data.highlights,
      image_url: data.imageUrl?.trim() || null,
      featured: data.featured,
      product_status: data.productStatus,
      created_by: admin.id,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return {
      success: false,
      message: error?.message ?? "Não foi possível criar o produto.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/produto/${data.slug}`);

  return {
    success: true,
    productId: inserted.id,
  };
}

export async function updateProductAction(
  input: z.input<typeof updateProductSchema>
): Promise<UpdateProductActionResult> {
  await requireAdmin();

  const parsed = updateProductSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const data = parsed.data;
  const supabase = await createSupabaseServerClient();

  const { data: existing, error: existingError } = await supabase
    .from("products")
    .select("slug")
    .eq("id", data.productId)
    .maybeSingle();

  if (existingError || !existing) {
    return {
      success: false,
      message: "Produto não encontrado.",
    };
  }

  const { error } = await supabase
    .from("products")
    .update({
      slug: data.slug.trim(),
      title: data.title.trim(),
      niche: data.niche,
      short_description: data.shortDescription.trim(),
      long_description: data.longDescription.trim(),
      price: data.price,
      original_price: data.originalPrice ?? null,
      popularity: data.popularity,
      rating: data.rating,
      platform: data.platform.trim(),
      affiliate_url:
        data.productType === "affiliate"
          ? data.affiliateUrl?.trim() || null
          : null,
      product_type: data.productType,
      highlights: data.highlights,
      image_url: data.imageUrl?.trim() || null,
      featured: data.featured,
      product_status: data.productStatus,
    })
    .eq("id", data.productId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/produto/${existing.slug}`);
  revalidatePath(`/produto/${data.slug}`);

  return { success: true };
}

export async function deleteProductAction(
  productId: string
): Promise<DeleteProductActionResult> {
  await requireAdmin();

  if (!productId) {
    return {
      success: false,
      message: "ID do produto é obrigatório.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("products").delete().eq("id", productId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return { success: true };
}