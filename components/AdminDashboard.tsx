"use client";

import { useEffect, useMemo, useState } from "react";
import { getAnalytics, trackEvent } from "../lib/analytics";
import {
  getAllProducts,
  getCustomProducts,
  removeCustomProduct,
  saveCustomProduct
} from "../lib/storage";
import { AnalyticsState, Niche, Product, ProductType } from "../lib/types";
import { formatCurrency, slugify } from "../lib/utils";
import styles from "./AdminDashboard.module.css";

type FormState = {
  title: string;
  niche: Niche;
  description: string;
  longDescription: string;
  price: string;
  originalPrice: string;
  popularity: string;
  rating: string;
  platform: string;
  affiliateUrl: string;
  type: ProductType;
  highlights: string;
  image: string;
};

const initialForm: FormState = {
  title: "",
  niche: "Marketing Digital",
  description: "",
  longDescription: "",
  price: "97",
  originalPrice: "",
  popularity: "80",
  rating: "4.8",
  platform: "Arara",
  affiliateUrl: "",
  type: "own",
  highlights: "Acesso imediato,Material de apoio,Suporte",
  image: ""
};

export function AdminDashboard() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsState>(getAnalytics());
  const [notice, setNotice] = useState("");

  const refresh = () => {
    setCustomProducts(getCustomProducts());
    setAnalytics(getAnalytics());
  };

  useEffect(() => {
    refresh();

    window.addEventListener("arara-products-updated", refresh);
    window.addEventListener("arara-analytics-updated", refresh);

    return () => {
      window.removeEventListener("arara-products-updated", refresh);
      window.removeEventListener("arara-analytics-updated", refresh);
    };
  }, []);

  const topViewed = useMemo(() => {
    const nameMap = new Map(getAllProducts().map((item) => [item.slug, item.title]));

    return Object.entries(analytics.productViews)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([slug, views]) => ({
        slug,
        title: nameMap.get(slug) || slug,
        views
      }));
  }, [analytics]);

  const handleFile = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice("");

    if (form.type === "affiliate" && !form.affiliateUrl.trim()) {
      setNotice("Informe um link de afiliado para produtos do tipo afiliado.");
      return;
    }

    const baseSlug = slugify(form.title);
    const existingSlugs = new Set(getAllProducts().map((item) => item.slug));
    const uniqueSlug = existingSlugs.has(baseSlug) ? `${baseSlug}-${Date.now()}` : baseSlug;

    const product: Product = {
      id: `custom-${Date.now()}`,
      slug: uniqueSlug,
      title: form.title.trim(),
      niche: form.niche,
      description: form.description.trim(),
      longDescription: form.longDescription.trim(),
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      popularity: Number(form.popularity),
      rating: Number(form.rating),
      platform: form.platform.trim() || "Arara",
      affiliateUrl: form.type === "affiliate" ? form.affiliateUrl.trim() : "",
      type: form.type,
      highlights: form.highlights
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 5),
      image: form.image || undefined
    };

    saveCustomProduct(product);
    trackEvent("admin_add", { slug: product.slug });
    setNotice("Produto salvo com sucesso no catálogo local.");
    setForm(initialForm);
    refresh();
  };

  const handleRemove = (slug: string) => {
    removeCustomProduct(slug);
    refresh();
  };

  return (
    <div className={`container ${styles.page}`}>
      <section className={`panel ${styles.header}`}>
        <h1 className="sectionTitle">Admin Arara</h1>
        <p className="sectionText">
          Painel simples para cadastrar produto próprio ou oferta afiliada.
          Persistência local via localStorage.
        </p>
      </section>

      <div className={styles.layout}>
        <form onSubmit={handleSubmit} className={`panel ${styles.formPanel}`}>
          <h2>Novo produto</h2>

          <div className={styles.formGrid}>
            <div className={styles.full}>
              <label className={styles.label}>Título</label>
              <input
                required
                className="field"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <label className={styles.label}>Tipo</label>
              <select
                className="select"
                value={form.type}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, type: e.target.value as ProductType }))
                }
              >
                <option value="own">Produto próprio</option>
                <option value="affiliate">Afiliado</option>
              </select>
            </div>

            <div>
              <label className={styles.label}>Nicho</label>
              <select
                className="select"
                value={form.niche}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, niche: e.target.value as Niche }))
                }
              >
                <option>Marketing Digital</option>
                <option>Finanças</option>
                <option>Fitness</option>
                <option>Idiomas</option>
              </select>
            </div>

            <div className={styles.full}>
              <label className={styles.label}>Descrição curta</label>
              <textarea
                required
                className="textarea"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className={styles.full}>
              <label className={styles.label}>Descrição longa</label>
              <textarea
                required
                className="textarea"
                value={form.longDescription}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, longDescription: e.target.value }))
                }
              />
            </div>

            <div>
              <label className={styles.label}>Preço</label>
              <input
                required
                type="number"
                className="field"
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
              />
            </div>

            <div>
              <label className={styles.label}>Preço original</label>
              <input
                type="number"
                className="field"
                value={form.originalPrice}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, originalPrice: e.target.value }))
                }
              />
            </div>

            <div>
              <label className={styles.label}>Popularidade</label>
              <input
                type="number"
                min="0"
                max="100"
                className="field"
                value={form.popularity}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, popularity: e.target.value }))
                }
              />
            </div>

            <div>
              <label className={styles.label}>Avaliação</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                className="field"
                value={form.rating}
                onChange={(e) => setForm((prev) => ({ ...prev, rating: e.target.value }))}
              />
            </div>

            <div>
              <label className={styles.label}>Plataforma</label>
              <input
                className="field"
                value={form.platform}
                onChange={(e) => setForm((prev) => ({ ...prev, platform: e.target.value }))}
              />
            </div>

            <div>
              <label className={styles.label}>Destaques</label>
              <input
                className="field"
                value={form.highlights}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, highlights: e.target.value }))
                }
                placeholder="Acesso imediato, Suporte, Bônus"
              />
            </div>

            {form.type === "affiliate" ? (
              <div className={styles.full}>
                <label className={styles.label}>Link de afiliado</label>
                <input
                  className="field"
                  value={form.affiliateUrl}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, affiliateUrl: e.target.value }))
                  }
                  placeholder="https://seu-link-de-afiliado.com/..."
                />
              </div>
            ) : null}

            <div className={styles.full}>
              <label className={styles.label}>Upload de imagem</label>
              <input
                type="file"
                accept="image/*"
                className="field"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          </div>

          {form.image ? (
            <div className={styles.previewBox}>
              <span className={styles.label}>Prévia</span>
              <img src={form.image} alt="Prévia" className={styles.preview} />
            </div>
          ) : null}

          {notice ? <div className={styles.notice}>{notice}</div> : null}

          <button type="submit" className="btn btnPrimary">
            Salvar produto
          </button>
        </form>

        <div className={styles.sidebar}>
          <section className={`panel ${styles.analytics}`}>
            <h2>Analytics básico</h2>

            <div className={styles.metrics}>
              <div className={`card ${styles.metric}`}>
                <span className="muted">Page views</span>
                <strong>{analytics.pageViews}</strong>
              </div>
              <div className={`card ${styles.metric}`}>
                <span className="muted">Checkout iniciado</span>
                <strong>{analytics.checkoutStarts}</strong>
              </div>
              <div className={`card ${styles.metric}`}>
                <span className="muted">Checkout concluído</span>
                <strong>{analytics.checkoutCompletions}</strong>
              </div>
              <div className={`card ${styles.metric}`}>
                <span className="muted">Cliques externos</span>
                <strong>{analytics.outboundClicks}</strong>
              </div>
            </div>

            <div className={`card ${styles.metricWide}`}>
              <span className="muted">Produtos adicionados no admin</span>
              <strong>{analytics.adminAdds}</strong>
            </div>

            <div className={styles.subsection}>
              <h3>Produtos mais vistos</h3>
              <div className={styles.list}>
                {topViewed.length === 0 ? (
                  <div className={styles.empty}>Sem dados ainda.</div>
                ) : (
                  topViewed.map((item) => (
                    <div key={item.slug} className={`card ${styles.row}`}>
                      <span>{item.title}</span>
                      <strong>{item.views}</strong>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className={`panel ${styles.locals}`}>
            <h2>Produtos cadastrados via admin</h2>

            <div className={styles.list}>
              {customProducts.length === 0 ? (
                <div className={styles.empty}>Nenhum produto local cadastrado.</div>
              ) : (
                customProducts.map((item) => (
                  <div key={item.id} className={`card ${styles.productRow}`}>
                    <div>
                      <strong>{item.title}</strong>
                      <p>
                        {item.niche} • {item.type === "own" ? "Produto próprio" : "Afiliado"} •{" "}
                        {formatCurrency(item.price)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(item.slug)}
                      className={styles.removeBtn}
                    >
                      Remover
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}