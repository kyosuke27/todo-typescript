import { useEffect, useState } from "react";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { Navigate, useLocation } from "react-router";

type AuthStatus = "CHECKING" | "SIGNED_IN" | "SIGNED_OUT";

export default function App() {
  const location = useLocation();
  const [authStatus, setAuthStatus] = useState<AuthStatus>("CHECKING");

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await getCurrentUser();
        setAuthStatus("SIGNED_IN");
      } catch {
        setAuthStatus("SIGNED_OUT");
      }
    };

    void checkAuthentication();
  }, []);

  const handleLogout = async () => {
    await signOut();
    setAuthStatus("SIGNED_OUT");
  };

  if (authStatus === "CHECKING") {
    return <p>認証状態を確認しています...</p>;
  }

  if (authStatus === "SIGNED_OUT") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return (
    <main>
      <h1>ログイン済み</h1>

      <button type="button" onClick={handleLogout}>
        ログアウト
      </button>
    </main>
  );
}
