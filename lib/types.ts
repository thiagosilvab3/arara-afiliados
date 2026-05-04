export type Niche = "Marketing Digital" | "Finanças" | "Fitness" | "Idiomas";
export type ProductType = "affiliate" | "own";
export type PriceFilter = "all" | "upTo100" | "100To300" | "300To600" | "above600";

export interface Product {
  id: string;
  slug: string;
  title: string;
  niche: Niche;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  popularity: number;
  rating: number;
  platform: string;
  affiliateUrl: string;
  type: ProductType;
  highlights: string[];
  image?: string;
  featured?: boolean;
}

export interface AnalyticsState {
  pageViews: number;
  checkoutStarts: number;
  checkoutCompletions: number;
  outboundClicks: number;
  adminAdds: number;
  productViews: Record<string, number>;
  paths: Record<string, number>;
}