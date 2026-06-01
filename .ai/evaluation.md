# AI Evaluation

## Verdict Inputs
- Evaluation round: 1
- Plan summary: types/todo.ts に tags フィールドを追加し、AddTodoModal/EditTodoModal にカンマ区切りタグ入力欄を実装。pages/index.tsx のハンドラを tags 対応に拡張し、TodoItem でバッジ表示する。共通の parseTags ユーティリティを lib/parseTags.ts として新設する。
- Planner confidence: high
- Final changed files: 5
- Final changed target files: 5
- Final unplanned changed files: 0
- Generator automatic repair attempts: 3
- Evaluator requested fixes: 0

## Required Test Items
- [必須] REQ-1: types/todo.ts の Todo 型に tags: string[] フィールドが追加されている。 / 指標: Todo 型の定義内に tags: string[] が存在し、tsc がエラーを出さない。
- [必須] REQ-2: AddTodoModal にタグ入力欄（カンマ区切り）が追加され、onAdd 呼び出し時にパースされた string[] が第 4 引数として渡る。 / 指標: AddTodoModal.tsx に tags 用 <input> が追加され、onAdd のシグネチャが (title, details, deadline, tags: string[]) になっている。
- [必須] REQ-3: EditTodoModal にタグ入力欄があり、todo.tags が初期値として表示され、編集後の値が onSave に第 4 引数として渡る。 / 指標: EditTodoModal.tsx に tags 用 <input> があり、初期値は (todo.tags ?? []).join(', ')。onSave のシグネチャは (title, details, deadline, tags: string[])。
- [必須] REQ-4: pages/index.tsx の handleAdd / handleEdit が tags を受け取り、Todo の tags フィールドに保存する。 / 指標: handleAdd / handleEdit のシグネチャが拡張され、新規・更新時に tags が状態に反映される。
- [必須] REQ-5: TodoItem で todo.tags がバッジ／ラベル状の UI として表示される。タグが 0 個の場合は何も表示しない。 / 指標: TodoItem.tsx に tags.map(...) によるバッジ描画があり、(todo.tags ?? []).length === 0 の場合はバッジ領域がレンダリングされない。
- [必須] REQ-6: parseTags ユーティリティ（lib/parseTags.ts）がカンマ区切り文字列を string[] に変換し、空白除去・空要素除外・重複除外を行う。 / 指標: lib/parseTags.ts に parseTags(input: string): string[] が存在し、'foo, bar, ,foo' → ['foo', 'bar'] を返す実装になっている。
- [必須] REQ-7: npm run build が成功する（型エラーなし）。 / 指標: npm run build が exit code 0 で終了する。

## Optional Test Items
- [任意] OPT-1: ダークモード（dark: クラス）でもタグバッジが視認可能な配色になっている。 / 指標: バッジに dark:bg-* / dark:text-* クラスが付与されており、暗背景上でも読める。
- [任意] OPT-2: parseTags が全角カンマ（、）も区切り文字として処理する。 / 指標: 'foo、bar' → ['foo', 'bar'] を返す。
- [任意] OPT-3: タグ表示コンテナにアクセシビリティ属性（aria-label など）が付与されている。 / 指標: TodoItem.tsx のタグコンテナに aria-label="タグ" または同等の属性が付いている。

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
