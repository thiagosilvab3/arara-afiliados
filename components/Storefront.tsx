"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "../lib/types";
import styles from "./Storefront.module.css";

type StorefrontProps = {
  initialProducts: Product[];
};

type SortOption = "popular" | "rating" | "priceAsc" | "priceDesc";
type NicheFilter = "all" | Product["niche"];

const NICHE_OPTIONS: NicheFilter[] = [
  "all",
  "Marketing Digital",
  "Finanças",
  "Fitness",
  "Idiomas",
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getGradientByNiche(niche: Product["niche"]) {
  switch (niche) {
    case "Marketing Digital":
      return "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)";
    case "Finanças":
      return "linear-gradient(135deg, #10b981 0%, #166534 100%)";
    case "Fitness":
      return "linear-gradient(135deg, #f97316 0%, #e11d48 100%)";
    case "Idiomas":
      return "linear-gradient(135deg, #8b5cf6 0%, #c026d3 100%)";
    default:
      return "linear-gradient(135deg, #475569 0%, #0f172a 100%)";
  }
}

function getDiscountPercentage(price: number, originalPrice?: number) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round((1 - price / originalPrice) * 100);
}

function sortProducts(products: Product[], sortBy: SortOption) {
  const items = [...products];

  switch (sortBy) {
    case "rating":
      return items.sort((a, b) => b.rating - a.rating);
    case "priceAsc":
      return items.sort((a, b) => a.price - b.price);
    case "priceDesc":
      return items.sort((a, b) => b.price - a.price);
    case "popular":
    default:
      return items.sort((a, b) => b.popularity - a.popularity);
  }
}

