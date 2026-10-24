import { useState, type FormEvent } from "react";

import { useSignIn } from "../hooks/useSignIn";
import { AuthLayout } from "./AuthLayout";
import { PasswordField } from "./PasswordField";
import {
  authButtonBaseClassName,
  authFieldClassName,
  authInputClassName,
  authLabelClassName,
} from "./styles";

/** 認証結果に応じた画面遷移をapp層へ通知するコールバック。 */
type LoginFormProps = {
  onSignedIn: () => void;
  onNewPasswordRequired: (missingAttributes: string[]) => void;
};

/**
 * ユーザー名とパスワードを受け取り、認証featureのログインユースケースを開始する。
 * 成功後の遷移先はapp層が決定するため、このコンポーネントはReact Routerへ依存しない。
 */
export function LoginForm({
  onSignedIn,
  onNewPasswordRequired,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { submit, isSubmitting, errorMessage } = useSignIn({
    onSignedIn,
    onNewPasswordRequired,
  });

  /**
   * ブラウザ標準のフォーム送信を止め、入力された認証情報をCognito認証フローへ渡す。
   * メールアドレスはCognitoのusernameとして扱う設定を前提としている。
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit({ username: email, password });
  };

  return (
    <AuthLayout
      titleId="login-title"
      title="ログイン"
      description="メールアドレスとパスワードを入力してください。"
    >
      <form className="grid gap-[22px]" onSubmit={handleSubmit}>
        <div className={authFieldClassName}>
          <label className={authLabelClassName} htmlFor="email">
            メールアドレス
          </label>

          <input
            className={authInputClassName}
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            placeholder="example@email.com"
            disabled={isSubmitting}
            required
          />
        </div>

        <PasswordField
          id="password"
          name="password"
          label="パスワード"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          placeholder="パスワードを入力"
          disabled={isSubmitting}
        />

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
          {isSubmitting ? "ログイン中..." : "ログイン"}
        </button>
      </form>
    </AuthLayout>
  );
}
