/** ログイン完了後に復帰するURLをlocation.stateへ保持するための内部形式。 */
type ReturnToRouteState = {
  returnTo?: unknown;
};

/** 初回パスワード設定画面へ、復帰先とCognitoの不足属性を渡すための内部形式。 */
type NewPasswordRouteState = ReturnToRouteState & {
  missingAttributes?: unknown;
};

/** 復帰先URLの生成に必要なReact Routerのlocation情報だけを表す。 */
type RouteLocation = {
  pathname: string;
  search: string;
  hash: string;
};

/**
 * React Routerのlocationから、ログイン後に復帰するアプリ内URLを生成する。
 * pathnameだけでなく検索条件とハッシュも保持し、保護画面の表示状態を可能な限り復元する。
 */
export function createReturnTo(location: RouteLocation): string {
  return `${location.pathname}${location.search}${location.hash}`;
}

/**
 * location.stateから安全なアプリ内遷移先だけを取り出す。
 * `//example.com`形式を拒否し、認証後の遷移を外部URLへ悪用されないようにする。
 */
export function getSafeReturnTo(
  state: unknown,
  fallback = "/todo",
): string {
  if (typeof state !== "object" || state === null) {
    return fallback;
  }

  const { returnTo } = state as ReturnToRouteState;
  const isInternalPath =
    typeof returnTo === "string" &&
    returnTo.startsWith("/") &&
    !returnTo.startsWith("//");

  return isInternalPath ? returnTo : fallback;
}

/**
 * 新規パスワード画面へ渡されたCognitoの不足属性だけを文字列配列として復元する。
 * location.stateは外部入力として扱い、不正な値が混ざっている場合は破棄する。
 */
export function getMissingAttributes(state: unknown): string[] {
  if (typeof state !== "object" || state === null) {
    return [];
  }

  const { missingAttributes } = state as NewPasswordRouteState;

  if (!Array.isArray(missingAttributes)) {
    return [];
  }

  return missingAttributes.filter(
    (attributeName): attributeName is string =>
      typeof attributeName === "string" && attributeName.length > 0,
  );
}
