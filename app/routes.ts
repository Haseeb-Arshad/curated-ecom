import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("browse", "routes/browse.tsx"),
  route("blog", "routes/blog.tsx"),
  route("info", "routes/info.tsx"),
  route("brands/:slug", "routes/brands.$slug.tsx"),
  route("categories/:slug", "routes/categories.$slug.tsx"),
  route("products/:slug", "routes/products.$slug.tsx"),
  route("lists", "routes/lists.tsx"),
  route("taxonomy", "routes/taxonomy.tsx"),
] satisfies RouteConfig;
