import { Amplify } from "aws-amplify";

/**
 * Vite環境変数から必須設定を取得し、未設定のまま認証処理が進むことを防ぐ。
 * 値そのものをエラーへ含めず、ログや画面から設定値が漏れないようにする。
 */
function getRequiredEnvironmentVariable(
  name: string,
  value: string | undefined,
): string {
  if (!value) {
    throw new Error(`必須の環境変数 ${name} が設定されていません。`);
  }

  return value;
}

/**
 * アプリの描画前にAmplifyへCognitoユーザープール設定を登録する。
 * UIやfeatureから設定責務を分離し、認証APIが常に初期化済みで呼ばれることを保証する。
 */
export function configureAmplify(): void {
  const userPoolId = getRequiredEnvironmentVariable(
    "VITE_COGNITO_USER_POOL_ID",
    import.meta.env.VITE_COGNITO_USER_POOL_ID,
  );
  const userPoolClientId = getRequiredEnvironmentVariable(
    "VITE_COGNITO_CLIENT_ID",
    import.meta.env.VITE_COGNITO_CLIENT_ID,
  );

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
      },
    },
  });
}
