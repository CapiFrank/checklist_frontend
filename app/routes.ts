import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  route("register", "./routes/register.tsx"),
  layout("./layouts/authenticated_layout.tsx", [
    route("tasks", "./routes/tasks.tsx"),
  ]),
] satisfies RouteConfig;
