import { Storefront } from "../components/Storefront";
import { listProducts } from "../lib/repositories/products";

export default async function HomePage() {
  const products = await listProducts();

  return <Storefront initialProducts={products} />;
}