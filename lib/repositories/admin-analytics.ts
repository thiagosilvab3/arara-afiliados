import { createSupabaseServerClient } from "../supabase/server";

export type AnalyticsSummary = {
  pageViews: number;
  productViews: number;
  checkoutStarts: number;
  leadSubmits: number;
  affiliateClicks: number;
};

export type TopViewedProduct = {
  productId?: string;
  slug: string;
  title: string;
  views: number;
};

type AnalyticsSummaryRow = {
  page_views: number | string | null;
  product_views: number | string | null;
  checkout_starts: number | string | null;
  lead_submits: number | string | null;
  affiliate_clicks: number | string | null;
};

type TopViewedProductRow = {
  product_id: string | null;
  slug: string | null;
  title: string | null;
  views: number | string | null;
};

function toNumber(value: number | string | null | undefined) {
  return Number(value ?? 0);
}

function mapSummary(row: AnalyticsSummaryRow | null): AnalyticsSummary {
  return {
    pageViews: toNumber(row?.page_views),
    productViews: toNumber(row?.product_views),
    checkoutStarts: toNumber(row?.checkout_starts),
    leadSubmits: toNumber(row?.lead_submits),
    affiliateClicks: toNumber(row?.affiliate_clicks),
  };
}

function mapTopViewedProduct(row: TopViewedProductRow): TopViewedProduct {
  return {
    productId: row.product_id ?? undefined,
    slug: row.slug ?? "sem-slug",
    title: row.title ?? row.slug ?? "Produto sem título",
    views: toNumber(row.views),
  };
}

export async function getAdminAnalytics() {
  const supabase = await createSupabaseServerClient();

  const { data: summaryData, error: summaryError } = await supabase
    .from("analytics_summary")
    .select("*")
    .maybeSingle();

  if (summaryError) {
    throw new Error(summaryError.message);
  }

  const { data: topProductsData, error: topProductsError } = await supabase
    .from("top_viewed_products")
    .select("*")
    .limit(10);

  if (topProductsError) {
    throw new Error(topProductsError.message);
  }

  return {
    summary: mapSummary(summaryData as AnalyticsSummaryRow | null),
    topViewedProducts: (topProductsData ?? []).map((row) =>
      mapTopViewedProduct(row as TopViewedProductRow)
    ),
  };
}
