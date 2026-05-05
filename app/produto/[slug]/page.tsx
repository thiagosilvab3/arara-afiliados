import { notFound } from "next/navigation";
import { ProductDetails } from "../../../components/ProductDetails";
import { getProductBySlug } from "../../../lib/repositories/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}