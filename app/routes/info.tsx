import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [{ title: "Info" }];

export default function Info() {
  return (
    <div className="container stack-md">
      <h1>Info</h1>
      <p>More information coming soon.</p>
    </div>
  );
}
