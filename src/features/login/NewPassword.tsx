import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { confirmSignIn } from "aws-amplify/auth";
import "./Login.css";

function NewPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from =
    (location.state as { from?: string } | null)?.from ?? "/todo";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (newPassword !== passwordConfirmation) {
      setErrorMessage("入力したパスワードが一致しません。");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await confirmSignIn({
        challengeResponse: newPassword,
      });

      if (result.isSignedIn) {
        navigate(from, { replace: true });
        return;
      }

      setErrorMessage(
        `追加の認証処理が必要です: ${result.nextStep.signInStep}`,
      );
    } catch (error) {
      console.error("Cognito新規パスワード設定エラー:", error);

      const errorName =
        error instanceof Error && "name" in error ? error.name : "";

      if (
        errorName === "InvalidPasswordException" ||
        errorName === "PasswordHistoryPolicyViolationException"
      ) {
        setErrorMessage(
          "パスワードがCognitoの要件を満たしていません。文字数や文字種を確認してください。",
        );
      } else {
        setErrorMessage(
          "パスワードを設定できませんでした。画面を更新した場合は、ログインからやり直してください。",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="new-password-title">
        <div className="login-card__heading">
          <span className="login-card__eyebrow">TODO APP</span>

          <h1 id="new-password-title" className="font-bold">
            新しいパスワードの設定
          </h1>

          <p>初回ログインに使用する新しいパスワードを入力してください。</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form__field">
            <label htmlFor="new-password">新しいパスワード</label>

            <div className="login-form__password">
              <input
                id="new-password"
                name="new-password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                placeholder="新しいパスワードを入力"
                disabled={isSubmitting}
                required
              />

              <button
                type="button"
                className="login-form__toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-pressed={showPassword}
                aria-label={
                  showPassword ? "パスワードを隠す" : "パスワードを表示"
                }
                disabled={isSubmitting}
              >
                {showPassword ? "隠す" : "表示"}
              </button>
            </div>
          </div>

          <div className="login-form__field">
            <label htmlFor="new-password-confirmation">
              新しいパスワード（確認）
            </label>

            <input
              id="new-password-confirmation"
              name="new-password-confirmation"
              type={showPassword ? "text" : "password"}
              value={passwordConfirmation}
              onChange={(event) =>
                setPasswordConfirmation(event.target.value)
              }
              autoComplete="new-password"
              placeholder="新しいパスワードを再入力"
              disabled={isSubmitting}
              required
            />
          </div>

          {errorMessage && (
            <p className="login-form__error" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            className="login-form__submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "設定中..." : "パスワードを設定"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default NewPassword;
