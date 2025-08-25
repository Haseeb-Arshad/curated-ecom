import type { Route } from "./+types/blog._index";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Blog - Curated Design" }];
}

export async function loader({}: Route.LoaderArgs) {
  return null;
}

export default function BlogIndex() {
  return (
    <section style={{ padding: "var(--space-16) var(--space-6)" }}>
      <h1>Blog</h1>
      <p>Stories coming soon.</p>
    </section>
  );
}
