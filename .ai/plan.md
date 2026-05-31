# 実装計画: TailwindCSS 導入によるモダン UI/UX への刷新

## 概要
Next.js (Pages Router) ベースの TODO アプリに TailwindCSS を導入し、既存の CSS Modules ベースのスタイルを Tailwind ユーティリティクラスに置き換えてモダンな UI/UX に刷新する。レスポンシブ対応とダークモード対応も同時に組み込む。

## 現状把握
- Next.js 14 (Pages Router) + React 18 + TypeScript の構成
- スタイルは `styles/Home.module.css` と `styles/TodoItem.module.css` の CSS Modules のみ
- `pages/_app.tsx` および `pages/_document.tsx` は未作成（グローバル CSS の取り込み口がない）
- 主要画面: `pages/index.tsx`、`components/TodoItem.tsx`、`components/AddTodoModal.tsx`

## 実装ステップ

### 1. 依存関係の追加 (`package.json`)
- `devDependencies` に `tailwindcss`、`postcss`、`autoprefixer` を追加。

### 2. Tailwind / PostCSS 設定ファイルの新規作成
- `tailwind.config.js`
  - `content`: `./pages/**/*.{js,ts,jsx,tsx}`、`./components/**/*.{js,ts,jsx,tsx}`
  - `darkMode: 'media'`（OS 設定追従。ダークモード対応の最小実装）
  - `theme.extend` でフォントやカラーパレットを軽く拡張（オプション）
- `postcss.config.js`
  - `tailwindcss` と `autoprefixer` を読み込む

### 3. グローバル CSS の追加
- `styles/globals.css` を新規作成し、`@tailwind base; @tailwind components; @tailwind utilities;` を記述。
- 必要に応じて `body` / `html` の基本スタイル（背景色・テキストカラー・ダーク時の色）を `@layer base` で定義。

### 4. `pages/_app.tsx` の新規作成
- `globals.css` をインポートして全ページに適用する。

### 5. 各コンポーネントを Tailwind ユーティリティへ置き換え
- `pages/index.tsx`
  - CSS Modules インポートを削除し、`className` を Tailwind クラスへ置換。
  - カード状コンテナ、見出しタイポグラフィ、CTA ボタン、サマリーチップなどモダン UI へ。
  - レスポンシブ: `sm:`、`md:` を活用したパディング・幅調整。
  - ダーク: `dark:` プレフィックスで背景/文字色を切り替え。
- `components/TodoItem.tsx`
  - リストアイテムをカード調にし、チェックボックス・テキスト・編集 UI を縦横整理。
  - 完了時は `line-through` ＋ 不透明度を下げる。
  - ボタンは色とサイズで役割を区別（編集/保存/削除）。
- `components/AddTodoModal.tsx`
  - 背景オーバーレイ、中央寄せモーダル、フォーカスリング、フォーム間隔を Tailwind で再構築。

### 6. 旧 CSS Modules の削除
- `styles/Home.module.css` と `styles/TodoItem.module.css` を削除。
- いずれの参照も Tailwind 置換後に残らないことを `grep` で確認してから削除する。

### 7. 動作確認
- `npm install` で依存追加を反映。
- `npm run build` でビルドエラーがないことを確認。
- `npm run dev` でデスクトップ/モバイル幅・ライト/ダークの両方で見た目を確認（手動）。

## レスポンシブ / ダークモード方針
- レイアウトは `max-w-2xl mx-auto px-4 sm:px-6 lg:px-8` 等で中央寄せ＆段階的余白。
- カラーは `bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100` を基準パレットに。
- ボタンは `focus-visible:ring-2` でアクセシビリティ配慮。

## スコープ外（out_of_scope）
- ローカルストレージ永続化やバックエンド連携。
- ユーザー切り替え式（class 戦略）のダークモードトグル UI（今回は OS 追従の `media` 戦略で最小実装）。
- 既存ロジック（追加・編集・削除・完了トグル・「すべて完了」）の挙動変更。
- アニメーションライブラリ導入や複雑なトランジション。

## リスク
- `_app.tsx` 未作成のため、グローバル CSS 取り込み口の新設が必要。新規作成時の React/Next 型に注意。
- Tailwind 置換時に CSS Modules への参照が残ると未使用クラス警告や見た目崩れが起きる可能性 → 一括 grep で確認。
- Tailwind v3 系の `content` 設定が正しくないと本番ビルドでクラスがパージされる。

## Generator constraints
- Implement the plan autonomously without asking for human clarification.
- If the plan is broad or uncertain, implement the smallest safe slice described by the plan.
- Do not perform unrelated refactors or large rewrites.
- Prefer a useful, reviewable pull request over attempting to solve every out-of-scope item.
- If a requested file is missing, create it only when the plan explicitly requires a new file; otherwise choose the closest existing file from the target list.
