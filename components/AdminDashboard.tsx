"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Product, ProductStatus } from "../lib/types";
import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
} from "../app/admin/actions";
import { createSupabaseBrowserClient } from "../lib/supabase/client";
import { formatCurrency, slugify } from "../lib/utils";
import styles from "./AdminDashboard.module.css";

type AdminDashboardProps = {
  initialProducts: Product[];
};

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

function buildStoragePath(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  return `products/${crypto.randomUUID()}.${extension}`;
}

function formFromProduct(product: Product): FormState {
  return {
    title: product.title,
    slug: product.slug,
    niche: product.niche,
    shortDescription: product.description,
    longDescription: product.longDescription,
    price: String(product.price),
    originalPrice: product.originalPrice ? String(product.originalPrice) : "",
    popularity: String(product.popularity),
    rating: String(product.rating),
    platform: product.platform,
    affiliateUrl: product.affiliateUrl ?? "",
    productType: product.type,
    highlights: product.highlights.join("\n"),
    imageUrl: product.imageUrl ?? "",
    featured: Boolean(product.featured),
    productStatus: product.productStatus ?? "draft",
  };
}

export function AdminDashboard({ initialProducts }: AdminDashboardProps) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isEditing = editingProductId !== null;

  const stats = useMemo(() => {
    const total = initialProducts.length;
    const featured = initialProducts.filter((p) => p.featured).length;
    const affiliate = initialProducts.filter((p) => p.type === "affiliate").length;
    const own = initialProducts.filter((p) => p.type === "own").length;

    return { total, featured, affiliate, own };
  }, [initialProducts]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleTitleChange(value: string) {
    setForm((current) => {
      const nextSlug =
        current.slug.trim().length === 0 ||
        current.slug === slugify(current.title)
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
    setEditingProductId(null);
    setUploadMessage("");
    setUploadError("");
  }

  function startEdit(product: Product) {
    setForm(formFromProduct(product));
    setEditingProductId(product.id);
    setMessage("");
    setError("");
    setUploadMessage("");
    setUploadError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    resetForm();
    setMessage("");
    setError("");
  }

  async function handleImageUpload(file: File | null) {
    setUploadMessage("");
    setUploadError("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Escolha um arquivo de imagem.");
      return;
    }

    const maxSizeInBytes = 6 * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      setUploadError("Envie uma imagem de até 6 MB.");
      return;
    }

    try {
      setIsUploading(true);

      const supabase = createSupabaseBrowserClient();
      const filePath = buildStoragePath(file);

      const { error: storageError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (storageError) {
        setUploadError(storageError.message);
        return;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      updateField("imageUrl", data.publicUrl);
      setUploadMessage("Imagem enviada com sucesso.");
    } catch {
      setUploadError("Não foi possível enviar a imagem.");
    } finally {
      setIsUploading(false);
    }
  }

  function removeImageFromForm() {
    updateField("imageUrl", "");
    setUploadMessage("");
    setUploadError("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    startTransition(async () => {
      const payload = {
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
      };

      if (isEditing && editingProductId) {
        const result = await updateProductAction({
          productId: editingProductId,
          ...payload,
        });

        if (!result.success) {
          setError(result.message);
          return;
        }

        setMessage("Produto atualizado com sucesso.");
        resetForm();
        router.refresh();
        return;
      }

      const result = await createProductAction(payload);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setMessage("Produto criado com sucesso.");
      resetForm();
      router.refresh();
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

      if (editingProductId === productId) {
        resetForm();
      }

      setMessage("Produto removido com sucesso.");
      router.refresh();
    });
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1>Painel administrativo</h1>
          <p className="muted">
            Cadastre, edite e remova produtos diretamente no Supabase.
          </p>
        </div>

        <div className={styles.stats}>
          <div className={`card ${styles.statCard}`}>
            <span>Total</span>
            <strong>{stats.total}</strong>
          </div>

          <div className={`card ${styles.statCard}`}>
            <span>Destaques</span>
            <strong>{stats.featured}</strong>
          </div>

          <div className={`card ${styles.statCard}`}>
            <span>Afiliados</span>
            <strong>{stats.affiliate}</strong>
          </div>

          <div className={`card ${styles.statCard}`}>
            <span>Próprios</span>
            <strong>{stats.own}</strong>
          </div>
        </div>

        <div className={styles.layout}>
          <section className={`panel ${styles.formPanel}`}>
            <h2>{isEditing ? "Editar produto" : "Novo produto"}</h2>

            {isEditing ? (
              <div className={styles.editingBanner}>
                <span>Você está editando um produto existente.</span>

                <button
                  type="button"
                  className="btn btnSecondary"
                  onClick={cancelEdit}
                >
                  Cancelar edição
                </button>
              </div>
            ) : null}

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
                    className="field"
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
                    className="field"
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
                    className="field"
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
                    placeholder="Será preenchida após o upload"
                  />
                </label>
              </div>

              <label className={styles.fieldGroup}>
                <span>Upload da imagem</span>

                <div className={styles.uploadBox}>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(e) =>
                      void handleImageUpload(e.target.files?.[0] ?? null)
                    }
                    disabled={isUploading || isPending}
                  />

                  <p className={styles.helper}>
                    Use PNG, JPG ou WEBP com até 6 MB.
                  </p>
                </div>
              </label>

              {uploadMessage ? (
                <p className={styles.success}>{uploadMessage}</p>
              ) : null}

              {uploadError ? <p className={styles.error}>{uploadError}</p> : null}

              {form.imageUrl ? (
                <div className={styles.previewWrap}>
                  <img
                    src={form.imageUrl}
                    alt="Preview da imagem do produto"
                    className={styles.previewImage}
                  />

                  <button
                    type="button"
                    className="btn btnSecondary"
                    onClick={removeImageFromForm}
                  >
                    Remover imagem do formulário
                  </button>
                </div>
              ) : null}

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
                <button
                  type="submit"
                  className="btn btnPrimary"
                  disabled={isPending || isUploading}
                >
                  {isPending
                    ? isEditing
                      ? "Salvando alterações..."
                      : "Salvando..."
                    : isEditing
                      ? "Salvar alterações"
                      : "Criar produto"}
                </button>

                {isEditing ? (
                  <button
                    type="button"
                    className="btn btnSecondary"
                    onClick={cancelEdit}
                    disabled={isPending}
                  >
                    Cancelar
                  </button>
                ) : null}
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

                      <div className={styles.productActions}>
                        <button
                          type="button"
                          className="btn btnSecondary"
                          onClick={() => startEdit(product)}
                          disabled={isPending}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="btn btnSecondary"
                          onClick={() => handleDelete(product.id, product.title)}
                          disabled={isPending}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>

                    <div className={styles.productMeta}>
                      <span>
                        <strong>Tipo:</strong>{" "}
                        {product.type === "affiliate" ? "Afiliado" : "Próprio"}
                      </span>

                      <span>
                        <strong>Status:</strong> {product.productStatus ?? "draft"}
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

                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className={styles.productThumb}
                      />
                    ) : null}

                    <p className={styles.productDescription}>
                      {product.description}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}