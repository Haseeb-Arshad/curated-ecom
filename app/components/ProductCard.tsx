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
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        decoding="async"
        className={loaded ? styles.imgLoaded : styles.img}
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
