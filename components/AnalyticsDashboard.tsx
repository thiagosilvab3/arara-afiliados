import type {
  AnalyticsSummary,
  TopViewedProduct,
} from "../lib/repositories/admin-analytics";
import styles from "./AnalyticsDashboard.module.css";

type AnalyticsDashboardProps = {
  summary: AnalyticsSummary;
  topViewedProducts: TopViewedProduct[];
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function calculateRate(part: number, total: number) {
  if (total <= 0) return "0%";

  const rate = (part / total) * 100;

  return `${rate.toFixed(1).replace(".", ",")}%`;
}

export function AnalyticsDashboard({
  summary,
  topViewedProducts,
}: AnalyticsDashboardProps) {
  const checkoutRate = calculateRate(
    summary.checkoutStarts,
    summary.productViews
  );

  const leadRate = calculateRate(summary.leadSubmits, summary.checkoutStarts);

  const affiliateClickRate = calculateRate(
    summary.affiliateClicks,
    summary.checkoutStarts
  );

  return (
    <div className={styles.wrap}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Analytics</p>
          <h1>Painel de métricas</h1>
          <p className={styles.description}>
            Acompanhe visitas, visualizações de produtos, início de checkout,
            leads enviados e cliques em links de afiliado.
          </p>
        </div>
      </section>

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span>Visitas</span>
          <strong>{formatNumber(summary.pageViews)}</strong>
          <small>Eventos page_view registrados.</small>
        </article>

        <article className={styles.statCard}>
          <span>Visualizações de produto</span>
          <strong>{formatNumber(summary.productViews)}</strong>
          <small>Eventos product_view registrados.</small>
        </article>

        <article className={styles.statCard}>
          <span>Inícios de checkout</span>
          <strong>{formatNumber(summary.checkoutStarts)}</strong>
          <small>{checkoutRate} das visualizações viraram checkout.</small>
        </article>

        <article className={styles.statCard}>
          <span>Leads enviados</span>
          <strong>{formatNumber(summary.leadSubmits)}</strong>
          <small>{leadRate} dos checkouts viraram lead.</small>
        </article>

        <article className={styles.statCard}>
          <span>Cliques afiliados</span>
          <strong>{formatNumber(summary.affiliateClicks)}</strong>
          <small>{affiliateClickRate} dos checkouts clicaram no afiliado.</small>
        </article>
      </section>

      <section className={`panel ${styles.panel}`}>
        <div className={styles.panelHeader}>
          <div>
            <h2>Produtos mais visualizados</h2>
            <p className="muted">
              Ranking baseado nos eventos de visualização de produto.
            </p>
          </div>
        </div>

        {topViewedProducts.length === 0 ? (
          <p className="muted">
            Ainda não existem visualizações de produtos registradas.
          </p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Posição</th>
                  <th>Produto</th>
                  <th>Slug</th>
                  <th>Visualizações</th>
                </tr>
              </thead>

              <tbody>
                {topViewedProducts.map((product, index) => (
                  <tr key={`${product.slug}-${index}`}>
                    <td>#{index + 1}</td>
                    <td>{product.title}</td>
                    <td>
                      <code>{product.slug}</code>
                    </td>
                    <td>{formatNumber(product.views)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
