import { Navigate, Outlet, useLocation } from "react-router";

import { useAuthSession } from "../../features/auth";
import { createReturnTo } from "./routeState";

/**
 * 配下のルートをCognitoの認証状態で保護する。
 * セッション確認中は画面を確定せず、未認証時は元のURLを保持してログイン画面へ移動する。
 */
export function ProtectedRoute() {
  const location = useLocation();
  const authStatus = useAuthSession();

  if (authStatus === "checking") {
    return (
      <main
        className="grid min-h-svh place-items-center"
        aria-live="polite"
      >
        <p>認証状態を確認しています...</p>
      </main>
    );
  }

  if (authStatus === "signed-out") {
    return (
      <Navigate
        to="/"
        replace
        state={{ returnTo: createReturnTo(location) }}
      />
    );
  }

  return <Outlet />;
}
