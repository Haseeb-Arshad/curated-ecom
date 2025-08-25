import { useLoaderData } from "react-router";
import type { LinksFunction, MetaFunction } from "react-router";
import { useState, type JSX } from "react";
import FilterChips, {
  type Category as ChipCategory,
} from "../components/FilterChips";

import Footer from "../components/Footer";
import styles from "./_index.module.css";
import stylesHref from "./_index.module.css?url";

export const meta: MetaFunction = () => [
  {
    title: "Curated Design",
  },
  {
    name: "description",
    content: "Discover well-designed, carefully curated products.",
  },
];

export async function loader() {
  const names = [
    "Tech",
    "Workspace",
    "Home",
    "Carry",
    "Books",
    "Personal",
    "Lifestyle",
  ];

  return { categories, products };
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: stylesHref }];

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const icons: Record<string, JSX.Element> = {
    All: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm10 0h8v8h-8v-8Z" />
      </svg>
    ),
    Tech: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="9" y="9" width="6" height="6" />
        <path d="M8 2h1v4H8V2zm7 0h1v4h-1V2zm0 16h1v4h-1v-4zm-7 0h1v4H8v-4zM2 8h4v1H2V8zm0 7h4v1H2v-1zm16-7h4v1h-4V8zm0 7h4v1h-4v-1z" />
      </svg>
    ),
    Workspace: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 7V5a3 3 0 013-3h4a3 3 0 013 3v2h5v14H2V7h5zm2 0h6V5a1 1 0 00-1-1h-4a1 1 0 00-1 1v2z" />
      </svg>
    ),
    Home: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 10L12 3l9 7v11h-6v-7H9v7H3V10z" />
      </svg>
    ),
    Carry: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 7V6a6 6 0 0112 0v1h2a1 1 0 011 1v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h2zm2 0h8V6a4 4 0 10-8 0v1z" />
      </svg>
    ),
    Books: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 4h9v16H2V4zm11 0h9v16h-9V4z" />
      </svg>
    ),
    Personal: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a8 8 0 0116 0v2" />
      </svg>
    ),
    Lifestyle: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zm6 9 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zM6 12l.75 2.25L9 15l-2.25.75L6 18l-.75-2.25L3 15l2.25-.75L6 12z" />
      </svg>
    ),
  };

  const categories: ChipCategory[] = data.categories.map((c) => ({
    ...c,
    icon: icons[c.name] || icons.All,
  }));

  const [visible, setVisible] = useState(6);
  const products = data.products.slice(0, visible);

  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <h1 className="display hero-headline">
          Discover well-designed,<br /> carefully curated products
        </h1>
        <p>
          Subscribe for occasional emails featuring timeless, design-led products
          across home, work, and life.
        </p>
        <form className={styles.subscribe} action="/subscribe" method="post">
          <label htmlFor="email" className="visually-hidden">
            Email address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="name@email.com"
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </section>
      <FilterChips categories={categories} active="All" />
      <section>
        <div className={styles.viewMore}>
          <a href="/browse">View More</a>
        </div>
        <ul className={styles.grid} role="list">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
        {visible < data.products.length && (
          <div className={styles.moreWrapper}>
            <button
              type="button"
              className={styles.moreButton}
              onClick={() => setVisible((v) => v + 6)}
            >
              Show More
            </button>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
