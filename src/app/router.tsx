import { createBrowserRouter } from "react-router";

import { LoginRoute } from "./routes/LoginRoute";
import { NewPasswordRoute } from "./routes/NewPasswordRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { TodoRoute } from "./routes/TodoRoute";

/**
 * アプリケーション全体のルート定義。
 * 認証が必要な画面はProtectedRouteのchildrenに限定し、保護漏れを構造的に防ぐ。
 */
export const router = createBrowserRouter([
  { path: "/", Component: LoginRoute },
  { path: "/new-password", Component: NewPasswordRoute },
  {
    Component: ProtectedRoute,
    children: [{ path: "/todo", Component: TodoRoute }],
  },
]);
