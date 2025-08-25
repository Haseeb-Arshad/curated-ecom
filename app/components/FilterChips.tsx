import type { ReactNode } from "react";
import styles from "./FilterChips.module.css";

export interface Category {
  name: string;
  count: number;
  icon: ReactNode;
}

export default function FilterChips({
  categories,
  active,
}: {
  categories: Category[];
  active?: string;
}) {
  return (
    <nav className={styles.chips} aria-label="Categories">
      {categories.map((cat) => (
        <button
          key={cat.name}
          type="button"
          className={`${styles.chip} ${active === cat.name ? styles.active : ""}`}
        >
          <span className={styles.icon}>{cat.icon}</span>
          {cat.name}
          <sup className={styles.count}>{cat.count}</sup>
        </button>
      ))}
    </nav>
  );
}
