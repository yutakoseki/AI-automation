# 実装計画: タスク追加・編集モーダルのダーク化＆デザイン統一

## Issue 概要
タスク追加 (`components/AddTodoModal.tsx`) と編集 (`components/EditTodoModal.tsx`) のモーダルが、ハードコードされた白背景 (`bg-white`) と固定のグレー系テキストで描画されており、アプリ全体で適用されているダークモード (`pages/index.tsx`, `components/TodoItem.tsx`, `styles/globals.css` の `dark:` 系クラス) と統一されていない。両モーダルを既存のダーク配色 (`dark:bg-gray-900`, `dark:bg-gray-800`, `dark:text-gray-100` 等) と整合させ、フォーム・ボタンのトーン、レスポンシブ、アクセシビリティも軽く整える。

## 最小の安全なスライス
両モーダルコンポーネントの className のみを更新する。Props・state・コールバック・ロジックには触れない。新規ファイル追加や共通化リファクタは行わない。`tailwind.config.js`・`postcss.config.js`・`styles/globals.css` も変更しない (現状の `media` ベースのダーク戦略を維持)。

## 対象ファイル
- `components/AddTodoModal.tsx`
- `components/EditTodoModal.tsx`

## 必要な変更
両ファイルに同じパターンを適用する (見出し id とラベルだけ別)。

1. **オーバーレイ** `<div className="fixed inset-0 ...">`
   - 既存: `bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full`
   - 追加: `dark:bg-black dark:bg-opacity-60`
   - アクセシビリティ属性を追加: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="add-todo-modal-title"` (Add 側) / `aria-labelledby="edit-todo-modal-title"` (Edit 側)。

2. **パネル** `<div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">`
   - 置換: `border` → `border border-gray-200 dark:border-gray-700`
   - 置換: `bg-white` → `bg-white dark:bg-gray-900` (index.tsx のメインカードと揃える)
   - 置換: `w-96` → `w-11/12 max-w-md` (狭幅でのはみ出し回避)

3. **見出し** `<h2 ...>`
   - 置換: `text-gray-900` → `text-gray-900 dark:text-gray-100`
   - 追加: `id="add-todo-modal-title"` / `id="edit-todo-modal-title"`

4. **フォーム入力** (title input / details textarea / date input すべて)
   - 置換: `border` → `border border-gray-300 dark:border-gray-600`
   - 追加: `bg-white dark:bg-gray-800`
   - 置換: `text-gray-900 placeholder-gray-500` → `text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400`
   - 追加: `focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`

5. **ボタン**
   - プライマリ (`追加` / `保存`): 既存 `bg-blue-500 hover:bg-blue-700` は維持し、`focus:outline-none focus:ring-2 focus:ring-blue-400` を追加。
   - セカンダリ (`キャンセル`): `bg-gray-500 hover:bg-gray-700` を `bg-gray-500 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400` に変更。

## 受け入れ条件
- ダークモードで両モーダルのパネル背景・テキスト・入力・ボタンが暗系トーンになり、`pages/index.tsx` 内のカード (`dark:bg-gray-900`) と視覚的に同系統になる。
- ライトモードでも違和感がない (既存の白系トーンを保つ)。
- 幅 360px のビューポートでも水平スクロールが発生しない。
- フォーム入力とボタンがフォーカス時に視認可能なリングを表示する。
- `<div role="dialog" aria-modal="true" aria-labelledby="…">` が両モーダルに付与され、見出しに対応する `id` が存在する。
- Props・state・ハンドラのシグネチャに変更はない。
- `npm run build` が成功する。

## 実行コマンド
- `npm run build`

## リスク
- `tailwind.config.js` を読まずに進めているが、本リポジトリは Tailwind v3 で既に `dark:` 系を多用しており、戦略は既定の `media`。後で `class` 戦略へ切り替えても同じ `dark:` クラスは動く。
- `bg-opacity-*` は Tailwind v4 で廃止予定だが、v3 をピン留めしているので問題なし。
- `<input type="date">` のカレンダーポップアップはブラウザ依存で完全には暗色化できない。フィールド本体のみテーマ適用される。

## スコープ外 (後続)
- `AddTodoModal` と `EditTodoModal` を共通 `<Modal>` コンポーネントへリファクタ。
- ESC キーで閉じる / 背景クリックで閉じる / フォーカストラップ。
- 明示的なダーク/ライト切替トグル UI の追加。
- 日付ピッカーの完全な暗色化。

## Generator constraints
- 自律的に実装し、人間の確認を待たない。
- 計画が広い場合は本ドキュメントの最小スライスのみを実装する。
- 関係ない箇所のリファクタや大規模書き換えは行わない。
- 計画外のファイル (`tailwind.config.js`, `styles/globals.css`, `pages/`, `types/` 等) は変更しない。

## Generator constraints
- Implement the plan autonomously without asking for human clarification.
- If the plan is broad or uncertain, implement the smallest safe slice described by the plan.
- Do not perform unrelated refactors or large rewrites.
- Prefer a useful, reviewable pull request over attempting to solve every out-of-scope item.
- If a requested file is missing, create it only when the plan explicitly requires a new file; otherwise choose the closest existing file from the target list.
- Do not run npm install, npm run build, npm run dev, or other shell commands. The evaluator will run verification commands after editing.
