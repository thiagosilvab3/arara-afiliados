"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Product } from "../lib/types";
import { trackEvent } from "../lib/analytics";
import { formatCurrency, getGradientByNiche } from "../lib/utils";
import styles from "./ProductDetails.module.css";

type ProductDetailsProps = {
  product: Product;
};

export function ProductDetails({ product }: ProductDetailsProps) {
  const tracked = useRef("");

  useEffect(() => {
    if (tracked.current !== product.slug) {
      trackEvent("product_view", { slug: product.slug });
      tracked.current = product.slug;
    }
  }, [product.slug]);

  const handleAffiliateClick = () => {
  trackEvent("affiliate_click", { slug: product.slug });
  window.open(product.affiliateUrl, "_blank", "noopener,noreferrer");
};

  return (
    <div className={`container ${styles.wrapper}`}>
      <div className={styles.breadcrumb}>
        <Link href="/">Início</Link>
        <span>/</span>
        <span>{product.niche}</span>
        <span>/</span>
        <strong>{product.title}</strong>
      </div>

      <div className={styles.layout}>
        <section
          className={styles.hero}
          style={{ backgroundImage: getGradientByNiche(product.niche) }}
        >
          <div className={styles.badges}>
            <span className="badge">{product.niche}</span>
            <span className="badge">
              {product.type === "own" ? "Produto próprio" : "Afiliado"}
            </span>
            <span className="badge">{product.platform}</span>
          </div>

          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.description}>{product.longDescription}</p>

          <div className={styles.highlights}>
            {product.highlights.map((item) => (
              <div key={item} className={styles.highlightItem}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <aside className={`panel ${styles.sidebar}`}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className={styles.image}
            />
          ) : null}

          <div className={styles.priceArea}>
            <span className="muted">Oferta selecionada</span>
            <strong className={styles.price}>{formatCurrency(product.price)}</strong>
            {product.originalPrice ? (
              <span className={styles.oldPrice}>
                {formatCurrency(product.originalPrice)}
              </span>
            ) : null}
          </div>

          <div className={styles.stats}>
            <div className={`card ${styles.stat}`}>
              <span className="muted">Popularidade</span>
              <strong>{product.popularity}</strong>
            </div>
            <div className={`card ${styles.stat}`}>
              <span className="muted">Avaliação</span>
              <strong>⭐ {product.rating.toFixed(1)}</strong>
            </div>
          </div>

          <p className={styles.short}>{product.description}</p>

          <div className={styles.actions}>
            <Link href={`/checkout?slug=${product.slug}`} className="btn btnPrimary">
              Ir para checkout
            </Link>

            {product.type === "affiliate" ? (
              <button onClick={handleAffiliateClick} className="btn btnSecondary">
                Abrir oferta afiliada
              </button>
            ) : null}
          </div>

          <div className={styles.notice}>
            {product.type === "affiliate"
              ? "Produto afiliado: use o checkout simulado ou envie o visitante diretamente ao parceiro."
              : "Produto próprio: fluxo preparado para venda interna simulada."}
          </div>
        </aside>
      </div>
    </div>
  );
}