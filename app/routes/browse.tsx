import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [{ title: "Browse" }];

export default function Browse() {
  return (
    <div className="container stack-md">
      <h1>Browse</h1>
      <p>Browse all categories.</p>
    </div>
  );
}
