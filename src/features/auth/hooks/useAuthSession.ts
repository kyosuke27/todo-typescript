import { useEffect, useState } from "react";

import { hasAuthenticatedUser } from "../api/auth";
import type { AuthSessionStatus } from "../types/auth";

/**
 * 画面表示時にAmplifyが復元できるCognitoセッションの有無を確認する。
 * effectのcleanup後は結果を反映せず、画面遷移後の不要なstate更新を防ぐ。
 */
export function useAuthSession(): AuthSessionStatus {
  const [status, setStatus] = useState<AuthSessionStatus>("checking");

  useEffect(() => {
    let shouldApplyResult = true;

    const checkSession = async () => {
      const isAuthenticated = await hasAuthenticatedUser();

      if (shouldApplyResult) {
        setStatus(isAuthenticated ? "signed-in" : "signed-out");
      }
    };

    void checkSession();

    return () => {
      shouldApplyResult = false;
    };
  }, []);

  return status;
}
