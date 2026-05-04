"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "../lib/types";
import { getProductBySlug } from "../lib/storage";
import { formatCurrency } from "../lib/utils";
import { trackEvent } from "../lib/analytics";
import styles from "./CheckoutView.module.css";

export function CheckoutView() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";
  const [product, setProduct] = useState<Product | null>(null);
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const tracked = useRef("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    payment: "pix"
  });

  useEffect(() => {
    const item = slug ? getProductBySlug(slug) || null : null;
    setProduct(item);

    if (item && tracked.current !== slug) {
      trackEvent("checkout_start", { slug });
      tracked.current = slug;
    }
  }, [slug]);

  if (!product) {
    return (
      <div className={`container ${styles.wrapper}`}>
        <div className={`panel ${styles.box}`}>
          <h1>Checkout sem produto</h1>
          <p>Selecione um item antes de continuar.</p>
          <Link href="/" className="btn btnPrimary">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      trackEvent("checkout_complete", { slug: product.slug });
      setProcessing(false);
      setSuccess(true);
    }, 1000);
  };

  if (success) {
    return (
      <div className={`container ${styles.wrapper}`}>
        <div className={`panel ${styles.success}`}>
          <div className={styles.check}>✓</div>
          <h1>Checkout simulado concluído</h1>
          <p>
            O pedido de <strong>{product.title}</strong> foi registrado apenas para
            demonstração.
          </p>

          <div className={styles.successActions}>
            {product.type === "affiliate" ? (
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btnPrimary"
                onClick={() => trackEvent("outbound_click", { slug: product.slug })}
              >
                Seguir para o parceiro
              </a>
            ) : (
              <Link href="/" className="btn btnPrimary">
                Voltar para a loja
              </Link>
            )}

            <Link href={`/produto/${product.slug}`} className="btn btnSecondary">
              Ver produto novamente
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.wrapper}`}>
      <div className={styles.layout}>
        <aside className={`panel ${styles.summary}`}>
          <span className="muted">Resumo do pedido</span>
          <h1>{product.title}</h1>
          <p>{product.description}</p>

          <div className={styles.infoList}>
            <div className={`card ${styles.infoItem}`}>
              <span className="muted">Nicho</span>
              <strong>{product.niche}</strong>
            </div>

            <div className={`card ${styles.infoItem}`}>
              <span className="muted">Tipo</span>
              <strong>{product.type === "own" ? "Produto próprio" : "Afiliado"}</strong>
            </div>

            <div className={`card ${styles.infoItem}`}>
              <span className="muted">Valor</span>
              <strong>{formatCurrency(product.price)}</strong>
            </div>
          </div>
        </aside>

        <section className={`panel ${styles.formPanel}`}>
          <h2>Finalizar compra</h2>
          <p className="sectionText">
            Fluxo demonstrativo para apresentar a experiência do usuário.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <label className={styles.label}>Nome completo</label>
              <input
                required
                className="field"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <label className={styles.label}>E-mail</label>
              <input
                required
                type="email"
                className="field"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div>
              <label className={styles.label}>Pagamento</label>
              <select
                className="select"
                value={form.payment}
                onChange={(e) => setForm((prev) => ({ ...prev, payment: e.target.value }))}
              >
                <option value="pix">PIX</option>
                <option value="cartao">Cartão de crédito</option>
                <option value="boleto">Boleto</option>
              </select>
            </div>

            <button type="submit" disabled={processing} className="btn btnPrimary">
              {processing ? "Processando..." : `Confirmar ${formatCurrency(product.price)}`}
            </button>
          </form>

          <p className={styles.disclaimer}>
            Este checkout é simulado. Para produção, conecte gateway real, autenticação
            e backend.
          </p>
        </section>
      </div>
    </div>
  );
}