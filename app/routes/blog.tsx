import type { Route } from "./+types/blog";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Blog" }];
}

export const links: Route.LinksFunction = () => [];

export default function Blog() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Blog</h1>
    </div>
  );
}
