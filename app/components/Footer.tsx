import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>✶</div>
      <nav className={styles.nav} aria-label="Footer">
        <a href="/">Discover</a>
        <a href="/browse">Browse</a>
        <a href="/blog">Blog</a>
        <a href="/info">Info</a>
      </nav>
      <p className={styles.copy}>© {year} Curated Design. All rights reserved.</p>
    </footer>
  );
}
