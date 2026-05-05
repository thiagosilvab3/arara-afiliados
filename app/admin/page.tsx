import { AdminDashboard } from "../../components/AdminDashboard";
import { listAdminProducts } from "../../lib/repositories/admin-products";

export default async function AdminPage() {
  const products = await listAdminProducts();

  return <AdminDashboard initialProducts={products} />;
}