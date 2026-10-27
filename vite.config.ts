import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Reactの変換とTailwind CSS v4の生成をViteのビルドパイプラインへ直接統合する。
 * Tailwind専用のViteプラグインを利用するため、別途PostCSS設定を経由する必要はない。
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