export function Storefront({ initialProducts }: StorefrontProps) {
  const [search, setSearch] = useState("");
  const [selectedNiche, setSelectedNiche] = useState<NicheFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");

  const featuredProducts = useMemo(
    () => initialProducts.filter((product) => product.featured),
    [initialProducts]
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = initialProducts.filter((product) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.title.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch) ||
        product.highlights.some((item) =>
          item.toLowerCase().includes(normalizedSearch)
        );

      const matchesNiche =
        selectedNiche === "all" || product.niche === selectedNiche;

      return matchesSearch && matchesNiche;
    });

    return sortProducts(filtered, sortBy);
  }, [initialProducts, search, selectedNiche, sortBy]);

  const stats = useMemo(() => {
    const total = initialProducts.length;
    const featured = featuredProducts.length;
    const avgRating =
      total > 0
        ? (
            initialProducts.reduce((acc, item) => acc + item.rating, 0) / total
          ).toFixed(1)
        : "0.0";
    const avgPrice =
      total > 0
        ? formatCurrency(
            initialProducts.reduce((acc, item) => acc + item.price, 0) / total
          )
        : formatCurrency(0);

    return { total, featured, avgRating, avgPrice };
  }, [initialProducts, featuredProducts]);

  return (
    <div className={`container ${styles.page}`}>
      <section className={`panel ${styles.hero}`}>
        <div className={styles.heroGrid}>
          <div>
            <span className="badge">Marketplace digital</span>
            <h1 className={styles.heroTitle}>Arara Afiliados</h1>
            <p className={styles.heroText}>
              Explore produtos digitais em marketing, finanças, fitness e
              idiomas.
            </p>

            <div className={styles.heroActions}>
              <a href="#catalogo" className="btn btnPrimary">
                Ver catálogo
              </a>
              <Link href="/admin" className="btn btnSecondary">
                Painel admin
              </Link>
            </div>
          </div>

          <div className={styles.heroSide}>
            <div className={`card ${styles.metric}`}>
              <span className="muted">Produtos ativos</span>
              <strong>{stats.total}</strong>
            </div>
            <div className={`card ${styles.metric}`}>
              <span className="muted">Destaques</span>
              <strong>{stats.featured}</strong>
            </div>
            <div className={`card ${styles.metric}`}>
              <span className="muted">Avaliação média</span>
              <strong>⭐ {stats.avgRating}</strong>
            </div>
            <div className={`card ${styles.metric}`}>
              <span className="muted">Preço médio</span>
              <strong>{stats.avgPrice}</strong>
            </div>
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 ? (
        <section className={styles.statsGrid}>
          {featuredProducts.slice(0, 4).map((product) => (
            <article
              key={product.id}
              className={`card ${styles.statCard}`}
              style={{
                backgroundImage: getGradientByNiche(product.niche),
              }}
            >
              <span className="badge">{product.niche}</span>
              <strong>{product.title}</strong>
              <span className="muted">{product.description}</span>
            </article>
          ))}
        </section>
      ) : null}

      <section id="catalogo" className="stack">
        <div className={styles.sectionHeader}>
          <div>
            <h2 className="sectionTitle">Catálogo</h2>
            <p className="sectionText">
              Busque, filtre e ordene os produtos disponíveis.
            </p>
          </div>
        </div>

        <div
          className="panel"
          style={{
            padding: 20,
            display: "grid",
            gap: 16,
            gridTemplateColumns: "2fr 1fr 1fr",
          }}
        >
          <input
            type="text"
            className="field"
            placeholder="Buscar por título, descrição ou highlight"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="select"
            value={selectedNiche}
            onChange={(e) => setSelectedNiche(e.target.value as NicheFilter)}
          >
            <option value="all">Todos os nichos</option>
            {NICHE_OPTIONS.filter((item) => item !== "all").map((niche) => (
              <option key={niche} value={niche}>
                {niche}
              </option>
            ))}
          </select>

          <select
            className="select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="popular">Mais populares</option>
            <option value="rating">Melhor avaliados</option>
            <option value="priceAsc">Menor preço</option>
            <option value="priceDesc">Maior preço</option>
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <div className={`panel ${styles.empty}`}>
            <h3>Nenhum produto encontrado</h3>
            <p>Tente ajustar a busca ou os filtros.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredProducts.map((product) => {
              const discount = getDiscountPercentage(
                product.price,
                product.originalPrice
              );

              return (
                <article
                  key={product.id}
                  className="card"
                  style={{
                    overflow: "hidden",
                    display: "grid",
                    minHeight: 100,
                  }}
                >
                  <div
                    style={{
                      padding: 18,
                      backgroundImage: getGradientByNiche(product.niche),
                      display: "grid",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <span className="badge">{product.niche}</span>
                      <span className="badge">
                        {product.type === "own" ? "Próprio" : "Afiliado"}
                      </span>
                      {product.featured ? <span className="badge">Destaque</span> : null}
                    </div>

                    <div>
                      <h3
                        style={{
                          margin: 0,
                          color: "#fff",
                          fontSize: "1.2rem",
                          lineHeight: 1.2,
                        }}
                      >
                        {product.title}
                      </h3>
                      <p
                        style={{
                          margin: "10px 0 0",
                          color: "#dbeafe",
                          lineHeight: 1.5,
                        }}
                      >
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ padding: 18, display: "grid", gap: 16 }}>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        style={{
                          width: "100%",
                          aspectRatio: "16 / 9",
                          objectFit: "cover",
                          borderRadius: 16,
                          border: "1px solid var(--border)",
                        }}
                      />
                    ) : null}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "start",
                      }}
                    >
                      <div style={{ display: "grid", gap: 6 }}>
                        <strong style={{ fontSize: "1.4rem", color: "#fff" }}>
                          {formatCurrency(product.price)}
                        </strong>

                        {product.originalPrice ? (
                          <span className="muted">
                            <s>{formatCurrency(product.originalPrice)}</s>
                            {discount > 0 ? ` • ${discount}% OFF` : ""}
                          </span>
                        ) : (
                          <span className="muted">{product.platform}</span>
                        )}
                      </div>

                      <div style={{ textAlign: "right", display: "grid", gap: 6 }}>
                        <span className="muted">⭐ {product.rating.toFixed(1)}</span>
                        <span className="muted">Popularidade {product.popularity}</span>
                      </div>
                    </div>

                    {product.highlights.length > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        {product.highlights.slice(0, 3).map((item) => (
                          <span key={item} className="badge">
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: 12,
                      }}
                    >
                      <Link
                        href={`/produto/${product.slug}`}
                        className="btn btnPrimary"
                      >
                        Ver detalhes
                      </Link>

                      <Link
                        href={`/checkout?slug=${product.slug}`}
                        className="btn btnSecondary"
                      >
                        Checkout
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}