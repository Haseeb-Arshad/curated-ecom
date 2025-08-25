import { useState } from "react";
import styles from "./ProductCard.module.css";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <article className={styles.card}>
      <a
        href={`/products/${product.id}`}
        aria-label={`View ${product.name}`}
        className={styles.visit}
      >
        <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
          <path d="M7 17 17 7" />
          <path d="M7 7h10v10" />
        </svg>
      </a>
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        decoding="async"
        className={`${styles.img} ${loaded ? styles.imgLoaded : ""}`}
        onLoad={() => setLoaded(true)}
      />
      <div className={styles.meta}>
        <p className={styles.brand}>
          {product.brand} &ndash; {product.category}
        </p>
        <h3 className={styles.name}>{product.name}</h3>
      </div>
    </article>
  );
}
