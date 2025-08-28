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
  onCategoryChange,
  trailingAction,
}: {
  categories: Category[];
  active?: string;
  onCategoryChange?: (category: string) => void;
  trailingAction?: ReactNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <nav className={styles.chips} aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat.name}
              type="button"
              className={`${styles.chip} ${active === cat.name ? styles.active : ""}`}
              aria-pressed={active === cat.name}
              onClick={() => onCategoryChange?.(cat.name)}
              aria-label={`Filter by ${cat.name}, ${cat.count} items`}
            >
              <span className={styles.icon} aria-hidden="true">
                {cat.icon}
              </span>
              <span className={styles.label}>{cat.name}</span>
              <span className={styles.count} aria-label={`${cat.count} products`}>
                {cat.count}
              </span>
            </button>
          ))}
        </nav>
        {trailingAction && (
          <div className={styles.action}>
            {trailingAction}
          </div>
        )}
      </div>
    </div>
  );
}
