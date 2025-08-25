import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [{ title: "Lists" }];

export default function Lists() {
  return (
    <div className="container stack-md">
      <h1>Lists</h1>
      <p>Curated product lists will appear here.</p>
    </div>
  );
}
