import { useState } from "react";

import { completeNewPassword } from "../api/auth";
import type {
  AdditionalAuthStep,
  AuthFailureCode,
  RequiredUserAttributes,
} from "../types/auth";

/** 初回パスワード設定が完了したことをapp層へ通知する。 */
type UseCompleteNewPasswordOptions = {
  onSignedIn: () => void;
};

/** パスワード一致確認とCognitoへのチャレンジ回答に必要な入力値。 */
type NewPasswordInput = {
  newPassword: string;
  passwordConfirmation: string;
  userAttributes: RequiredUserAttributes;
};

/**
 * 初回パスワード設定の失敗理由を、利用者が次の操作を判断できる文言へ変換する。
 */
function getFailureMessage(error: AuthFailureCode): string {
  switch (error) {
    case "password-policy":
      return "パスワードがCognitoの要件を満たしていません。文字数や文字種を確認してください。";
    case "password-history":
      return "以前使用したパスワードは設定できません。別のパスワードを入力してください。";
    case "session-expired":
      return "ログイン処理の有効期限が切れました。ログインからやり直してください。";
    case "invalid-credentials":
    case "unknown":
      return "パスワードを設定できませんでした。時間をおいてもう一度お試しください。";
  }
}

/**
 * パスワード設定後に要求される追加認証を説明する。
 * MFA画面が未実装でも、認証が完了していない状態でTODO画面へ進ませないために使用する。
 */
function getAdditionalAuthMessage(step: AdditionalAuthStep): string {
  switch (step) {
    case "sms-code":
      return "パスワードを設定しました。続けてSMSによる追加認証が必要です。";
    case "email-code":
      return "パスワードを設定しました。続けてメールによる追加認証が必要です。";
    case "totp-code":
      return "パスワードを設定しました。続けて認証アプリによる追加認証が必要です。";
    case "unsupported":
      return "パスワード設定後に、このアプリが未対応の追加認証が要求されました。";
  }
}

/**
 * 新しいパスワードの検証、Cognitoへのチャレンジ回答、送信状態を管理する。
 * 確認用パスワードはローカル検証だけに利用し、Cognitoへは送信しない。
 */
export function useCompleteNewPassword({
  onSignedIn,
}: UseCompleteNewPasswordOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * 入力値を検証してNEW_PASSWORD_REQUIREDチャレンジへ回答する。
   * 認証が完了した場合だけapp層へ通知し、追加認証が残る場合は画面に留める。
   */
  const submit = async ({
    newPassword,
    passwordConfirmation,
    userAttributes,
  }: NewPasswordInput) => {
    setErrorMessage("");

    if (newPassword !== passwordConfirmation) {
      setErrorMessage("入力したパスワードが一致しません。");
      return;
    }

    setIsSubmitting(true);
    const result = await completeNewPassword(newPassword, userAttributes);
    setIsSubmitting(false);

    if (!result.ok) {
      setErrorMessage(getFailureMessage(result.error));
      return;
    }

    if (result.value.type === "signed-in") {
      onSignedIn();
      return;
    }

    setErrorMessage(getAdditionalAuthMessage(result.value.step));
  };

  return { submit, isSubmitting, errorMessage };
}
