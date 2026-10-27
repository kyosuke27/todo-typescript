import { useState } from "react";

import { signOutAuthenticatedUser } from "../api/auth";

/** Cognitoのセッション破棄後にapp層へ画面遷移を要求する。 */
type UseSignOutOptions = {
  onSignedOut: () => void;
};

/**
 * Cognitoからのログアウト処理と、ボタン表示に必要な進行状態を管理する。
 * 成功後の画面遷移はapp層へ委譲し、featureからルーターへの依存を排除する。
 */
export function useSignOut({ onSignedOut }: UseSignOutOptions) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Amplifyが保持する認証情報を破棄し、成功した場合だけログイン画面への遷移を要求する。
   */
  const execute = async () => {
    setErrorMessage("");
    setIsSigningOut(true);

    const result = await signOutAuthenticatedUser();
    setIsSigningOut(false);

    if (!result.ok) {
      setErrorMessage(
        "ログアウトできませんでした。時間をおいてもう一度お試しください。",
      );
      return;
    }

    onSignedOut();
  };

  return { execute, isSigningOut, errorMessage };
}
