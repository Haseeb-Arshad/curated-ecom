import type { Route } from "./+types/browse";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Browse - Curated Design" }];
}

export async function loader({}: Route.LoaderArgs) {
  return null;
}

export default function Browse() {
  return (
    <section style={{ padding: "var(--space-16) var(--space-6)" }}>
      <h1>Browse</h1>
      <p>Categories coming soon.</p>
    </section>
  );
}
