import { OrdersDashboard } from "../../../components/OrdersDashboard";
import { AdminSubnav } from "../../../components/AdminSubnav";
import { requireAdmin } from "../../../lib/auth";
import { listAdminOrders } from "../../../lib/repositories/admin-orders";

export default async function AdminOrdersPage() {
  await requireAdmin();

  const orders = await listAdminOrders();

  return (
    <>
      <AdminSubnav currentPath="/admin/pedidos" />
      <OrdersDashboard initialOrders={orders} />
    </>
  );
}