import type { Route } from "./+types/lists";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Lists" }];
}

export const links: Route.LinksFunction = () => [];

export default function Lists() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Lists</h1>
    </div>
  );
}
