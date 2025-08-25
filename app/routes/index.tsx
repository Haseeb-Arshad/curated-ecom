import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Discover" }];
}

export const links: Route.LinksFunction = () => [];

export default function Index() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Discover</h1>
    </div>
  );
}
