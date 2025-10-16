import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import styles from "./product.module.css";

function slugify(input: string) {
  return input.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `${data?.product?.name ?? "Product"} – Curated Design` },
  { property: "og:type", content: "product" },
  { property: "og:title", content: data?.product?.name ?? "Product" },
];

export async function loader({ params }: LoaderFunctionArgs) {
  const { products } = await import("../data/products");
  const slug = params.slug ?? "";
  const product =
    products.find((p) => p.id === slug) ||
    ({
      id: slug || "placeholder",
      name: "Placeholder Product",
      brand: "Brand",
      category: "Home",
      image: "/images/placeholder.svg",
      badge: undefined,
    } as const);

  const related = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  // Lightweight, generic copy to mirror the reference page
  const description =
    `A ${product.category.toLowerCase()} piece by ${product.brand}. Minimal, considered and built to last. ` +
    `Use it anywhere — at home or work — to quietly elevate the space.`;

  return {
    product: { ...product, description },
    related: related.slice(0, 9),
    brandSlug: slugify(product.brand),
    categorySlug: slugify(product.category),
  };
}

export default function Product() {
  const { product, related, brandSlug, categorySlug } =
    useLoaderData<typeof loader>();

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: product.brand,
    category: product.category,
    image: product.image,
    description: product.description,
  } as const;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://curated.design/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category,
        item: `https://curated.design/categories/${categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://curated.design/products/${product.id}`,
      },
    ],
  } as const;

  return (
    <article className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.crumbs}>
          <a href={`/brands/${brandSlug}`}>{product.brand}</a>
          <span aria-hidden>·</span>
          <a href={`/categories/${categorySlug}`}>{product.category}</a>
        </div>
        <a href="#" className={styles.purchase}>
          Purchase Link
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.arrow}>
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </a>
      </header>

      <h1 className={styles.title}>{product.name}</h1>

      {product.badge === "staff-pick" && (
        <div className={styles.staffPick}>
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden>
            <path
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              fill="currentColor"
            />
          </svg>
          <span>Staff Pick</span>
        </div>
      )}

      <figure className={styles.stage}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
        />
      </figure>

      <section className={styles.about}>
        <h2>About</h2>
        <div className={styles.copy}>
          <p>
            {product.description}
          </p>
          <p>
            The dimmer lets you set the mood — from a subtle glow to a bright,
            functional light. Built with quality materials for a smooth, warm
            light around 3000K.
          </p>
        </div>
      </section>

      {related.length > 0 && (
        <section className={styles.more}>
          <div className={styles.moreHead}>
            <h2>More in {product.category}</h2>
            <a href={`/categories/${categorySlug}`} className={styles.seeAll}>
              See all
            </a>
          </div>
          <ul className={styles.grid} role="list">
            {related.slice(0, 6).map((p) => (
              <li key={p.id}>
                <a href={`/products/${p.id}`} className={styles.relatedCard}>
                  {p.badge === "staff-pick" && (
                    <span className={styles.badge}>Staff Pick</span>
                  )}
                  <div className={styles.relatedStage}>
                    <img src={p.image} alt={p.name} loading="lazy" decoding="async" />
                    <span className={styles.visit} aria-hidden>
                      <svg viewBox="0 0 24 24" className="icon">
                        <path d="M7 17 17 7" />
                        <path d="M7 7h10v10" />
                      </svg>
                    </span>
                  </div>
                  <div className={styles.meta}>
                    <p className={styles.brand}>
                      {p.brand} • {p.category}
                    </p>
                    <h3 className={styles.name}>{p.name}</h3>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </article>
  );
}
