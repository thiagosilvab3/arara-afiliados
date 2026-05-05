import { createSupabaseServerClient } from "../supabase/server";
import { Product } from "../types";

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
  product_status: "draft" | "active" | "inactive" | "archived";
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
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
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

export async function listProducts() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("product_status", "active")
    .order("featured", { ascending: false })
    .order("popularity", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapProduct(row as ProductRow));
}

export async function getProductBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("product_status", "active")
    .single();

  if (error || !data) {
    return null;
  }

  return mapProduct(data as ProductRow);
}