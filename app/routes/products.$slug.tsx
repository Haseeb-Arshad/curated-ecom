import { useLoaderData, useNavigate } from "react-router";
import { useState } from "react";
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
  const slug = params.slug ?? "";
  // Try backend first
  try {
    // eslint-disable-next-line no-undef
    const base = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
    if (base) {
      const res = await fetch(`${base}/api/products/${slug}`);
      if (res.ok) {
        const d = await res.json();
        const img = Array.isArray(d.images) && d.images.length > 0 ? d.images[0].url : "/images/placeholder.svg";
        const product = {
          id: d.id,
          name: d.name,
          brand: d.brand ?? "",
          category: d.category ?? "",
          image: img,
          description: d.description ?? "",
          redirect_url: d.redirect_url as string | null,
          brand_slug: d.brand_slug as string | undefined,
          category_slug: d.category_slug as string | undefined,
        };
        // Related: by category from backend
        let related: Array<{id:string; name:string; brand:string; category:string; image:string; badge?:"staff-pick"|"featured"}> = [];
        if (product.category_slug) {
          const r = await fetch(`${base}/api/products?category=${encodeURIComponent(product.category_slug)}&limit=9`);
          if (r.ok) {
            const body = await r.json();
            related = (body.items as any[]).filter(p => p.id !== product.id).map(p => ({
              id: p.id,
              name: p.name,
              brand: p.brand ?? "",
              category: p.category ?? "",
              image: p.image ?? "/images/placeholder.svg",
            }));
          }
        }
        // Reviews
        let reviews: Array<{ id: number|string; rating: number; title: string; body: string; created_at?: string }>=[];
        const rv = await fetch(`${base}/api/reviews?product=${encodeURIComponent(product.id)}`);
        if (rv.ok) {
          const body = await rv.json();
          reviews = Array.isArray(body.items) ? body.items : [];
        }
        return {
          product,
          related,
          brandSlug: product.brand_slug ?? slugify(product.brand),
          categorySlug: product.category_slug ?? slugify(product.category),
          reviews,
        };
      }
    }
  } catch {
    // ignore
  }

  // Fallback to local static data
  const { products } = await import("../data/products");
  const product =
    products.find((p) => p.id === slug) ||
    ({ id: slug || "placeholder", name: "Placeholder Product", brand: "Brand", category: "Home", image: "/images/placeholder.svg" } as const);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id);
  const description = `A ${product.category.toLowerCase()} piece by ${product.brand}. Minimal, considered and built to last. Use it anywhere — at home or work — to quietly elevate the space.`;
  return { product: { ...product, description, redirect_url: null }, related: related.slice(0, 9), brandSlug: slugify(product.brand), categorySlug: slugify(product.category), reviews: [] };
}

export default function Product() {
  const { product, related, brandSlug, categorySlug, reviews } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const addToCart = async () => {
    // eslint-disable-next-line no-undef
    const base = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
    if (!base) return;
    const key = "anon_cart_id";
    let id = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    if (!id && typeof window !== 'undefined') {
      id = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
      window.localStorage.setItem(key, id);
    }
    await fetch(`${base}/api/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-cart-id': id || '' },
      body: JSON.stringify({ product: product.id, qty: 1 }),
    });
    navigate('/cart');
  };

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
        <a href={product.redirect_url || "#"} className={styles.purchase}>
          Purchase Link
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.arrow}>
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </a>
        <button onClick={addToCart} className={styles.purchase} aria-label="Add to cart">Add to Cart</button>
      </header>

      <h1 className={styles.title}>{product.name}</h1>

      {(product as any).badge === "staff-pick" && (
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

      <section className={styles.more}>
        <h2>Reviews</h2>
        {(!reviews || reviews.length === 0) ? (
          <p>No reviews yet.</p>
        ) : (
          <ul role="list" className={styles.grid}>
            {reviews.map((r) => (
              <li key={r.id} className={styles.relatedCard}>
                <div style={{ fontWeight: 600 }}>{'★'.repeat(r.rating)}</div>
                <div>{r.title}</div>
                <p style={{ opacity: 0.85 }}>{r.body}</p>
              </li>
            ))}
          </ul>
        )}
        <ReviewForm productId={product.id} />
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

function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // eslint-disable-next-line no-undef
  const base = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
  if (!base) return null;

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setMsg(null); setErr(null);
    const res = await fetch(`${base}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: productId, rating: Number(rating), title, body }),
    });
    if (res.status === 401) { setErr('Please sign in to post a review.'); return; }
    if (!res.ok) { setErr('Failed to submit review.'); return; }
    setMsg('Review submitted for moderation.');
    setTitle(''); setBody('');
  };

  return (
    <form onSubmit={onSubmit} className={"stack-sm"} style={{ marginTop: 16 }}>
      <div><strong>Write a review</strong></div>
      <label>
        Rating
        <select value={rating} onChange={(e) => setRating(Number((e.target as HTMLSelectElement).value))}>
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>
      <label>
        Title
        <input value={title} onChange={(e) => setTitle((e.target as HTMLInputElement).value)} required />
      </label>
      <label>
        Review
        <textarea value={body} onChange={(e) => setBody((e.target as HTMLTextAreaElement).value)} required />
      </label>
      <button type="submit">Submit Review</button>
      {msg && <p>{msg}</p>}
      {err && <p role="alert">{err}</p>}
    </form>
  );
}
