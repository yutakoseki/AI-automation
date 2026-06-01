# Implementation Plan: TODO にタグ機能を追加（カンマ区切りで複数可）

## Issue Summary
TODO の追加・編集時にカンマ区切りでタグを複数入力できるようにし、各 TODO に任意個数のタグを保持・表示する。将来的にフィルタや色分けへの拡張ができる構造で実装する。

## Specification Summary
- `Todo` 型に `tags: string[]` を追加。
- `AddTodoModal` / `EditTodoModal` に「タグ（カンマ区切り）」入力欄を追加。
- 入力文字列をカンマ（`,` または日本語全角 `、`）で分割し、各要素を `trim`、空要素・重複を除外して `string[]` 化する。
- `pages/index.tsx` の `handleAdd` / `handleEdit` のシグネチャに `tags: string[]` を追加し、状態に保存する。
- `TodoItem` で `todo.tags` をバッジ（ラベル）として表示する。アクセシビリティを考慮した属性も付与する。
- タグは任意項目。空でも TODO 追加・編集は成立する（既存の必須項目バリデーションは変更しない）。

## 最小の安全なスライス
- 既存のロジック・UI・必須バリデーションは温存し、`tags` フィールドの追加と入力・表示にスコープを絞る。
- 共通のパースヘルパー `lib/parseTags.ts` を新設し、両モーダルから利用する。
- フィルタ／色分け／永続化／タグサジェスト等は将来拡張に回し、本 PR では実装しない。

## 対象ファイル
- `types/todo.ts`
- `components/AddTodoModal.tsx`
- `components/EditTodoModal.tsx`
- `components/TodoItem.tsx`
- `pages/index.tsx`
- `lib/parseTags.ts`（新規）

## 必要な変更

### 1. `types/todo.ts`
- `Todo` 型に `tags: string[]` を追加。

### 2. `lib/parseTags.ts`（新規）
- `parseTags(input: string): string[]` を default export または named export で提供。
- 仕様:
  - 入力を `,` または `、` で分割。
  - 各要素を `trim()`。
  - 空文字を除外。
  - 重複を除外（最初に出現した順を保持）。

### 3. `components/AddTodoModal.tsx`
- `tags` 用の state `const [tagsInput, setTagsInput] = useState("")` を追加。
- `<input>` でタグ入力欄を追加。`placeholder="タグ（カンマ区切り）"`。
- `onAdd` シグネチャ拡張: `(title, details, deadline, tags: string[])`。
- 追加時に `parseTags(tagsInput)` で配列化して渡す。
- タグは必須ではないため、空でも追加処理を続行する（既存の必須バリデーションは維持）。

### 4. `components/EditTodoModal.tsx`
- `tagsInput` の初期値は `(todo.tags ?? []).join(", ")` で復元。
- `<input>` でタグ入力欄を追加。
- `onSave` シグネチャ拡張: `(title, details, deadline, tags: string[])`。
- 保存時に `parseTags(tagsInput)` を渡す。

### 5. `components/TodoItem.tsx`
- `onEdit` シグネチャ拡張: `(id, title, details, deadline, tags: string[])`。
- `(todo.tags ?? []).map(...)` でバッジ要素を生成し、タイトル下の領域に表示する。
- バッジは丸い小さなラベル風（Tailwind 例: `inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`）。
- タグ全体のコンテナに `aria-label="タグ"` 等のアクセシビリティ属性を付与し、各バッジに `role="listitem"`（コンテナは `role="list"`）を付ける。

### 6. `pages/index.tsx`
- `handleAdd` シグネチャを `(title, details, deadline, tags: string[])` に拡張。
- 新 Todo の作成時に `tags` を含める。
- `handleEdit` シグネチャを `(id, title, details, deadline, tags: string[])` に拡張し、`tags` を更新する。
- `AddTodoModal` への props 伝搬を新シグネチャに合わせる。

## Required Test Items
- REQ-1: `types/todo.ts` の `Todo` 型に `tags: string[]` が追加されている。
- REQ-2: `AddTodoModal` にタグ入力欄（カンマ区切り）があり、入力された値がカンマ区切り → 配列としてパースされ、`onAdd` の引数として伝搬する。
- REQ-3: `EditTodoModal` にタグ入力欄があり、既存 TODO の `tags` が初期値として表示され、編集後の値が `onSave` に渡る。
- REQ-4: `pages/index.tsx` の `handleAdd` / `handleEdit` が `tags` を受け取り、`Todo` の `tags` フィールドに保存する。
- REQ-5: `TodoItem` で `todo.tags` がバッジ／ラベル状の UI として表示される（タグが 0 個の場合は何も表示しない）。
- REQ-6: タグのパース処理が以下を満たす：先頭・末尾の空白除去、空要素除外、重複除外。
- REQ-7: `npm run build` が成功する（型エラーなし）。

## Optional Test Items
- OPT-1: ダークモード（`dark:` クラス）でもタグバッジが視認可能。
- OPT-2: 全角カンマ（`、`）でもタグ区切りとして処理される。
- OPT-3: タグ表示コンテナに `aria-label` 等のアクセシビリティ属性が付与されている。

## Implementation Notes
- 既存の必須バリデーション（title / details / deadline）はそのまま。tags は任意（空配列 OK）。
- `TodoItem` 内では `todo.tags ?? []` で安全にアクセスし、既存の `Todo` 形式変更に強くする。
- 状態は引き続きインメモリ管理。永続化は不要。
- 入力欄は既存のスタイルパターン（`border`, `dark:` クラス, focus ring）を踏襲する。

## 実行コマンド
- `npm run build`

## リスク
- `Todo` 型の必須プロパティ追加により、既存の `setTodos(...)` 呼び出しすべてが `tags` を要求するようになる。本計画では `pages/index.tsx` の生成箇所をすべて更新するため整合する。
- `onEdit` / `onAdd` / `onSave` のシグネチャ変更は内部のみで、外部からの import は無いため影響は閉じている。
- 全角カンマ対応（`、`）は OPT 扱いだが、`parseTags` の最初の実装に組み込んでも安全（仕様としてリストアップ済み）。

## Out of Scope (今回の PR では実装しない)
- タグによる絞り込み（フィルタ）UI。
- タグごとの色分け（自動色割り当て）。
- タグ一覧画面 / タグサジェスト / オートコンプリート。
- 永続化（localStorage / DB 等）。
- タグの個別削除 UI（バッジに ✕ ボタン等）。

## Generator constraints
- Implement the plan autonomously without asking for human clarification.
- If the plan is broad or uncertain, implement the smallest safe slice described by the plan.
- Do not perform unrelated refactors or large rewrites.
- Prefer a useful, reviewable pull request over attempting to solve every out-of-scope item.
- If a requested file is missing, create it only when the plan explicitly requires a new file; otherwise choose the closest existing file from the target list.
- Do not run npm install, npm run build, npm run dev, or other shell commands. The evaluator will run verification commands after editing.
