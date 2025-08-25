import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [{ title: "Blog" }];

export default function BlogIndex() {
  return (
    <section className="container stack-md">
      <h1>Blog</h1>
      <p>Stories coming soon.</p>
    </section>
  );
}
