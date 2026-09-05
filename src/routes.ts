import { type RouteObject } from "react-router";
import Login from "./features/login/Login.tsx";
import App from "./App.tsx";

export default [
  { path: "/", Component: Login },
  { path: "/todo", Component: App },
] satisfies RouteObject[];
