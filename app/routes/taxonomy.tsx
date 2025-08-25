import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [{ title: "Taxonomy" }];

export default function Taxonomy() {
  return (
    <div className="container stack-md">
      <h1>Taxonomy</h1>
      <p>Index of brands and categories.</p>
    </div>
  );
}
