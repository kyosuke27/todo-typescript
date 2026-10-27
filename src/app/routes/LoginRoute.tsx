import { useLocation, useNavigate } from "react-router";

import { LoginForm } from "../../features/auth";
import { getSafeReturnTo } from "./routeState";

/**
 * ログインfeatureとアプリケーションのルーティングを接続する。
 * 認証成功時の復帰先と初回パスワード設定への遷移は、featureではなくapp層で決定する。
 */
export function LoginRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = getSafeReturnTo(location.state);

  return (
    <LoginForm
      onSignedIn={() => navigate(returnTo, { replace: true })}
      onNewPasswordRequired={(missingAttributes) =>
        navigate("/new-password", {
          replace: true,
          state: { returnTo, missingAttributes },
        })
      }
    />
  );
}
