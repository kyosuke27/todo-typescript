/**
 * Cognitoが追加認証を要求した場合に、アプリケーション内で扱う認証方式を表す。
 * Amplify固有のチャレンジ名をUIへ漏らさないことで、認証基盤の変更範囲をapi層に限定する。
 */
export type AdditionalAuthStep =
  | "sms-code"
  | "email-code"
  | "totp-code"
  | "unsupported";

/**
 * ユーザー名とパスワードによるログインの結果を表す。
 * 初回パスワード変更では、Cognitoが追加で要求するユーザー属性も次画面へ引き継ぐ。
 */
export type SignInOutcome =
  | { type: "signed-in" }
  | {
      type: "new-password-required";
      missingAttributes: string[];
    }
  | {
      type: "additional-auth-required";
      step: AdditionalAuthStep;
    };

/**
 * 初回パスワード設定後の認証結果を表す。
 * ユーザープールでMFAが有効な場合は、パスワード設定後も追加認証が続く可能性がある。
 */
export type CompleteNewPasswordOutcome =
  | { type: "signed-in" }
  | {
      type: "additional-auth-required";
      step: AdditionalAuthStep;
    };

/**
 * 認証処理で画面へ通知する失敗理由を表す。
 * SDKの例外オブジェクトを画面へ直接渡さず、表示可能な情報だけを公開する。
 */
export type AuthFailureCode =
  | "invalid-credentials"
  | "password-policy"
  | "password-history"
  | "session-expired"
  | "unknown";

/**
 * 認証APIの成功値または安全に正規化された失敗理由を保持する。
 * 例外ではなく判別可能なunionで返すことで、呼び出し側のエラー処理漏れを防ぐ。
 */
export type AuthResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: AuthFailureCode };

/**
 * 初回パスワード設定時にCognitoへ送信する必須属性の値を表す。
 * キーはログイン時のmissingAttributesから取得し、値はユーザー入力だけを格納する。
 */
export type RequiredUserAttributes = Record<string, string>;

/**
 * 認証ガードが画面描画を判断するための状態を表す。
 * 確認中を明示することで、未認証画面が一瞬表示されることを防ぐ。
 */
export type AuthSessionStatus = "checking" | "signed-in" | "signed-out";
