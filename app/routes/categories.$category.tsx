import type { Route } from "./+types/categories.$category";
import { useLoaderData } from "react-router";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `${params.category} - Curated Design` }];
}

export async function loader({ params }: Route.LoaderArgs) {
  return { category: params.category };
}

export default function Category() {
  const { category } = useLoaderData<typeof loader>();
  return (
    <section style={{ padding: "var(--space-16) var(--space-6)" }}>
      <h1>{category}</h1>
      <p>Products coming soon.</p>
    </section>
  );
}
