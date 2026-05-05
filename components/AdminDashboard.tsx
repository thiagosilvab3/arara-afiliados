"use client";

import { useMemo, useState, useTransition } from "react";
import type { Product } from "../lib/types";
import { createProductAction, deleteProductAction } from "../app/admin/actions";
import { formatCurrency, slugify } from "../lib/utils";
import styles from "./AdminDashboard.module.css";

type AdminDashboardProps = {
  initialProducts: Product[];
};

type ProductStatus = "draft" | "active" | "inactive" | "archived";
type ProductType = "own" | "affiliate";
type Niche = Product["niche"];

const NICHE_OPTIONS: Niche[] = [
  "Marketing Digital",
  "Finanças",
  "Fitness",
  "Idiomas",
];

const STATUS_OPTIONS: ProductStatus[] = [
  "draft",
  "active",
  "inactive",
  "archived",
];

type FormState = {
  title: string;
  slug: string;
  niche: Niche;
  shortDescription: string;
  longDescription: string;
  price: string;
  originalPrice: string;
  popularity: string;
  rating: string;
  platform: string;
  affiliateUrl: string;
  productType: ProductType;
  highlights: string;
  imageUrl: string;
  featured: boolean;
  productStatus: ProductStatus;
};

const initialForm: FormState = {
  title: "",
  slug: "",
  niche: "Marketing Digital",
  shortDescription: "",
  longDescription: "",
  price: "",
  originalPrice: "",
  popularity: "50",
  rating: "4.5",
  platform: "Hotmart",
  affiliateUrl: "",
  productType: "affiliate",
  highlights: "",
  imageUrl: "",
  featured: false,
  productStatus: "draft",
};

