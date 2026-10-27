/**
 * 認証フォーム内で共通利用するTailwindユーティリティ。
 * 入力欄ごとに同じ長いクラス列を複製すると、フォーカス表示や無効状態の修正漏れが起きるため、
 * feature内部の表示規約としてまとめている。文字列は静的に保ち、Tailwindのクラス検出対象にする。
 */
export const authFieldClassName = "grid gap-2";

/** 認証フォームのラベルに共通する視認性と文字組みを定義する。 */
export const authLabelClassName =
  "text-sm font-semibold text-app-heading";

/**
 * 認証フォームのテキスト入力に共通する外観と操作状態を定義する。
 * フォーカスリングはキーボード操作時にも現在位置を判別できるよう、背景色だけに依存させない。
 */
export const authInputClassName =
  "min-h-12 w-full box-border rounded-[10px] border border-app-border bg-app-surface px-3.5 text-base text-app-heading outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-zinc-400 focus:border-app-accent focus:ring-3 focus:ring-app-accent/10 disabled:cursor-not-allowed disabled:opacity-[0.65]";

/** 送信ボタンと補助ボタンに共通するサイズ、操作フィードバック、無効状態を定義する。 */
export const authButtonBaseClassName =
  "min-h-[50px] rounded-[10px] font-bold transition-[filter,transform] duration-150 hover:brightness-90 active:translate-y-px focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-app-accent/50 disabled:cursor-not-allowed disabled:opacity-[0.65] disabled:filter-none";
