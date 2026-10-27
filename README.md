# Todo TypeScript

React、TypeScript、Vite、AWS Amplify/Cognitoで構成したTODOアプリケーションです。

このリポジトリでは、コードが増えても責務と依存関係を追いやすくするため、[Bulletproof React](https://github.com/alan2207/bulletproof-react)の考え方を採用しています。このREADMEは、プロジェクトの起動方法だけでなく、現在の構成を教材としてアーキテクチャを学べるように説明します。

## セットアップ

必要な環境変数を`.env.local`へ設定します。

```dotenv
VITE_COGNITO_USER_POOL_ID=ap-northeast-1_xxxxxxxxx
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

依存関係をインストールして開発サーバーを起動します。

```bash
pnpm install
pnpm dev
```

利用できる検証コマンドは次のとおりです。

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Bulletproof Reactとは

Bulletproof Reactは、React公式のフレームワークや必須のテンプレートではありません。実務向けReactアプリケーションを整理するための、設計原則と実装例の集まりです。

Reactは自由度が高いため、ルールがないと次のような状態になりやすくなります。

- 画面コンポーネントにAPI通信、状態管理、画面遷移がすべて入る
- どの機能からでも別の機能を自由にimportできる
- 共通化されたファイルが、実際には特定の機能へ強く依存する
- 変更時にどこまで影響するのか分からなくなる

Bulletproof Reactでは、ファイルを責務ごとに分け、依存できる方向を決めることでこれらを防ぎます。大切なのはフォルダ名を暗記することではなく、次の原則です。

1. 機能固有のコードをfeature単位でまとめる
2. アプリ全体の組み立てはapp層で行う
3. 共通コードはどのfeatureにも依存しない
4. feature同士を直接接続せず、app層で組み合わせる
5. 外部ライブラリへの依存を境界へ閉じ込める

公式資料でも、これはすべてのアプリに対する唯一の正解ではなく、プロジェクトに合わせて一貫したルールを選ぶための指針と説明されています。詳しくは[公式README](https://github.com/alan2207/bulletproof-react)と[Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)を参照してください。

## 最も重要な依存方向

このプロジェクトでは、コードの依存を次の一方向にします。

```text
shared modules  →  features  →  app
   libなど          auth         routes
                   todos        router
```

矢印は「右側が左側をimportできる」ことを表します。

- `features`は`lib`などの共通層を利用できる
- `app`は`features`と共通層を利用できる
- 共通層は`features`や`app`を利用しない
- `auth`と`todos`など、feature同士は直接利用しない

この方向を守ると、下位層ほど再利用しやすく、上位層だけがアプリ固有の組み合わせを知る構造になります。

例えば、TODO画面にログアウトボタンがあっても、`todos` featureから`auth` featureを直接importしません。`TodoRoute`が両featureを読み込み、ログアウト関数をpropsとしてTODO画面へ渡します。

## 現在のディレクトリ構成

```text
src/
├── app/
│   ├── router.tsx
│   ├── routes/
│   │   ├── LoginRoute.tsx
│   │   ├── NewPasswordRoute.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── TodoRoute.tsx
│   │   └── routeState.ts
│   └── styles/
│       └── index.css
├── features/
│   ├── auth/
│   │   ├── api/
│   │   │   └── auth.ts
│   │   ├── components/
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── NewPasswordForm.tsx
│   │   │   └── PasswordField.tsx
│   │   ├── hooks/
│   │   │   ├── useAuthSession.ts
│   │   │   ├── useCompleteNewPassword.ts
│   │   │   ├── useSignIn.ts
│   │   │   └── useSignOut.ts
│   │   ├── types/
│   │   │   └── auth.ts
│   │   ├── Auth.css
│   │   └── index.ts
│   └── todos/
│       ├── components/
│       │   └── TodoPage.tsx
│       ├── Todo.css
│       └── index.ts
├── lib/
│   └── amplify/
│       └── configureAmplify.ts
└── main.tsx
```

必要になるまで空のディレクトリは作りません。例えば全体共有の`components`や`utils`が必要になった時点で追加します。

## 各層の責務

### `main.tsx`: アプリケーションの起動点

`main.tsx`は次の最低限の初期化だけを行います。

1. Amplifyを設定する
2. Reactのマウント先を確認する
3. Routerを描画する

認証やTODOの業務処理はここへ書きません。起動方法だけを知るファイルとして保ちます。

### `app`: 機能を組み合わせる層

`app`はアプリケーション全体を組み立てる場所です。

- URLと画面を関連付ける
- 認証が必要なルートを保護する
- ログイン成功後の遷移先を決める
- 複数featureを組み合わせる
- グローバルスタイルを読み込む

`LoginRoute`は`LoginForm`を表示し、ログイン成功時にどこへ遷移するかを決めます。`LoginForm`自身はReact Routerを知りません。

この分離により、フォームは「入力と認証」に集中し、ルートは「URLと遷移」に集中できます。

### `features`: 機能単位のコード

featureは、利用者から見た機能や業務上の関心ごとを表します。

現在は次の2つがあります。

- `auth`: ログイン、初回パスワード設定、セッション確認、ログアウト
- `todos`: TODO画面の表示

feature内では、さらに責務を分けます。

| ディレクトリ | 責務 | authでの例 |
| --- | --- | --- |
| `api` | 外部API・SDKとの通信 | Amplifyの`signIn`や`confirmSignIn` |
| `components` | 表示とユーザー入力 | `LoginForm` |
| `hooks` | UIから利用する状態とユースケース | `useSignIn` |
| `types` | feature内で複数ファイルが共有する型 | `SignInOutcome` |
| `index.ts` | feature外へ公開するもの | `LoginForm`のexport |

すべてのfeatureに全ディレクトリを作る必要はありません。`todos`はまだ表示だけなので、`components`と`index.ts`だけです。

### `lib`: 外部ライブラリの設定

`lib`には、アプリで使用する外部ライブラリの設定や薄いラッパーを置きます。

`configureAmplify.ts`は環境変数を検証し、CognitoのユーザープールをAmplifyへ登録します。この設定をUIへ置かないことで、画面コンポーネントがインフラ設定を知る必要がなくなります。

## 認証フローを使った読み方

ログイン処理を上位層から順番に追うと、各層の役割が理解しやすくなります。

```text
router.tsx
  ↓ URL「/」に対応するルートを選ぶ
LoginRoute.tsx
  ↓ 遷移方法をコールバックとして渡す
LoginForm.tsx
  ↓ 入力されたメールアドレスとパスワードを渡す
useSignIn.ts
  ↓ 送信状態と認証結果の分岐を管理する
api/auth.ts
  ↓ Amplify固有のAPIを呼び出す
AWS Amplify / Cognito
```

それぞれの層が知っている情報は異なります。

- `LoginRoute`はURLを知っているが、CognitoのAPIを知らない
- `LoginForm`は入力欄を知っているが、遷移先URLを知らない
- `useSignIn`はログインの進行状態を知っているが、Amplifyのチャレンジ文字列を知らない
- `api/auth.ts`はAmplifyを知っているが、画面構造を知らない

この「知らなくてよい情報を持たせない」ことが責務分離です。

## API層で外部ライブラリを隠す理由

Amplifyは初回ログイン時に、次のような固有の文字列を返します。

```text
CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED
```

コンポーネントがこの値を直接判定すると、すべての画面がAmplifyへ依存します。このプロジェクトでは`features/auth/api/auth.ts`が次のアプリ用結果へ変換します。

```ts
type SignInOutcome =
  | { type: "signed-in" }
  | { type: "new-password-required"; missingAttributes: string[] }
  | { type: "additional-auth-required"; step: AdditionalAuthStep };
```

これにより、将来認証SDKを変更した場合でも、主な修正箇所をAPI層へ限定できます。また、SDK例外を直接UIへ渡さないため、内部情報やユーザーの存在有無がエラーメッセージから漏れることも防ぎやすくなります。

## コンポーネントとhookを分ける理由

`LoginForm`は入力値を保持し、HTMLフォームを表示します。`useSignIn`は送信中かどうか、どのエラーを表示するか、ログイン結果をどう解釈するかを管理します。

分離する目安は次のとおりです。

- JSXやアクセシビリティが中心なら`components`
- 複数のstateと非同期処理をまとめるなら`hooks`
- ネットワークやSDK呼び出しなら`api`
- URLやfeatureの組み合わせなら`app`

ただし、小さな処理まで機械的にhookへ移す必要はありません。分離によって責務が明確になる場合だけ切り出します。

## 型をどこへ置くか

型は利用範囲に合わせて配置します。

```text
1ファイルだけで使用      → そのファイル内
feature内で複数利用      → features/<feature>/types
アプリ全体で複数利用     → src/types
ルーティングだけで使用    → app/routes付近
```

例えば、`SignInOutcome`はAPIとhookの両方が使用するため`features/auth/types/auth.ts`にあります。一方、`LoginFormProps`は`LoginForm.tsx`だけで使うため、同じファイル内に定義しています。

「型だからtypesへ置く」のではなく、「誰が使う型か」で判断します。

## Public APIとしての`index.ts`

このプロジェクトでは、feature外から利用できる要素を`index.ts`に限定します。

```ts
// 推奨: featureの公開面を利用する
import { LoginForm } from "../../features/auth";

// 非推奨: feature内部へ直接依存する
import { LoginForm } from "../../features/auth/components/LoginForm";
```

内部ファイルを直接参照すると、feature内の整理だけで利用側まで壊れます。Public APIを小さく保つことで、内部実装を変更しやすくします。

なお、現在のBulletproof React公式資料では、Viteのtree shakingやパフォーマンスへの影響から、大規模なbarrel fileの多用には注意が示されています。このリポジトリでは`AGENTS.md`の方針に従い、各featureのごく小さなPublic APIとして`index.ts`を利用します。何でも再exportするのではなく、app層が必要とするものだけを明示的に公開します。

## feature間を直接importしない理由

例えば`todos`から`auth`のログアウト処理を直接importすると、TODO機能が認証実装なしでは利用できなくなります。機能が増えるほど相互依存が生まれ、循環依存にもつながります。

このプロジェクトでは、`TodoRoute`が次のように両者を組み合わせます。

```text
app/TodoRoute
├── auth/useSignOutを利用
└── todos/TodoPageへonLogoutとして渡す
```

この構成なら、`TodoPage`は「押されたら渡された関数を呼ぶ」だけで、認証方式を知りません。

ESLintにも次の境界ルールを設定しています。

- 共通層からfeatureをimportしない
- app層からfeature内部を直接importしない
- featureから別featureを直接importしない

設計ルールを文章だけでなくツールでも検出することで、誤った依存を早い段階で見つけます。

## 新しい機能を追加するときの判断手順

例として「TODOを追加する」機能を実装する場合は、次の順に考えます。

1. 利用者から見た機能は何かを決める
2. 外部APIが必要なら`features/todos/api`へ追加する
3. 複数ファイルで共有する型を`features/todos/types`へ追加する
4. 非同期状態やユースケースを`features/todos/hooks`へ追加する
5. 表示と入力を`features/todos/components`へ追加する
6. app層から必要なものだけを`features/todos/index.ts`で公開する
7. URLや別featureとの組み合わせを`app/routes`で行う

最初からすべてのフォルダを作るのではなく、必要になった責務だけを追加します。

## ファイル配置の早見表

新しいコードの置き場所に迷った場合は、次の質問を順番に確認します。

1. URL、ルーティング、複数featureの組み合わせか
   - はい: `app`
2. 特定機能だけで使用するか
   - はい: `features/<feature>`
3. 外部ライブラリの設定や共通ラッパーか
   - はい: `lib`
4. 複数featureから本当に利用されるUIか
   - はい: `components`
5. 複数featureから本当に利用されるhook、型、関数か
   - はい: `hooks`、`types`、`utils`
6. まだ1箇所でしか使わないか
   - はい: 利用箇所の近くに置く

将来使いそうという理由だけで共通層へ移動しないことが重要です。実際に複数箇所で必要になってから共通化します。

## コメントの方針

このリポジトリでは`AGENTS.md`に従い、追加・変更コードへ詳細な日本語コメントを記載します。ただし、コードを日本語に言い換えるだけのコメントは避けます。

良いコメントは次を説明します。

- なぜその処理が必要なのか
- どの層との境界なのか
- 前提条件や副作用は何か
- エラー時にどうなるのか
- セキュリティ上なぜ制限しているのか

例えば`routeState.ts`では、復帰先URLが外部URLとして悪用されないように`//`から始まる値を拒否しています。コメントには文字列判定そのものではなく、この制限理由を記載しています。

## 現在の制約

- SMS、メール、TOTPを使用したMFA入力画面は未実装です
- TODOの登録・編集・削除機能は今後`todos` featureへ追加します
- 自動テスト基盤とテストコードはまだ追加していません
- 新規パスワード設定中にページを更新すると、Cognitoの一時セッションが失われるため再ログインが必要です

## 参考資料

- [Bulletproof React](https://github.com/alan2207/bulletproof-react)
- [Bulletproof React - Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)
- [React Documentation](https://react.dev/)
- [AWS Amplify Auth Documentation](https://docs.amplify.aws/react/build-a-backend/auth/)
