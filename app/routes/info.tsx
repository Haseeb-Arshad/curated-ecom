import type { Route } from "./+types/info";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Info" }];
}

export const links: Route.LinksFunction = () => [];

export default function Info() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Info</h1>
    </div>
  );
}
