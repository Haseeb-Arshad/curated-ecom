import type { Route } from "./+types/browse";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Browse" }];
}

export const links: Route.LinksFunction = () => [];

export default function Browse() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Browse</h1>
    </div>
  );
}
