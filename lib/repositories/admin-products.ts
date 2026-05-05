import { createSupabaseAdminClient } from "../supabase/admin";
import type { Product } from "../types";

type ProductRow = {
  id: string;
  slug: string;
  title: string;
  niche: Product["niche"];
  short_description: string;
  long_description: string;
  price: number | string;
  original_price: number | string | null;
  popularity: number;
  rating: number | string;
  platform: string;
  affiliate_url: string | null;
  product_type: Product["type"];
  highlights: unknown;
  image_url: string | null;
  featured: boolean;
};

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    niche: row.niche,
    description: row.short_description,
    longDescription: row.long_description,
    price: Number(row.price),
    originalPrice:
      row.original_price != null ? Number(row.original_price) : undefined,
    popularity: row.popularity,
    rating: Number(row.rating),
    platform: row.platform,
    affiliateUrl: row.affiliate_url ?? "",
    type: row.product_type,
    highlights: toStringArray(row.highlights),
    imageUrl: row.image_url ?? undefined,
    featured: row.featured,
  };
}

export async function listAdminProducts() {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapProduct(row as ProductRow));
}