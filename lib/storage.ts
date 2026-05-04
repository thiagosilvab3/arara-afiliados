import { baseProducts } from "./data";
import { Product } from "./types";

const CUSTOM_PRODUCTS_KEY = "arara_custom_products";

function isBrowser() {
  return typeof window !== "undefined";
}

function emitProductsChanged() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event("arara-products-updated"));
}

export function getCustomProducts(): Product[] {
  if (!isBrowser()) return [];

  try {
    const raw = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomProduct(product: Product) {
  if (!isBrowser()) return;
  const items = getCustomProducts();
  items.unshift(product);
  localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(items));
  emitProductsChanged();
}

export function removeCustomProduct(slug: string) {
  if (!isBrowser()) return;
  const items = getCustomProducts().filter((item) => item.slug !== slug);
  localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(items));
  emitProductsChanged();
}

export function getAllProducts(): Product[] {
  return [...baseProducts, ...getCustomProducts()];
}

export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((item) => item.slug === slug);
}