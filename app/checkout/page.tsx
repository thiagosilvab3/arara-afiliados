import { notFound } from "next/navigation";
import { CheckoutView } from "../../components/CheckoutView";
import { getProductBySlug } from "../../lib/repositories/products";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const { slug } = await searchParams;

  if (!slug) {
    notFound();
  }

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <CheckoutView product={product} />;
}