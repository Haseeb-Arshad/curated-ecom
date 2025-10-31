import { useLoaderData } from "react-router";
import type { MetaFunction } from "react-router";
import { useState } from "react";
import type { BrowseItem } from "../types/browse";
import CollectionCard from "../components/CollectionCard";
import styles from "./browse.module.css";

export const meta: MetaFunction = () => [{ title: "Browse" }];

export async function loader() {
  const { lists, brands: localBrands, categories: localCategories } = await import("../data/browse");
  let brands = localBrands;
  let categories = localCategories;
  try {
    // eslint-disable-next-line no-undef
    const base = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
    if (base) {
      const [b, c] = await Promise.all([
        fetch(`${base}/api/brands`).then(r => r.ok ? r.json() : Promise.reject()),
        fetch(`${base}/api/categories`).then(r => r.ok ? r.json() : Promise.reject()),
      ]);
      if (Array.isArray(b.items)) {
        brands = b.items.map((x: any) => ({ id: x.slug, name: x.name, image: "/images/placeholder.svg", count: 0, href: `/brands/${x.slug}` }));
      }
      if (Array.isArray(c.items)) {
        categories = c.items.map((x: any) => ({ id: x.slug, name: x.name, image: "/images/placeholder.svg", count: 0, href: `/categories/${x.slug}` }));
      }
    }
  } catch {}
  return { lists, brands, categories };
}

export default function Browse() {
  const { lists, brands, categories } = useLoaderData<typeof loader>();
  const [active, setActive] = useState<"lists" | "brand" | "category">("lists");

  const current: BrowseItem[] =
    active === "lists" ? lists : active === "brand" ? brands : categories;

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Browse all products by
          <br />
          lists, brand, or category
        </h1>
        <nav className={styles.tabs} aria-label="Browse by">
          <button
            type="button"
            className={`${styles.tab} ${active === "lists" ? styles.active : ""}`}
            onClick={() => setActive("lists")}
            aria-pressed={active === "lists"}
          >
            Lists
          </button>
          <button
            type="button"
            className={`${styles.tab} ${active === "brand" ? styles.active : ""}`}
            onClick={() => setActive("brand")}
            aria-pressed={active === "brand"}
          >
            Brand
          </button>
          <button
            type="button"
            className={`${styles.tab} ${active === "category" ? styles.active : ""}`}
            onClick={() => setActive("category")}
            aria-pressed={active === "category"}
          >
            Category
          </button>
        </nav>
      </header>

      <section>
        <ul className={styles.grid} role="list">
          {current.map((item) => (
            <li key={item.id}>
              <CollectionCard item={item} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
