# AI Evaluation

## Verdict Inputs
- Evaluation round: 1
- Plan summary: Todo モデルに tags フィールドを追加し、追加/編集モーダルでカンマ区切り入力を受け付け、TodoItem にバッジ表示する。フィルタ等の高度機能は out_of_scope。
- Planner confidence: high
- Final changed files: 5
- Final changed target files: 5
- Final unplanned changed files: 0
- Generator automatic repair attempts: 3
- Evaluator requested fixes: 0

## Required Test Items
- [必須] REQ-1: types/todo.ts の Todo 型に tags: string[] フィールドが存在する。 / 指標: types/todo.ts に `tags` プロパティが宣言されており、要素型が string の配列であること。
- [必須] REQ-2: AddTodoModal にタグ入力欄が追加され、カンマ区切り文字列が string[] にパースされて onAdd に渡される。 / 指標: AddTodoModal.tsx で tags 用 input が存在し、`,` で split → trim → 空除去 のロジックが含まれ、onAdd の引数として tags 配列が渡されること。
- [必須] REQ-3: EditTodoModal で既存タグを編集でき、保存時にタグ配列で onSave に渡される。 / 指標: EditTodoModal.tsx でタグ用 input の初期値が `todo.tags?.join(', ') ?? ''`、保存時に同様のパースで配列化し onSave に渡すこと。
- [必須] REQ-4: TodoItem でタグがバッジ/ラベルとして表示される。 / 指標: TodoItem.tsx で todo.tags を map し、Tailwind でバッジ風スタイルを当てた要素を描画していること。
- [必須] REQ-5: TypeScript ビルドが成功する（型エラーが出ない）。 / 指標: `npx next build` 相当が型エラー無しで完了すること（ローカル/CI）。

## Optional Test Items
- [任意] OPT-1: タグの重複入力をユニーク化する。 / 指標: Add/Edit モーダルのパース処理に重複排除（Set 等）が含まれる。
- [任意] OPT-2: 将来のタグ色分け/フィルタ拡張を想定した構造（独立した badge レンダリングや data-tag 属性など）。 / 指標: タグレンダリング部分が再利用しやすい形（mapで個別要素、固有 className または data 属性付き）になっていること。
- [任意] OPT-3: タグ入力欄に例示プレースホルダ `家事, 買い物, 優先` を入れる。 / 指標: Add/Edit モーダルのタグ input に該当 placeholder が指定されている。
- [任意] OPT-4: タグ入力欄に aria-label を付与しアクセシビリティを担保する。 / 指標: タグ input に aria-label が指定されている。

## Changed Files
- components/AddTodoModal.tsx
- components/EditTodoModal.tsx
- components/TodoItem.tsx
- pages/index.tsx
- types/todo.ts

## Unplanned Changed Files
- none

## Checks
- Generated diff exists: passed
- Generator self-check build: passed
- Target file coverage: passed
- Unplanned file changes: passed
- Dependency lockfile consistency: passed
- Evaluator final build: passed
