import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { signIn } from "aws-amplify/auth";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    const from =
      (
        location.state as {
          from?: {
            pathname?: string;
          };
        } | null
      )?.from?.pathname ?? "/todo";

    try {
      const result = await signIn({
        // Cognitoではメールアドレスもusernameとして渡します
        username: email,
        password,
      });

      if (result.isSignedIn) {
        navigate(from, {
          replace: true,
        });

        return;
      }

      switch (result.nextStep.signInStep) {
        case "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED":
          navigate("/new-password", {
            replace: true,
            state: { from },
          });
          break;

        case "CONFIRM_SIGN_IN_WITH_SMS_CODE":
        case "CONFIRM_SIGN_IN_WITH_EMAIL_CODE":
        case "CONFIRM_SIGN_IN_WITH_TOTP_CODE":
          setErrorMessage("確認コードによる追加認証が必要です。");
          break;

        default:
          setErrorMessage(
            `追加の認証処理が必要です: ${result.nextStep.signInStep}`,
          );
      }
    } catch (error) {
      console.error("Cognitoログインエラー:", error);

      // ユーザーの存在有無を画面上で判別させないように、
      // 基本的には同じエラーメッセージを表示します。
      setErrorMessage("メールアドレスまたはパスワードを確認してください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-card__heading">
          <span className="login-card__eyebrow">TODO APP</span>

          <h1 id="login-title" className="font-bold">
            ログイン
          </h1>

          <p>メールアドレスとパスワードを入力してください。</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form__field">
            <label htmlFor="email">メールアドレス</label>

            <input
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

          <div className="login-form__field">
            <label htmlFor="password">パスワード</label>

            <div className="login-form__password">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                placeholder="パスワードを入力"
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
            {isSubmitting ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
