import { useState } from "react";

import {
  authFieldClassName,
  authInputClassName,
  authLabelClassName,
} from "./styles";

/** パスワード入力欄の表示内容、ブラウザ補助情報、変更通知を定義する。 */
type PasswordFieldProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  autoComplete: "current-password" | "new-password";
  placeholder: string;
  disabled: boolean;
  onChange: (value: string) => void;
};

/**
 * 認証feature内で共通利用するパスワード入力欄を表示する。
 * 表示・非表示の状態は入力欄ごとに独立させ、確認用パスワードまで意図せず表示されることを防ぐ。
 */
export function PasswordField({
  id,
  name,
  label,
  value,
  autoComplete,
  placeholder,
  disabled,
  onChange,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={authFieldClassName}>
      <label className={authLabelClassName} htmlFor={id}>
        {label}
      </label>

      <div className="relative">
        <input
          className={`${authInputClassName} pr-[68px]`}
          id={id}
          name={name}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          required
        />

        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md border-0 bg-transparent px-1.5 py-1 text-[13px] font-semibold text-app-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent disabled:cursor-not-allowed disabled:opacity-[0.65]"
          onClick={() => setIsVisible((current) => !current)}
          aria-pressed={isVisible}
          aria-label={isVisible ? "パスワードを隠す" : "パスワードを表示"}
          disabled={disabled}
        >
          {isVisible ? "隠す" : "表示"}
        </button>
      </div>
    </div>
  );
}
