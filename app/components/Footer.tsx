import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className="container stack-md">
        <form className={styles.newsletter}>
          <label htmlFor="newsletter-email" className="visually-hidden">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="you@example.com"
            required
          />
          <button type="submit">Subscribe</button>
        </form>
        <div className={styles.columns}>
          <section>
            <h2 className="visually-hidden">Navigation</h2>
            <nav aria-label="Footer Navigation">
              <ul role="list" className={styles.list}>
                <li>
                  <a href="/">Discover</a>
                </li>
                <li>
                  <a href="/browse">Browse</a>
                </li>
                <li>
                  <a href="/blog">Blog</a>
                </li>
                <li>
                  <a href="/info">Info</a>
                </li>
              </ul>
            </nav>
          </section>
          <section>
            <h2 className="visually-hidden">About</h2>
            <p>Curated e-commerce project placeholder.</p>
          </section>
          <section>
            <h2 className="visually-hidden">Contact</h2>
            <p>hello@example.com</p>
          </section>
        </div>
        <div className={styles.copy}>
          <p>© {year} Curated Design</p>
          <p className={styles.madeBy}>
            Made by <span className={styles.dot} />
          </p>
        </div>
      </div>
    </footer>
  );
}
