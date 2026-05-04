"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FilterBar } from "./FilterBar";
import { ProductCard } from "./ProductCard";
import { baseProducts } from "../lib/data";
import { getAllProducts } from "../lib/storage";
import { PriceFilter, Product } from "../lib/types";
import { inPriceRange } from "../lib/utils";
import styles from "./Storefront.module.css";

export function Storefront() {
  const [products, setProducts] = useState<Product[]>(baseProducts);
  const [query, setQuery] = useState("");
  const [niche, setNiche] = useState("Todos");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [minPopularity, setMinPopularity] = useState(0);
  const [sortBy, setSortBy] = useState("popularidade");

  useEffect(() => {
    const refresh = () => setProducts(getAllProducts());

    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("arara-products-updated", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("arara-products-updated", refresh);
    };
  }, []);

  const featuredProducts = useMemo(() => {
    return products.filter((item) => item.featured).slice(0, 4);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.title.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.niche.toLowerCase().includes(normalizedQuery);

      const matchesNiche = niche === "Todos" || product.niche === niche;
      const matchesPrice = inPriceRange(product.price, priceFilter);
      const matchesPopularity = product.popularity >= minPopularity;

      return matchesQuery && matchesNiche && matchesPrice && matchesPopularity;
    });

    return result.sort((a, b) => {
      switch (sortBy) {
        case "menor-preco":
          return a.price - b.price;
        case "maior-preco":
          return b.price - a.price;
        case "avaliacao":
          return b.rating - a.rating;
        default:
          return b.popularity - a.popularity;
      }
    });
  }, [products, query, niche, priceFilter, minPopularity, sortBy]);

  const stats = useMemo(() => {
    return {
      marketing: products.filter((item) => item.niche === "Marketing Digital").length,
      financas: products.filter((item) => item.niche === "Finanças").length,
      fitness: products.filter((item) => item.niche === "Fitness").length,
      idiomas: products.filter((item) => item.niche === "Idiomas").length
    };
  }, [products]);

  return (
    <div className={`container ${styles.page}`}>
      <section className={`panel ${styles.hero}`}>
        <div className={styles.heroGrid}>
          <div>
            <span className="badge">Loja de afiliados otimizada</span>
            <h1 className={styles.heroTitle}>
              Arara: catálogo moderno para produtos digitais e vendas afiliadas
            </h1>
            <p className={styles.heroText}>
              Marketplace responsivo com filtros por nicho, preço e popularidade,
              páginas de produto, checkout simulado, admin local para cadastro de
              produtos próprios e analytics básico.
            </p>

            <div className={styles.heroActions}>
              <Link href="#catalogo" className="btn btnPrimary">
                Explorar catálogo
              </Link>
              <Link href="/admin" className="btn btnSecondary">
                Cadastrar produto
              </Link>
            </div>
          </div>

          <div className={styles.heroSide}>
            <div className={`card ${styles.metric}`}>
              <span className="muted">Produtos</span>
              <strong>{products.length}</strong>
            </div>
            <div className={`card ${styles.metric}`}>
              <span className="muted">Nichos</span>
              <strong>4</strong>
            </div>
            <div className={`card ${styles.metric}`}>
              <span className="muted">Admin local</span>
              <strong>Upload + cadastro</strong>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.statsGrid}>
        <div className={`card ${styles.statCard}`}>
          <span className="muted">Marketing Digital</span>
          <strong>{stats.marketing}</strong>
        </div>
        <div className={`card ${styles.statCard}`}>
          <span className="muted">Finanças</span>
          <strong>{stats.financas}</strong>
        </div>
        <div className={`card ${styles.statCard}`}>
          <span className="muted">Fitness</span>
          <strong>{stats.fitness}</strong>
        </div>
        <div className={`card ${styles.statCard}`}>
          <span className="muted">Idiomas</span>
          <strong>{stats.idiomas}</strong>
        </div>
      </section>

      <section className="stack">
        <div className={styles.sectionHeader}>
          <div>
            <h2 className="sectionTitle">Destaques</h2>
            <p className="sectionText">Seleção inicial dos produtos mais fortes do catálogo.</p>
          </div>
        </div>

        <div className={styles.grid}>
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <div id="catalogo">
        <FilterBar
          query={query}
          niche={niche}
          priceFilter={priceFilter}
          minPopularity={minPopularity}
          sortBy={sortBy}
          onQueryChange={setQuery}
          onNicheChange={setNiche}
          onPriceFilterChange={setPriceFilter}
          onPopularityChange={setMinPopularity}
          onSortChange={setSortBy}
          onClear={() => {
            setQuery("");
            setNiche("Todos");
            setPriceFilter("all");
            setMinPopularity(0);
            setSortBy("popularidade");
          }}
        />
      </div>

      <section className={styles.sectionHeader}>
        <div>
          <h2 className="sectionTitle">Catálogo</h2>
          <p className="sectionText">{filteredProducts.length} produto(s) encontrado(s)</p>
        </div>

        <Link href="/admin" className="btn btnSecondary">
          Adicionar produto próprio
        </Link>
      </section>

      {filteredProducts.length > 0 ? (
        <section className={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <section className={`panel ${styles.empty}`}>
          <h3>Nenhum produto encontrado</h3>
          <p>Ajuste os filtros para ver mais resultados.</p>
        </section>
      )}
    </div>
  );
}