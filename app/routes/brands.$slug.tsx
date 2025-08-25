import { useParams } from "react-router";
import type { Route } from "./+types/brands.$slug";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `Brand ${params.slug}` }];
}

export const links: Route.LinksFunction = () => [];

export default function BrandSlug() {
  const { slug } = useParams();
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Brand: {slug}</h1>
    </div>
  );
}