function parseHighlights(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function AdminDashboard({ initialProducts }: AdminDashboardProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const stats = useMemo(() => {
    const total = initialProducts.length;
    const featured = initialProducts.filter((p) => p.featured).length;
    const affiliate = initialProducts.filter((p) => p.type === "affiliate").length;
    const own = initialProducts.filter((p) => p.type === "own").length;

    return { total, featured, affiliate, own };
  }, [initialProducts]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleTitleChange(value: string) {
    setForm((current) => {
      const nextSlug =
        current.slug.trim().length === 0 || current.slug === slugify(current.title)
          ? slugify(value)
          : current.slug;

      return {
        ...current,
        title: value,
        slug: nextSlug,
      };
    });
  }

  function resetForm() {
    setForm(initialForm);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    startTransition(async () => {
      const result = await createProductAction({
        slug: form.slug,
        title: form.title,
        niche: form.niche,
        shortDescription: form.shortDescription,
        longDescription: form.longDescription,
        price: form.price,
        originalPrice: form.originalPrice ? form.originalPrice : null,
        popularity: form.popularity,
        rating: form.rating,
        platform: form.platform,
        affiliateUrl: form.productType === "affiliate" ? form.affiliateUrl : null,
        productType: form.productType,
        highlights: parseHighlights(form.highlights),
        imageUrl: form.imageUrl || null,
        featured: form.featured,
        productStatus: form.productStatus,
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      setMessage("Produto criado com sucesso.");
      resetForm();
    });
  }

  function handleDelete(productId: string, title: string) {
    const confirmed = window.confirm(`Excluir o produto "${title}"?`);
    if (!confirmed) return;

    setMessage("");
    setError("");

    startTransition(async () => {
      const result = await deleteProductAction(productId);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setMessage("Produto removido com sucesso.");
    });
  }

  return (
    <div className={`container ${styles.wrapper}`}>
      <div className={styles.header}>
        <div>
          <span className="badge">Admin</span>
          <h1 className={styles.title}>Painel administrativo</h1>
          <p className={styles.subtitle}>
            Cadastre e remova produtos diretamente no Supabase.
          </p>
        </div>
      </div>

      <section className={styles.statsGrid}>
        <article className={`card ${styles.statCard}`}>
          <span className="muted">Total</span>
          <strong>{stats.total}</strong>
        </article>

        <article className={`card ${styles.statCard}`}>
          <span className="muted">Destaques</span>
          <strong>{stats.featured}</strong>
        </article>

        <article className={`card ${styles.statCard}`}>
          <span className="muted">Afiliados</span>
          <strong>{stats.affiliate}</strong>
        </article>

        <article className={`card ${styles.statCard}`}>
          <span className="muted">Próprios</span>
          <strong>{stats.own}</strong>
        </article>
      </section>

      <div className={styles.layout}>
        <section className={`panel ${styles.formPanel}`}>
          <h2>Novo produto</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.grid2}>
              <label className={styles.fieldGroup}>
                <span>Título</span>
                <input
                  className="field"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Nome do produto"
                />
              </label>

              <label className={styles.fieldGroup}>
                <span>Slug</span>
                <input
                  className="field"
                  value={form.slug}
                  onChange={(e) => updateField("slug", slugify(e.target.value))}
                  placeholder="slug-do-produto"
                />
              </label>
            </div>

            <div className={styles.grid3}>
              <label className={styles.fieldGroup}>
                <span>Nicho</span>
                <select
                  className="select"
                  value={form.niche}
                  onChange={(e) => updateField("niche", e.target.value as Niche)}
                >
                  {NICHE_OPTIONS.map((niche) => (
                    <option key={niche} value={niche}>
                      {niche}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.fieldGroup}>
                <span>Tipo</span>
                <select
                  className="select"
                  value={form.productType}
                  onChange={(e) =>
                    updateField("productType", e.target.value as ProductType)
                  }
                >
                  <option value="affiliate">Afiliado</option>
                  <option value="own">Próprio</option>
                </select>
              </label>

              <label className={styles.fieldGroup}>
                <span>Status</span>
                <select
                  className="select"
                  value={form.productStatus}
                  onChange={(e) =>
                    updateField("productStatus", e.target.value as ProductStatus)
                  }
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className={styles.fieldGroup}>
              <span>Descrição curta</span>
              <input
                className="field"
                value={form.shortDescription}
                onChange={(e) => updateField("shortDescription", e.target.value)}
                placeholder="Resumo curto do produto"
              />
            </label>

            <label className={styles.fieldGroup}>
              <span>Descrição longa</span>
              <textarea
                className="field"
                rows={5}
                value={form.longDescription}
                onChange={(e) => updateField("longDescription", e.target.value)}
                placeholder="Descrição completa do produto"
              />
            </label>

            <div className={styles.grid4}>
              <label className={styles.fieldGroup}>
                <span>Preço</span>
                <input
                  type="number"
                  step="0.01"
                  className="field"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="97.00"
                />
              </label>

              <label className={styles.fieldGroup}>
                <span>Preço original</span>
                <input
                  type="number"
                  step="0.01"
                  className="field"
                  value={form.originalPrice}
                  onChange={(e) => updateField("originalPrice", e.target.value)}
                  placeholder="197.00"
                />
              </label>

              <label className={styles.fieldGroup}>
                <span>Popularidade</span>
                <input
                  type="number"
                  className="field"
                  value={form.popularity}
                  onChange={(e) => updateField("popularity", e.target.value)}
                  placeholder="50"
                />
              </label>

              <label className={styles.fieldGroup}>
                <span>Avaliação</span>
                <input
                  type="number"
                  step="0.1"
                  className="field"
                  value={form.rating}
                  onChange={(e) => updateField("rating", e.target.value)}
                  placeholder="4.5"
                />
              </label>
            </div>

            <div className={styles.grid2}>
              <label className={styles.fieldGroup}>
                <span>Plataforma</span>
                <input
                  className="field"
                  value={form.platform}
                  onChange={(e) => updateField("platform", e.target.value)}
                  placeholder="Hotmart, Kiwify..."
                />
              </label>

              <label className={styles.fieldGroup}>
                <span>URL da imagem</span>
                <input
                  className="field"
                  value={form.imageUrl}
                  onChange={(e) => updateField("imageUrl", e.target.value)}
                  placeholder="https://..."
                />
              </label>
            </div>

            {form.productType === "affiliate" ? (
              <label className={styles.fieldGroup}>
                <span>URL de afiliado</span>
                <input
                  className="field"
                  value={form.affiliateUrl}
                  onChange={(e) => updateField("affiliateUrl", e.target.value)}
                  placeholder="https://..."
                />
              </label>
            ) : null}

            <label className={styles.fieldGroup}>
              <span>Destaques</span>
              <textarea
                className="field"
                rows={5}
                value={form.highlights}
                onChange={(e) => updateField("highlights", e.target.value)}
                placeholder={`Um item por linha
Acesso imediato
Suporte incluso
Garantia de 7 dias`}
              />
            </label>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField("featured", e.target.checked)}
              />
              <span>Marcar como destaque</span>
            </label>

            {message ? <p className={styles.success}>{message}</p> : null}
            {error ? <p className={styles.error}>{error}</p> : null}

            <div className={styles.actions}>
              <button type="submit" className="btn btnPrimary" disabled={isPending}>
                {isPending ? "Salvando..." : "Criar produto"}
              </button>
            </div>
          </form>
        </section>

        <section className={`panel ${styles.listPanel}`}>
          <h2>Produtos cadastrados</h2>

          {initialProducts.length === 0 ? (
            <p className="muted">Nenhum produto encontrado.</p>
          ) : (
            <div className={styles.productList}>
              {initialProducts.map((product) => (
                <article key={product.id} className={`card ${styles.productCard}`}>
                  <div className={styles.productCardHeader}>
                    <div>
                      <h3>{product.title}</h3>
                      <p className="muted">{product.slug}</p>
                    </div>

                    <button
                      type="button"
                      className="btn btnSecondary"
                      onClick={() => handleDelete(product.id, product.title)}
                      disabled={isPending}
                    >
                      Excluir
                    </button>
                  </div>

                  <div className={styles.productMeta}>
                    <span>
                      <strong>Tipo:</strong>{" "}
                      {product.type === "affiliate" ? "Afiliado" : "Próprio"}
                    </span>
                    <span>
                      <strong>Nicho:</strong> {product.niche}
                    </span>
                    <span>
                      <strong>Plataforma:</strong> {product.platform}
                    </span>
                    <span>
                      <strong>Preço:</strong> {formatCurrency(product.price)}
                    </span>
                  </div>

                  <p className={styles.productDescription}>{product.description}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}