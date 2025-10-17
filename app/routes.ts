import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Index route
  index("routes/_index.tsx"),
  // Service worker route
  route("sw.js", "routes/sw.js.tsx"),
  // Simple top-level routes
  route("browse", "routes/browse.tsx"),
  route("info", "routes/info.tsx"),
  route("lists", "routes/lists.tsx"),
  route("taxonomy", "routes/taxonomy.tsx"),
  // Dynamic routes
  route("products/:slug", "routes/products.$slug.tsx"),
  route("brands/:slug", "routes/brands.$slug.tsx"),
  route("categories/:slug", "routes/categories.$slug.tsx"),
  // Blog routes (flat)
  route("blog", "routes/blog._index.tsx"),
  route("blog/:slug", "routes/blog.$slug.tsx"),
] satisfies RouteConfig;
