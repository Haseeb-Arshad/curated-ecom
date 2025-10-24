import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import styles from "./ProductCard.module.css";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  badge?: "staff-pick" | "featured";
}

export default function ProductCard({ product }: { product: Product }) {
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const placeholderSrc = "/images/placeholder.svg";

  useEffect(() => {
    const img = imageRef.current;
    if (!img) {
      setLoaded(false);
      return;
    }

    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [product.image]);

  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget;

    if (target.src.endsWith(placeholderSrc)) {
      setLoaded(true);
      return;
    }

    setLoaded(false);
    target.src = placeholderSrc;
  };

  return (
    <article className={styles.card}>
      {product.badge && (
        <div className={styles.badge}>
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <path
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              fill="currentColor"
            />
          </svg>
          <span>{product.badge === "staff-pick" ? "Staff Pick" : "Featured"}</span>
        </div>
      )}
      <a href={`/products/${product.id}`} className={styles.linkArea}>
        <div className={styles.imgWrap}>
          {!loaded && <div className={styles.skeleton} aria-hidden="true" />}
          <img
            ref={imageRef}
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={`${styles.img} ${loaded ? styles.imgLoaded : ""}`}
            onLoad={() => setLoaded(true)}
            onError={handleImageError}
          />
        </div>
        <span className={styles.visit} aria-hidden="true">
          <svg viewBox="0 0 24 24" className="icon">
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </span>
        <div className={styles.meta}>
          <p className={styles.brand}>
            {product.brand} - {product.category}
          </p>
          <h3 className={styles.name}>{product.name}</h3>
        </div>
      </a>
    </article>
  );
}
