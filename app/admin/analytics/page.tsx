import { AdminSubnav } from "../../../components/AdminSubnav";
import { AnalyticsDashboard } from "../../../components/AnalyticsDashboard";
import { requireAdmin } from "../../../lib/auth";
import { getAdminAnalytics } from "../../../lib/repositories/admin-analytics";

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  const analytics = await getAdminAnalytics();

  return (
    <>
      <AdminSubnav currentPath="/admin/analytics" />

      <AnalyticsDashboard
        summary={analytics.summary}
        topViewedProducts={analytics.topViewedProducts}
      />
    </>
  );
}
