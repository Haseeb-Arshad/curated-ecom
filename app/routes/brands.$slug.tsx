import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import ProductCard from "../components/ProductCard";

export const meta: MetaFunction = ({ params }) => [
  { title: `Brand ${params.slug}` },
];

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = params.slug ?? "";
  let items: any[] = [];
  try {
    // eslint-disable-next-line no-undef
    const base = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
    if (base) {
      const res = await fetch(`${base}/api/products?brand=${encodeURIComponent(slug)}&limit=60`);
      if (res.ok) {
        const data = await res.json();
        items = Array.isArray(data.items) ? data.items : [];
      }
    }
  } catch {}
  if (items.length === 0) {
    const local = await import("../data/products");
    items = local.products.filter((p) => p.brand.toLowerCase().replace(/\s+/g,'-') === slug);
  }
  return { slug, items };
}

export default function BrandSlug() {
  const { slug, items } = useLoaderData<typeof loader>();
  return (
    <div className="container stack-md">
      <h1>Brand: {slug}</h1>
      {items.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul role="list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {items.map((p: any) => (
            <li key={p.id}><ProductCard product={{ id: p.id, name: p.name, brand: p.brand ?? '', category: p.category ?? '', image: p.image ?? '/images/placeholder.svg' }} /></li>
          ))}
        </ul>
      )}
    </div>
  );
}
