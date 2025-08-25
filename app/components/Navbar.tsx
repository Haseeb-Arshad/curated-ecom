import { NavLink } from "react-router";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Primary">
        <a href="/" className={styles.logo} aria-label="Curated Design">
          ✶
        </a>
        <ul className={styles.menu} role="list">
          <li>
            <NavLink to="/">Discover</NavLink>
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
        <div className={styles.actions}>
          <button type="button" aria-label="Search" className={styles.icon}>
            ⌕
          </button>
        </div>
      </nav>
    </header>
  );
}
