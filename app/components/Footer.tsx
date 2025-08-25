import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.newsRow}>
          <span className={styles.logo} aria-hidden="true">✺</span>
          <form className={styles.newsletter} action="/subscribe" method="post">
            <label htmlFor="footer-email" className="visually-hidden">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              placeholder="name@email.com"
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
        <p className={styles.blurb}>
          I may earn a small commission from links but only recommend products I
          genuinely like. No tracking, ever.
        </p>
        <div className={styles.columns}>
          <section>
            <h2 className={styles.heading}>Navigation</h2>
            <nav aria-label="Footer Navigation">
              <ul role="list">
                <li>
                  <a href="/">Discover</a>
                </li>
                <li>
                  <a href="/lists">Lists</a>
                </li>
                <li>
                  <a href="/brands">Brands</a>
                </li>
                <li>
                  <a href="/categories">Categories</a>
                </li>
                <li>
                  <a href="/browse">Index</a>
                </li>
              </ul>
            </nav>
          </section>
          <section>
            <h2 className={styles.heading}>About</h2>
            <ul role="list">
              <li>
                <a href="/info">Info</a>
              </li>
              <li>
                <a href="/blog">Blog</a>
              </li>
            </ul>
          </section>
          <section>
            <h2 className={styles.heading}>Contact</h2>
            <ul role="list">
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </section>
        </div>
        <div className={styles.copy}>
          <p>© {year} Curated Design. All rights reserved.</p>
          <p>
            Made by
            <a
              href="https://github.com/justinrim"
              target="_blank"
              rel="noopener noreferrer"
            >
              @justinrim
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
