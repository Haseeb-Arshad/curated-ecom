import type { Route } from "./+types/taxonomy";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Taxonomy" }];
}

export const links: Route.LinksFunction = () => [];

export default function Taxonomy() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Taxonomy</h1>
    </div>
  );
}
