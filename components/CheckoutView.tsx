"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "../lib/types";
import { trackEvent } from "../lib/analytics";
import { formatCurrency } from "../lib/utils";
import { createOrderAction } from "../app/checkout/actions";
import styles from "./CheckoutView.module.css";

type CheckoutViewProps = {
  product: Product;
};

type CheckoutStatus = "idle" | "processing" | "success";

export function CheckoutView({ product }: CheckoutViewProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<CheckoutStatus>("idle");
  const [error, setError] = useState("");
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const isAffiliate = product.type === "affiliate";

  const canSubmit = useMemo(() => {
    return name.trim().length > 1 && email.trim().length > 3;
  }, [name, email]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || status === "processing") {
      return;
    }

    setError("");
    setStatus("processing");

    trackEvent("checkout_start", {
      slug: product.slug,
    });

    try {
      const result = await createOrderAction({
        slug: product.slug,
        customerName: name,
        customerEmail: email,
      });

      if (!result.success) {
        setError(result.message);
        setStatus("idle");
        return;
      }

      trackEvent("lead_submit", {
        slug: product.slug,
      });

      setCreatedOrderId(result.orderId);
      setStatus("success");
    } catch {
      setError("Não foi possível concluir o checkout agora.");
      setStatus("idle");
    }
  };

  const handleAffiliateClick = () => {
    trackEvent("affiliate_click", {
      slug: product.slug,
    });

    window.open(product.affiliateUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={`container ${styles.wrapper}`}>
      <div className={styles.breadcrumb}>
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href={`/produto/${product.slug}`}>{product.title}</Link>
        <span>/</span>
        <strong>Checkout</strong>
      </div>

      <div className={styles.layout}>
        <section className={`panel ${styles.formPanel}`}>
          <div className={styles.header}>
            <span className="badge">
              {isAffiliate ? "Checkout afiliado" : "Checkout produto próprio"}
            </span>
            <h1 className={styles.title}>Finalizar interesse</h1>
            <p className={styles.subtitle}>
              Preencha seus dados para continuar com {product.title}.
            </p>
          </div>

          {status === "success" ? (
            <div className={styles.successBox}>
              <h2>Checkout concluído</h2>
              <p>
                Seu interesse em <strong>{product.title}</strong> foi registrado.
              </p>

              {createdOrderId ? (
                <p>
                  <strong>Pedido:</strong> {createdOrderId}
                </p>
              ) : null}

              {isAffiliate ? (
                <>
                  <p>
                    Como este é um produto afiliado, você pode seguir para a oferta
                    oficial do parceiro.
                  </p>
                  <button
                    onClick={handleAffiliateClick}
                    className="btn btnPrimary"
                  >
                    Abrir oferta afiliada
                  </button>
                </>
              ) : (
                <p>
                  Pedido salvo no Supabase com status inicial de pagamento pendente.
                </p>
              )}

              <div className={styles.successActions}>
                <Link href="/" className="btn btnSecondary">
                  Voltar ao catálogo
                </Link>
                <Link
                  href={`/produto/${product.slug}`}
                  className="btn btnSecondary"
                >
                  Ver produto
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <label className={styles.fieldGroup}>
                <span>Nome</span>
                <input
                  type="text"
                  className="field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                />
              </label>

              <label className={styles.fieldGroup}>
                <span>E-mail</span>
                <input
                  type="email"
                  className="field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@exemplo.com"
                />
              </label>

              {error ? <p className={styles.error}>{error}</p> : null}

              <div className={styles.actions}>
                <button
                  type="submit"
                  className="btn btnPrimary"
                  disabled={!canSubmit || status === "processing"}
                >
                  {status === "processing" ? "Processando..." : "Continuar"}
                </button>

                <Link
                  href={`/produto/${product.slug}`}
                  className="btn btnSecondary"
                >
                  Voltar
                </Link>
              </div>
            </form>
          )}
        </section>

        <aside className={`panel ${styles.summaryPanel}`}>
          <h2 className={styles.summaryTitle}>Resumo do produto</h2>

          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className={styles.image}
            />
          ) : null}

          <div className={styles.summaryBlock}>
            <h3>{product.title}</h3>
            <p className={styles.description}>{product.description}</p>
          </div>

          <div className={styles.priceArea}>
            <span className="muted">Valor atual</span>
            <strong className={styles.price}>
              {formatCurrency(product.price)}
            </strong>
            {product.originalPrice ? (
              <span className={styles.oldPrice}>
                {formatCurrency(product.originalPrice)}
              </span>
            ) : null}
          </div>

          <div className={styles.meta}>
            <div className={`card ${styles.metaItem}`}>
              <span className="muted">Tipo</span>
              <strong>{isAffiliate ? "Afiliado" : "Próprio"}</strong>
            </div>

            <div className={`card ${styles.metaItem}`}>
              <span className="muted">Plataforma</span>
              <strong>{product.platform}</strong>
            </div>

            <div className={`card ${styles.metaItem}`}>
              <span className="muted">Avaliação</span>
              <strong>⭐ {product.rating.toFixed(1)}</strong>
            </div>

            <div className={`card ${styles.metaItem}`}>
              <span className="muted">Popularidade</span>
              <strong>{product.popularity}</strong>
            </div>
          </div>

          {product.highlights.length > 0 ? (
            <div className={styles.highlights}>
              <h3>Destaques</h3>
              <ul>
                {product.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className={styles.notice}>
            {isAffiliate
              ? "Este checkout salva o lead em orders e depois redireciona para o parceiro."
              : "Este checkout salva o pedido em orders com pagamento pendente."}
          </div>
        </aside>
      </div>
    </div>
  );
}