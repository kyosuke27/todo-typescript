import { useLocation, useNavigate } from "react-router";

import { NewPasswordForm } from "../../features/auth";
import { getMissingAttributes, getSafeReturnTo } from "./routeState";

/**
 * 初回パスワード設定featureとアプリケーションのルーティングを接続する。
 * Cognitoの一時セッションが失われた場合に備え、利用者がログイン画面へ戻れる経路も提供する。
 */
export function NewPasswordRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = getSafeReturnTo(location.state);
  const missingAttributes = getMissingAttributes(location.state);

  return (
    <NewPasswordForm
      missingAttributes={missingAttributes}
      onSignedIn={() => navigate(returnTo, { replace: true })}
      onReturnToLogin={() =>
        navigate("/", {
          replace: true,
          state: { returnTo },
        })
      }
    />
  );
}
