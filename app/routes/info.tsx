import type { Route } from "./+types/info";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Info - Curated Design" }];
}

export async function loader({}: Route.LoaderArgs) {
  return null;
}

export default function Info() {
  return (
    <section style={{ padding: "var(--space-16) var(--space-6)" }}>
      <h1>Info</h1>
      <p>About page coming soon.</p>
    </section>
  );
}
