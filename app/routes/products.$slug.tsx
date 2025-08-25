import { useParams } from "react-router";
import type { Route } from "./+types/products.$slug";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `Product ${params.slug}` }];
}

export const links: Route.LinksFunction = () => [];

export default function ProductSlug() {
  const { slug } = useParams();
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Product: {slug}</h1>
    </div>
  );
}
