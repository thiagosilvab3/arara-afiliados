export type ProductType = "own" | "affiliate";

export type ProductStatus = "draft" | "active" | "inactive" | "archived";

export type OrderStatus =
  | "new"
  | "contact_pending"
  | "contacted"
  | "awaiting_payment_manual"
  | "redirected_to_affiliate"
  | "converted"
  | "cancelled"
  | "lost";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "not_applicable"
  | "refunded";

export type ContactChannel = "email" | "whatsapp" | "phone";

export type PaymentPreference =
  | "pix"
  | "cartao"
  | "boleto"
  | "falar_com_atendimento";

export type Niche =
  | "Marketing Digital"
  | "Finanças"
  | "Fitness"
  | "Idiomas";

export type PriceFilter =
  | "all"
  | "upTo100"
  | "100To300"
  | "300To600"
  | "above600";

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
  imageUrl?: string;
  featured?: boolean;
  productStatus?: ProductStatus;
}

export interface AdminOrder {
  id: string;
  productId?: string;
  productType: ProductType;
  productTitleSnapshot: string;
  productPriceSnapshot: number;
  affiliateDestinationUrlSnapshot?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  preferredContactChannel?: ContactChannel;
  paymentPreference?: PaymentPreference;
  notes?: string;
  source: string;
  checkoutType: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}