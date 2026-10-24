import {
  confirmSignIn,
  getCurrentUser,
  signIn,
  signOut,
} from "aws-amplify/auth";

import type {
  AdditionalAuthStep,
  AuthFailureCode,
  AuthResult,
  CompleteNewPasswordOutcome,
  RequiredUserAttributes,
  SignInOutcome,
} from "../types/auth";

/**
 * Amplifyのチャレンジ名を、画面やhooksが扱う認証方式へ変換する。
 * 未実装の方式はunsupportedとして残し、Cognitoの内部値をユーザーへ直接表示しない。
 */
function toAdditionalAuthStep(signInStep: string): AdditionalAuthStep {
  switch (signInStep) {
    case "CONFIRM_SIGN_IN_WITH_SMS_CODE":
      return "sms-code";
    case "CONFIRM_SIGN_IN_WITH_EMAIL_CODE":
      return "email-code";
    case "CONFIRM_SIGN_IN_WITH_TOTP_CODE":
      return "totp-code";
    default:
      return "unsupported";
  }
}

/**
 * SDK例外から例外名だけを安全に取得する。
 * 外部ライブラリの例外は必ずしもErrorのインスタンスとは限らないため、unknownのまま検査する。
 */
function getErrorName(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    typeof error.name === "string"
  ) {
    return error.name;
  }

  return "";
}

/**
 * 初回パスワード設定時のSDK例外を、画面表示に必要な失敗理由へ変換する。
 * Cognitoセッションはページ更新で失われるため、SignInExceptionは再ログイン可能な状態として扱う。
 */
function toNewPasswordFailure(error: unknown): AuthFailureCode {
  switch (getErrorName(error)) {
    case "InvalidPasswordException":
      return "password-policy";
    case "PasswordHistoryPolicyViolationException":
      return "password-history";
    case "SignInException":
    case "NotAuthorizedException":
      return "session-expired";
    default:
      return "unknown";
  }
}

/**
 * ユーザー名とパスワードでCognitoへのサインインを開始する。
 * 認証情報の誤りではユーザーの存在有無を推測できないよう、すべて同じ失敗理由へ正規化する。
 */
export async function signInWithPassword(
  username: string,
  password: string,
): Promise<AuthResult<SignInOutcome>> {
  try {
    const result = await signIn({ username, password });

    if (result.isSignedIn) {
      return { ok: true, value: { type: "signed-in" } };
    }

    if (
      result.nextStep.signInStep ===
      "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
    ) {
      return {
        ok: true,
        value: {
          type: "new-password-required",
          missingAttributes: result.nextStep.missingAttributes ?? [],
        },
      };
    }

    return {
      ok: true,
      value: {
        type: "additional-auth-required",
        step: toAdditionalAuthStep(result.nextStep.signInStep),
      },
    };
  } catch {
    return { ok: false, error: "invalid-credentials" };
  }
}

/**
 * NEW_PASSWORD_REQUIREDチャレンジへ新しいパスワードと不足属性を回答する。
 * この処理は直前のsignInが作成した一時セッションを使用するため、画面更新後には再ログインが必要となる。
 */
export async function completeNewPassword(
  newPassword: string,
  userAttributes: RequiredUserAttributes,
): Promise<AuthResult<CompleteNewPasswordOutcome>> {
  try {
    const hasRequiredAttributes = Object.keys(userAttributes).length > 0;
    const result = await confirmSignIn({
      challengeResponse: newPassword,
      options: hasRequiredAttributes ? { userAttributes } : undefined,
    });

    if (result.isSignedIn) {
      return { ok: true, value: { type: "signed-in" } };
    }

    return {
      ok: true,
      value: {
        type: "additional-auth-required",
        step: toAdditionalAuthStep(result.nextStep.signInStep),
      },
    };
  } catch (error) {
    return { ok: false, error: toNewPasswordFailure(error) };
  }
}

/**
 * Amplifyが有効なCognitoユーザーを復元できるか確認する。
 * 認証ガードでは例外の詳細を必要としないため、ログイン済みかどうかだけを返す。
 */
export async function hasAuthenticatedUser(): Promise<boolean> {
  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
}

/**
 * 現在のCognitoセッションを終了し、Amplifyが保持するローカルトークンも破棄する。
 * 失敗時にもSDK例外をUIへ公開せず、再試行可能な共通エラーとして返す。
 */
export async function signOutAuthenticatedUser(): Promise<AuthResult<void>> {
  try {
    await signOut();
    return { ok: true, value: undefined };
  } catch {
    return { ok: false, error: "unknown" };
  }
}
