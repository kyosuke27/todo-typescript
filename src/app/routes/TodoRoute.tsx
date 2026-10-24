import { useNavigate } from "react-router";

import { useSignOut } from "../../features/auth";
import { TodoPage } from "../../features/todos";

/**
 * TODO featureと認証featureをapp層で組み合わせる。
 * TODO featureへCognito依存を持ち込まず、ログアウト完了後の遷移もこのルートが担当する。
 */
export function TodoRoute() {
  const navigate = useNavigate();
  const { execute, isSigningOut, errorMessage } = useSignOut({
    onSignedOut: () => navigate("/", { replace: true }),
  });

  return (
    <TodoPage
      onLogout={() => void execute()}
      isSigningOut={isSigningOut}
      signOutError={errorMessage}
    />
  );
}
