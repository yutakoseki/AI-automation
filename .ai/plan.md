# Implementation Plan: TODO にタグ機能を追加（カンマ区切り）

## Issue Summary
TODO（タスク）追加・編集時、カンマ区切りで複数のタグを入力できる機能を実装する。各 TODO は任意個数のタグを持ち、画面上ではバッジ／ラベルとして表示する。将来的なタグ別フィルタや色分けにも備えた構造とする。

## Specification Summary
- `Todo` 型に `tags: string[]` を追加する。
- 追加モーダル（`AddTodoModal`）・編集モーダル（`EditTodoModal`）にタグ入力用テキスト欄を追加する。
- 入力文字列はカンマ（`,`）で分割し、各要素を `trim` して空文字を除去、重複も除去する。
- `pages/index.tsx` の `handleAdd` / `handleEdit` でタグ配列を受け取り、状態に保存する。
- `TodoItem` でタグを丸みのあるバッジ（`<span>` ベース）として並べて表示する。
- 入力欄には `<label>` と `aria-describedby` のヘルプテキストを付与し、アクセシビリティに配慮する。
- タグ機能は任意項目とし、未入力でも TODO 追加・編集は可能にする（タイトル・詳細・期限の必須バリデーションは現行どおり維持）。

## Required Test Items
- REQ-1: `Todo` 型に `tags: string[]` フィールドが追加されている。
- REQ-2: `AddTodoModal` にタグ入力欄（`<input>` または `<textarea>`）と関連ラベルが存在する。
- REQ-3: `EditTodoModal` にタグ入力欄が存在し、既存の `todo.tags` がカンマ区切り文字列として初期表示される。
- REQ-4: カンマ区切り文字列が、空白トリム・空要素除外・重複排除を経た `string[]` として `onAdd` / `onSave` に渡される。
- REQ-5: `TodoItem` が `todo.tags` をバッジ形式（個別の要素）で表示し、`tags` が空配列の場合は何も描画しない。
- REQ-6: タグ欄が空でも、タイトル・詳細・期限が入力されていれば TODO の追加・編集が成立する。
- REQ-7: `npm run build` が型エラー・ビルドエラーなく成功する。

## Optional Test Items
- OPT-1: タグバッジに `aria-label` または視覚的に判別しやすい配色（ダークモード対応）が設定されている。
- OPT-2: タグ入力欄に `aria-describedby` で「カンマ区切りで複数指定可」のヘルプテキストが紐付いている。
- OPT-3: タグの正規化処理（split/trim/dedupe）が将来の再利用を想定して 1 箇所にまとまっている。

## Implementation Notes
- 既存の入力 UI（白背景・focus ring）と統一感のある Tailwind クラスを使用する。
- 文字列→配列の正規化ロジックは両モーダルで重複しやすいので、各モーダル内のローカルヘルパーとして実装するか、`types/todo.ts` 隣の小さなユーティリティに置く。今回の最小スライスでは各モーダル内に同一実装で書いて差し支えない。
- 表示側のバッジは `bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full px-2 py-0.5 text-xs` 程度の控えめなスタイルを推奨。
- 既存 TODO の互換性のため、`tags` が `undefined` の場合は空配列として扱う防御コードを `TodoItem` 側に入れておく。
- フィルタリング UI 自体は本 PR のスコープ外（out_of_scope）。構造のみ用意する。

## Generator constraints
- 自律的に実装し、人間の確認を待たない。
- 計画外のファイル（`tailwind.config.js`, `styles/globals.css`, `next.config.js` 等）は変更しない。
- 関係ない箇所のリファクタや大規模書き換えは行わない。
- `npm install` や `npm run build` などのシェルコマンドは Generator では実行しない（Evaluator が検証する）。
