import { useLoaderData } from "react-router";
import type { LinksFunction, MetaFunction } from "react-router";
import FilterChips from "../components/FilterChips";
import ProductCard, { type Product } from "../components/ProductCard";
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
  const categories = [
    "All",
    "Tech",
    "Workspace",
    "Home",
    "Carry",
    "Books",
    "Personal",
    "Lifestyle",
  ];
  const products: Product[] = Array.from({ length: 6 }).map((_, i) => ({
    id: String(i + 1),
    name: `Placeholder Item ${i + 1}`,
    brand: "Brand",
    category: categories[(i % (categories.length - 1)) + 1],
    image: "/images/placeholder.svg",
  }));
  return { categories, products };
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: stylesHref }];

export default function Index() {
  const { categories, products } = useLoaderData<typeof loader>();
  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <h1 className="display hero-headline">
          Discover well-designed, carefully curated products
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
        <div className={styles.moreWrapper}>
          <button type="button" className={styles.moreButton}>
            Show More
          </button>
        </div>
      </section>
    </div>
  );
}
