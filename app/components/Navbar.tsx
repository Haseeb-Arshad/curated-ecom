import { NavLink } from "react-router";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className={styles.header} data-mounted={mounted ? "true" : undefined}>
      <nav className={styles.nav} aria-label="Primary">
        <a href="/" className={styles.logo} aria-label="Curated Design">
          <svg
            viewBox="0 0 24 24"
            className="icon"
            aria-hidden="true"
          >
            <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" />
          </svg>
        </a>
        <ul className={styles.menu} role="list">
          <li>
            <NavLink to="/" end>
              Discover
            </NavLink>
          </li>
          <li>
            <NavLink to="/browse">Browse</NavLink>
          </li>
          <li>
            <NavLink to="/blog">Blog</NavLink>
          </li>
          <li>
            <NavLink to="/info">Info</NavLink>
          </li>
        </ul>
        <button type="button" aria-label="Search" className={styles.search}>
          <svg
            viewBox="0 0 24 24"
            className="icon"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 5 5" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
