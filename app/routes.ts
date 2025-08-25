import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("browse", "routes/browse.tsx"),
  route("blog", "routes/blog._index.tsx", [
    route(":slug", "routes/blog.$slug.tsx"),
  ]),
  route("info", "routes/info.tsx"),
  route("categories/:category", "routes/categories.$category.tsx"),
  route("products/:productId", "routes/products.$productId.tsx"),
] satisfies RouteConfig;
