import { useState, type SubmitEvent } from "react";
import { useNavigate, useLocation } from "react-router";
import "./Login.css";
import axios from "axios";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const url =
    //   "https://example.com";
    // const data = {
    //   email: email,
    //   password: password,
    // };

    // axiosを使ってGETリクエストを送信する
    // axios
    //   .post(url, { params: data })
    //   .then((response) => {
    //     console.log("レスポンス:", response.data);
    //     // レスポンスの処理をここに追加する
    //   })
    //   .catch((error) => {
    //     console.error("エラー:", error);
    //     // エラーの処理をここに追加する
    //   });
    const fromTo = location.state?.from?.pathname || "/todo";
    navigate(fromTo, { replace: true });
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
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="example@email.com"
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
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="パスワードを入力"
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
              >
                {showPassword ? "隠す" : "表示"}
              </button>
            </div>
          </div>

          <button className="login-form__submit" type="submit">
            ログイン
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
