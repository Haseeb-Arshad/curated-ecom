import styles from "./FilterChips.module.css";

export default function FilterChips({
  categories,
  active,
}: {
  categories: string[];
  active?: string;
}) {
  return (
    <nav className={styles.chips} aria-label="Categories">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`${styles.chip} ${active === cat ? styles.active : ""}`}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
}
