# 実装計画: TODO にタグ機能を追加

## Issue Summary
TODO 追加/編集時にカンマ区切りで複数タグを入力できるようにし、各 TODO が任意個数のタグを保持できる構造にする。タグは画面上にバッジ/ラベルとして表示し、将来的なタグごとの一覧・フィルタ・色分けを見据えた設計にする。

## Spec Summary
- `Todo` 型に `tags: string[]` フィールドを追加する。
- `AddTodoModal` と `EditTodoModal` にタグ入力欄を追加する。入力はカンマ区切りで複数タグを受け付け、各タグはトリムし空文字を除外し重複を排除する。
- `TodoItem` で各タグをバッジ/ラベルとして表示する（Tailwind スタイル、アクセシビリティを考慮）。
- `pages/index.tsx` の `handleAdd` / `handleEdit` をタグ配列を受け取れるように拡張する。
- 既存 TODO（タグ未設定）の表示・保存が壊れないよう後方互換に注意する（`tags` は省略可能扱いまたは空配列で初期化）。

## Required Test Items
- REQ-1: `Todo` 型に `tags: string[]` が存在する（static / TypeScript ビルド通過）。
- REQ-2: `AddTodoModal` にタグ入力欄が存在し、カンマ区切り入力 `家事, 買い物, 優先` から `["家事","買い物","優先"]` という配列が `onAdd` に渡される（diff/static で確認）。
- REQ-3: `EditTodoModal` でも既存タグを編集でき、保存時にカンマ区切り入力をパースしてタグ配列で `onSave` に渡される（diff/static）。
- REQ-4: `TodoItem` で `todo.tags` がバッジ/ラベル状に表示される（manual: 画面確認 / diff: 該当 JSX が存在する）。
- REQ-5: `next build` が成功し型エラーが出ない（build）。

## Optional Test Items
- OPT-1: タグの重複入力 (`家事, 家事`) はユニーク化される（diff/static）。
- OPT-2: タグバッジに将来の色分け・フィルタ拡張を想定したマークアップ（例: `data-tag` 属性や独立コンポーネント化）を入れる（reviewer）。
- OPT-3: 入力欄にプレースホルダ例 `家事, 買い物, 優先` を入れる（manual/diff）。
- OPT-4: タグ入力欄に `aria-label` を付与しアクセシビリティを担保する（diff）。

## Implementation Notes
1. `types/todo.ts`: `tags: string[]` を追加。
2. `AddTodoModal.tsx`: `tags` 用 state (`string`) を追加。`handleAdd` でカンマ区切り文字列を `split(',')` → `map(trim)` → `filter(Boolean)` → ユニーク化し、`onAdd(title, details, deadline, tags)` で渡す。propsの型を拡張。タグ未入力でも他必須項目があれば保存可能（タグは任意）。
3. `EditTodoModal.tsx`: 初期値は `todo.tags?.join(', ') ?? ''`。保存時は AddModal と同じパース。`onSave(title, details, deadline, tags)`。
4. `TodoItem.tsx`: タイトル/詳細の下に `todo.tags?.map(...)` でバッジ表示（`bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs` 程度）。aria-label に「タグ: 〜」を付ける。`onEdit` シグネチャ拡張に追従。
5. `pages/index.tsx`: `handleAdd` / `handleEdit` の引数に `tags: string[]` を追加して `Todo` に格納。`createId` 時の初期化に `tags: tags ?? []`。
6. 既存の表示順序（タイトル → 詳細 → 期限）を維持し、タグはその下に表示する。
7. タグの色分け・フィルタ・タグごとの一覧表示は今回の PR では扱わない（out_of_scope）。

## Out of Scope
- タグによる絞り込み/フィルタ UI。
- タグごとの色分け（プリセットや色選択）。
- タグの永続化（localStorage 等）。
- タグサジェスト（オートコンプリート）。

## Generator constraints
- 自律的に実装し、人間の確認を待たない。
- 計画が広い場合は本ドキュメントの最小スライスのみを実装する。
- 関係ない箇所のリファクタや大規模書き換えは行わない。
- 計画外のファイル (`tailwind.config.js`, `styles/globals.css` 等) は変更しない。
- npm install / npm run build / npm run dev 等は Generator では実行しない（評価側で検証する）。
