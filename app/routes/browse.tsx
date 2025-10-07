import { useLoaderData } from "react-router";
import type { MetaFunction } from "react-router";
import { useState } from "react";
import type { BrowseItem } from "../types/browse";
import CollectionCard from "../components/CollectionCard";
import styles from "./browse.module.css";

export const meta: MetaFunction = () => [{ title: "Browse" }];

export async function loader() {
  const { lists, brands, categories } = await import("../data/browse");
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
