import { Niche, PriceFilter } from "./types";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function inPriceRange(price: number, filter: PriceFilter) {
  switch (filter) {
    case "upTo100":
      return price <= 100;
    case "100To300":
      return price > 100 && price <= 300;
    case "300To600":
      return price > 300 && price <= 600;
    case "above600":
      return price > 600;
    default:
      return true;
  }
}

export function getGradientByNiche(niche: Niche) {
  switch (niche) {
    case "Marketing Digital":
      return "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)";
    case "Finanças":
      return "linear-gradient(135deg, #10b981 0%, #166534 100%)";
    case "Fitness":
      return "linear-gradient(135deg, #f97316 0%, #e11d48 100%)";
    case "Idiomas":
      return "linear-gradient(135deg, #8b5cf6 0%, #c026d3 100%)";
    default:
      return "linear-gradient(135deg, #475569 0%, #0f172a 100%)";
  }
}

export function getDiscountPercentage(price: number, originalPrice?: number) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round((1 - price / originalPrice) * 100);
}