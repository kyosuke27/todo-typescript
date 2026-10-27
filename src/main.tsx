import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";

import { router } from "./app/router";
import "./app/styles/index.css";
import { configureAmplify } from "./lib/amplify/configureAmplify";

// 認証featureが描画時に必ず初期化済みのAmplifyを利用できるよう、Reactの起動前に設定する。
configureAmplify();

// HTMLテンプレートが提供するReactのマウント先を取得し、起動前に存在を検証する。
const rootElement = document.getElementById("root");

// HTMLテンプレートの不整合を初期化時点で検知し、不完全な状態でアプリを動作させない。
if (!rootElement) {
  throw new Error("Reactのマウント先となるroot要素が見つかりません。");
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
