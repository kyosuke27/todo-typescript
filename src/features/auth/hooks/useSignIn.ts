import { useState } from "react";

import { signInWithPassword } from "../api/auth";
import type { AdditionalAuthStep } from "../types/auth";

/** ログイン結果に対応する遷移処理をapp層から受け取る。 */
type UseSignInOptions = {
  onSignedIn: () => void;
  onNewPasswordRequired: (missingAttributes: string[]) => void;
};

/** Cognitoのパスワード認証へ渡す、フォーム入力済みの認証情報。 */
type SignInCredentials = {
  username: string;
  password: string;
};

/**
 * 追加認証の種類を、利用者向けの説明へ変換する。
 * 現時点ではMFA入力画面を提供していないため、必要な方式を案内して処理を停止する。
 */
function getAdditionalAuthMessage(step: AdditionalAuthStep): string {
  switch (step) {
    case "sms-code":
      return "SMSで受信した確認コードによる追加認証が必要です。";
    case "email-code":
      return "メールで受信した確認コードによる追加認証が必要です。";
    case "totp-code":
      return "認証アプリの確認コードによる追加認証が必要です。";
    case "unsupported":
      return "このアプリが未対応の追加認証が必要です。";
  }
}

/**
 * ログインフォームの送信状態とCognito認証のユースケースを管理する。
 * 画面遷移はコールバックでapp層へ通知し、このhook自体はReact Routerへ依存しない。
 */
export function useSignIn({
  onSignedIn,
  onNewPasswordRequired,
}: UseSignInOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * 入力された認証情報でログインを開始し、次の認証状態に応じて呼び出し元へ通知する。
   * 同一メッセージを利用することで、認証失敗からユーザーの存在有無が判別されることを防ぐ。
   */
  const submit = async ({ username, password }: SignInCredentials) => {
    setErrorMessage("");
    setIsSubmitting(true);

    const result = await signInWithPassword(username, password);
    setIsSubmitting(false);

    if (!result.ok) {
      setErrorMessage("メールアドレスまたはパスワードを確認してください。");
      return;
    }

    switch (result.value.type) {
      case "signed-in":
        onSignedIn();
        return;
      case "new-password-required":
        onNewPasswordRequired(result.value.missingAttributes);
        return;
      case "additional-auth-required":
        setErrorMessage(getAdditionalAuthMessage(result.value.step));
    }
  };

  return { submit, isSubmitting, errorMessage };
}
