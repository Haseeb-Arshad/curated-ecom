import type { Route } from "./+types/blog.$slug";
import { useLoaderData } from "react-router";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `${params.slug} - Blog` }];
}

export async function loader({ params }: Route.LoaderArgs) {
  return { slug: params.slug };
}

export default function BlogPost() {
  const { slug } = useLoaderData<typeof loader>();
  return (
    <article style={{ padding: "var(--space-16) var(--space-6)" }}>
      <h1>{slug}</h1>
      <p>Post content coming soon.</p>
    </article>
  );
}
