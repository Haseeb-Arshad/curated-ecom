import { useParams } from "react-router";
import type { Route } from "./+types/categories.$slug";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `Category ${params.slug}` }];
}

export const links: Route.LinksFunction = () => [];

export default function CategorySlug() {
  const { slug } = useParams();
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Category: {slug}</h1>
    </div>
  );
}
