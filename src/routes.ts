import { type RouteObject } from "react-router";
import Login from "./features/login/Login.tsx";
import NewPassword from "./features/login/NewPassword.tsx";
import App from "./App.tsx";

export default [
  { path: "/", Component: Login },
  { path: "/new-password", Component: NewPassword },
  { path: "/todo", Component: App },
] satisfies RouteObject[];
