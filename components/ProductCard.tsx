import Link from "next/link";
import { Product } from "../lib/types";
import {
  formatCurrency,
  getDiscountPercentage,
  getGradientByNiche
} from "../lib/utils";
import styles from "./ProductCard.module.css";

export function ProductCard({ product }: { product: Product }) {
  const discount = getDiscountPercentage(product.price, product.originalPrice);

  return (
    <article className={styles.card}>
      <div
        className={styles.hero}
        style={{ backgroundImage: getGradientByNiche(product.niche) }}
      >
        {product.image ? (
          <img src={product.image} alt={product.title} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>
            <span className="badge">{product.niche}</span>
            <strong>{product.title}</strong>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.topRow}>
          <span className="badge">{product.niche}</span>
          <span className={styles.platform}>{product.platform}</span>
        </div>

        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.description}>{product.description}</p>

        <div className={styles.tags}>
          {product.highlights.slice(0, 3).map((item) => (
            <span key={item} className={styles.tag}>
              {item}
            </span>
          ))}
        </div>

        <div className={styles.meta}>
          <span>Popularidade: {product.popularity}</span>
          <span>⭐ {product.rating.toFixed(1)}</span>
        </div>

        <div className={styles.priceBox}>
          <div>
            {product.originalPrice ? (
              <div className={styles.oldPrice}>{formatCurrency(product.originalPrice)}</div>
            ) : null}
            <div className={styles.price}>{formatCurrency(product.price)}</div>
            {discount > 0 ? <div className={styles.discount}>{discount}% OFF</div> : null}
          </div>

          <Link href={`/produto/${product.slug}`} className="btn btnPrimary">
            Ver produto
          </Link>
        </div>
      </div>
    </article>
  );
}