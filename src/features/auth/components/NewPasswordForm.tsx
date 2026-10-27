import { useState, type FormEvent } from "react";

import { useCompleteNewPassword } from "../hooks/useCompleteNewPassword";
import type { RequiredUserAttributes } from "../types/auth";
import { AuthLayout } from "./AuthLayout";
import { PasswordField } from "./PasswordField";
import {
  authButtonBaseClassName,
  authFieldClassName,
  authInputClassName,
  authLabelClassName,
} from "./styles";

/** Cognitoの不足属性と、認証完了後にapp層へ通知する操作を受け取る。 */
type NewPasswordFormProps = {
  missingAttributes: string[];
  onSignedIn: () => void;
  onReturnToLogin: () => void;
};

/**
 * Cognito属性名を利用者向けのラベルへ変換する。
 * 未知のカスタム属性も入力可能にするため、対応表にない場合は属性名自体を表示する。
 */
function getAttributeLabel(attributeName: string): string {
  switch (attributeName) {
    case "email":
      return "メールアドレス";
    case "phone_number":
      return "電話番号";
    case "name":
      return "氏名";
    case "given_name":
      return "名";
    case "family_name":
      return "姓";
    default:
      return attributeName;
  }
}

/**
 * ブラウザの入力支援と基本検証を有効にするため、Cognito属性に対応するinput typeを返す。
 */
function getAttributeInputType(
  attributeName: string,
): "email" | "tel" | "text" {
  if (attributeName === "email") {
    return "email";
  }

  if (attributeName === "phone_number") {
    return "tel";
  }

  return "text";
}

/**
 * 初回ログイン時の新しいパスワードと、Cognitoが要求する不足属性を入力するフォームを表示する。
 * 確認用パスワードはCognitoへ送信せず、hook内の一致確認だけに利用する。
 */
export function NewPasswordForm({
  missingAttributes,
  onSignedIn,
  onReturnToLogin,
}: NewPasswordFormProps) {
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [userAttributes, setUserAttributes] =
    useState<RequiredUserAttributes>(() =>
      Object.fromEntries(
        missingAttributes.map((attributeName) => [attributeName, ""]),
      ),
    );
  const { submit, isSubmitting, errorMessage } = useCompleteNewPassword({
    onSignedIn,
  });

  /**
   * 特定の必須属性だけを更新し、他の入力値を保持する。
   * 属性名はログイン時にCognitoが返したmissingAttributesだけを利用する。
   */
  const updateUserAttribute = (attributeName: string, value: string) => {
    setUserAttributes((current) => ({
      ...current,
      [attributeName]: value,
    }));
  };

  /**
   * 入力内容をhookへ渡し、ローカル検証後にNEW_PASSWORD_REQUIREDチャレンジへ回答する。
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit({ newPassword, passwordConfirmation, userAttributes });
  };

  return (
    <AuthLayout
      titleId="new-password-title"
      title="新しいパスワードの設定"
      description="初回ログインに使用する新しいパスワードを入力してください。"
    >
      <form className="grid gap-[22px]" onSubmit={handleSubmit}>
        <PasswordField
          id="new-password"
          name="new-password"
          label="新しいパスワード"
          value={newPassword}
          onChange={setNewPassword}
          autoComplete="new-password"
          placeholder="新しいパスワードを入力"
          disabled={isSubmitting}
        />

        <PasswordField
          id="new-password-confirmation"
          name="new-password-confirmation"
          label="新しいパスワード（確認）"
          value={passwordConfirmation}
          onChange={setPasswordConfirmation}
          autoComplete="new-password"
          placeholder="新しいパスワードを再入力"
          disabled={isSubmitting}
        />

        {missingAttributes.map((attributeName) => (
          <div className={authFieldClassName} key={attributeName}>
            <label
              className={authLabelClassName}
              htmlFor={`required-attribute-${attributeName}`}
            >
              {getAttributeLabel(attributeName)}
            </label>

            <input
              className={authInputClassName}
              id={`required-attribute-${attributeName}`}
              name={attributeName}
              type={getAttributeInputType(attributeName)}
              value={userAttributes[attributeName] ?? ""}
              onChange={(event) =>
                updateUserAttribute(attributeName, event.target.value)
              }
              disabled={isSubmitting}
              required
            />
          </div>
        ))}

        {errorMessage && (
          <p className="text-sm leading-6 text-red-700" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          className={`${authButtonBaseClassName} mt-1.5 border-0 bg-app-accent text-white`}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "設定中..." : "パスワードを設定"}
        </button>

        <button
          className={`${authButtonBaseClassName} border border-app-accent/50 bg-transparent text-app-accent`}
          type="button"
          onClick={onReturnToLogin}
          disabled={isSubmitting}
        >
          ログイン画面へ戻る
        </button>
      </form>
    </AuthLayout>
  );
}
