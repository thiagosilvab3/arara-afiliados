export type ProductType = "own" | "affiliate";

export interface Product {
  id: string;
  slug: string;
  title: string;
  niche: "Marketing Digital" | "Finanças" | "Fitness" | "Idiomas";
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
  imageUrl?: string;
  featured?: boolean;
}