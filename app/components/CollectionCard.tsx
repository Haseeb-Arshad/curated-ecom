import type { BrowseItem } from "../types/browse";
import styles from "./CollectionCard.module.css";

export default function CollectionCard({ item }: { item: BrowseItem }) {
  const href = item.href ?? "#";
  return (
    <article className={styles.card}>
      <a href={href} className={styles.link} aria-label={`Open ${item.name}`}>
        <div className={styles.stage}>
          <img
            src={item.image}
            alt={item.name}
            className={styles.img}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className={styles.meta}>
          <span className={styles.name}>{item.name}</span>
          <span className={styles.count} aria-label={`${item.count} items`}>
            {item.count}
          </span>
        </div>
      </a>
    </article>
  );
}

