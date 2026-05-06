import { AdminDashboard } from "../../components/AdminDashboard";
import { AdminSubnav } from "../../components/AdminSubnav";
import { listAdminProducts } from "../../lib/repositories/admin-products";
import { requireAdmin } from "../../lib/auth";

export default async function AdminPage() {
  await requireAdmin();

  const products = await listAdminProducts();

  return (
    <>
      <AdminSubnav currentPath="/admin" />
      <AdminDashboard initialProducts={products} />
    </>
  );
}