import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";

export const meta: MetaFunction = ({ params }) => [
  { title: `${params.slug} - Blog` },
];

export async function loader({ params }: LoaderFunctionArgs) {
  return { slug: params.slug };
}

export default function BlogPost() {
  const { slug } = useLoaderData<typeof loader>();
  return (
    <article className="container stack-md">
      <h1>{slug}</h1>
      <p>Post content coming soon.</p>
    </article>
  );
}
