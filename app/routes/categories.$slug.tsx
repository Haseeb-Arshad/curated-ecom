import { useParams } from "react-router";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = ({ params }) => [
  { title: `Category ${params.slug}` },
];

export default function CategorySlug() {
  const { slug } = useParams();
  return (
    <div className="container stack-md">
      <h1>Category: {slug}</h1>
      <p>Category details coming soon.</p>
    </div>
  );
}
