import { useParams } from "react-router";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = ({ params }) => [
  { title: `Brand ${params.slug}` },
];

export default function BrandSlug() {
  const { slug } = useParams();
  return (
    <div className="container stack-md">
      <h1>Brand: {slug}</h1>
      <p>Brand details coming soon.</p>
    </div>
  );
}
