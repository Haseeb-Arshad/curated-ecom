import type { ReactNode } from "react";
import styles from "./FilterChips.module.css";

export interface Category {
  name: string;
  count: number;
  icon: ReactNode;
  badge?: "new" | "picks";
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
              className={`${styles.chip} ${active === cat.name ? styles.active : ""} ${
                cat.badge ? styles[cat.badge] : ""
              }`}
              aria-pressed={active === cat.name}
              onClick={() => onCategoryChange?.(cat.name)}
              aria-label={`Filter by ${cat.name}, ${cat.count} items`}
            >
              <span className={styles.icon} aria-hidden="true">
                {cat.icon}
              </span>
              <span className={styles.label}>
                {cat.name}
                <sup className={styles.count}>{cat.count}</sup>
              </span>
              {cat.badge && (
                <span className={styles.badge} aria-label={cat.badge}>
                  {cat.badge === "new" ? "New" : "Picks"}
                </span>
              )}
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
