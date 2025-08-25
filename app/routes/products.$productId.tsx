import type { Route } from "./+types/products.$productId";
import { useLoaderData } from "react-router";

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `${data.name} – Curated Design` },
    { property: "og:type", content: "product" },
    { property: "og:title", content: data.name },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const product = {
    id: params.productId || "1",
    name: "Placeholder Product",
    brand: "Brand",
    category: "Tech",
    image: "/images/placeholder.svg",
    description: "Product description coming soon.",
  };
  return product;
}

export default function Product() {
  const product = useLoaderData<typeof loader>();
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: product.brand,
    category: product.category,
    image: product.image,
    description: product.description,
  };
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
        item: `https://curated.design/categories/${product.category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://curated.design/products/${product.id}`,
      },
    ],
  };
  return (
    <article style={{ padding: "var(--space-16) var(--space-6)" }}>
      <h1>{product.name}</h1>
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        decoding="async"
        style={{ maxWidth: "400px", aspectRatio: "1/1", objectFit: "contain" }}
      />
      <p>{product.description}</p>
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
