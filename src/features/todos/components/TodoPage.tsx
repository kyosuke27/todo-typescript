/** TODO画面が表示するログアウト操作の状態をapp層から受け取る。 */
type TodoPageProps = {
  onLogout: () => void;
  isSigningOut: boolean;
  signOutError: string;
};

/**
 * 認証済みユーザーへ表示するTODO画面の表示コンポーネント。
 * ログアウトの実処理はapp層から受け取り、todos featureがauth featureへ依存しないようにする。
 */
export function TodoPage({
  onLogout,
  isSigningOut,
  signOutError,
}: TodoPageProps) {
  return (
    <main className="grid min-h-svh place-content-center justify-items-center gap-5">
      <h1 className="text-4xl font-medium tracking-tight text-app-heading md:text-[56px]">
        ログイン済み
      </h1>

      {signOutError && (
        <p className="text-red-700" role="alert">
          {signOutError}
        </p>
      )}

      <button
        className="min-h-11 rounded-lg bg-app-accent px-5 font-bold text-white transition-[filter] hover:brightness-90 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-app-accent/50 disabled:cursor-not-allowed disabled:opacity-[0.65]"
        type="button"
        onClick={onLogout}
        disabled={isSigningOut}
      >
        {isSigningOut ? "ログアウト中..." : "ログアウト"}
      </button>
    </main>
  );
}
