import type { ReactNode } from "react";

/** 認証画面の共通見出しと、その下に表示するフォームを受け取る。 */
type AuthLayoutProps = {
  titleId: string;
  title: string;
  description: string;
  children: ReactNode;
};

/**
 * ログイン関連画面で共通となる見出しとカードレイアウトを提供する。
 * 認証処理やフォーム状態は持たず、LoginFormとNewPasswordFormの視覚的一貫性だけを担う。
 */
export function AuthLayout({
  titleId,
  title,
  description,
  children,
}: AuthLayoutProps) {
  return (
    <main className="grid min-h-svh place-items-center bg-app-surface bg-[radial-gradient(circle_at_top_left,rgba(170,59,255,0.12),transparent_36%)] px-5 py-8">
      <section
        className="w-full max-w-[420px] rounded-[20px] border border-app-border bg-app-surface p-10 text-left shadow-app max-[520px]:rounded-2xl max-[520px]:px-6 max-[520px]:py-[30px]"
        aria-labelledby={titleId}
      >
        <div className="mb-8">
          <span className="mb-2 block text-xs font-bold tracking-[0.14em] text-app-accent">
            TODO APP
          </span>

          <h1
            id={titleId}
            className="mb-2.5 text-[32px] leading-[1.2] font-medium tracking-[-0.02em] text-app-heading"
          >
            {title}
          </h1>

          <p className="text-[15px] text-app-text">{description}</p>
        </div>

        {children}
      </section>
    </main>
  );
}
