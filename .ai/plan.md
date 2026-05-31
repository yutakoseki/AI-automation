# 実装計画: TODO追加時のフィールド別バリデーションメッセージ表示

## Issue 概要
`components/AddTodoModal.tsx` の「追加」ボタン押下時、現状の `handleAdd` は未入力があると無言で `return` するだけで、ユーザーには何故追加されないか分からない。
Issueでは「タイトル」「詳細」「期限」のいずれかが未入力の場合に、項目ごとの日本語メッセージ（例: 「タイトルを入力してください」）を画面上に表示し、リトライ可能とすることが求められている。アクセシビリティと日本語表記への配慮も明記されている。

## 最小の安全なスライス
変更対象は `components/AddTodoModal.tsx` のみ。同等課題のある `EditTodoModal.tsx` は別Issueで対応すべく out_of_scope に置く。Props・コールバック・呼び出し元 (`pages/index.tsx`) には触れない。新規ファイル追加や共通化リファクタは行わない。

## 対象ファイル
- `components/AddTodoModal.tsx`

## 必要な変更
1. **エラー状態の追加**
   - `useState<{ title?: string; details?: string; deadline?: string }>({})` で項目別エラーを保持する。
2. **`handleAdd` のバリデーション化**
   - `trimmedTitle` 空 → `errors.title = "タイトルを入力してください"`
   - `trimmedDetails` 空 → `errors.details = "詳細を入力してください"`
   - `trimmedDeadline` 空 → `errors.deadline = "期限を入力してください"`
   - エラーが1件でもあれば `setErrors(errors)` して `return`（`onAdd` を呼ばない＝リトライ可能）。
   - 成功時は `setErrors({})` してから既存のフローを実行。
3. **エラー表示UI**
   - 各 `<input>` / `<textarea>` の直下に、エラーがある場合のみ `<p id="<field>-error" className="text-red-600 dark:text-red-400 text-sm mb-2">{message}</p>` を描画する。
4. **アクセシビリティ属性**
   - 各フォーム要素に `id` を付与（例: `id="todo-title"`）。
   - エラー時のみ `aria-invalid="true"` と `aria-describedby="<field>-error"` を付ける。
   - 各フォーム要素に対応する `<label htmlFor="…" className="sr-only">タイトル</label>` 等を追加し、スクリーンリーダーで項目名が伝わるようにする（既存 placeholder は英語のため）。
5. **エラーの自動クリア**
   - 各 `onChange` ハンドラで該当フィールドのエラーを削除する（`setErrors(prev => ({ ...prev, title: undefined }))` 等）。

## 受け入れ条件
- 全項目未入力で「追加」を押下したとき、3つすべてのエラーメッセージが対応フィールド直下に表示され、TODOは追加されない。
- 1〜2項目だけ未入力の場合、その項目だけのメッセージが表示される。
- 全項目入力後の「追加」では、エラーは消え、TODOが追加されモーダルが閉じる。
- 入力欄を変更するとそのフィールドのエラーが消える。
- メッセージは日本語、`aria-invalid` と `aria-describedby` がエラー時に正しく設定される。
- `onAdd` / `onClose` のシグネチャ、呼び出し元 (`pages/index.tsx`) は変更しない。
- `npm run build` が成功する。

## 実行コマンド
- `npm install`
- `npm run build`

## スコープ外（後続）
- `components/EditTodoModal.tsx` の編集フォームへの同等バリデーション（別Issue推奨）。
- 過去日チェック・文字数上限など空欄以外のバリデーション。
- `onBlur` 等によるリアルタイムバリデーション。
- バリデーションスキーマライブラリ (zod / yup 等) の導入。

## リスク
- リポジトリにテストが無く、回帰は手動確認に依存する。
- `<label>` を視覚表示するとレイアウトが変わるため、`sr-only` で視覚的影響を避ける必要がある。
- placeholderの英語表記は本Issueの範囲外だが、`<label>` 日本語化との二重表現になる可能性あり（コーディングエージェントは placeholder を変更せず label 追加に留めること）。

## Generator constraints
- 自律的に実装し、人間の確認を待たない。
- 計画外のファイル (`pages/`, `types/`, `tailwind.config.js`, `styles/globals.css`, `components/EditTodoModal.tsx`, `components/TodoItem.tsx` 等) は変更しない。
- 関係ない箇所のリファクタや大規模書き換えは行わない。
- バリデーションの仕様は本計画の3つのメッセージに限定する（空欄チェックのみ）。

## Generator constraints
- Implement the plan autonomously without asking for human clarification.
- If the plan is broad or uncertain, implement the smallest safe slice described by the plan.
- Do not perform unrelated refactors or large rewrites.
- Prefer a useful, reviewable pull request over attempting to solve every out-of-scope item.
- If a requested file is missing, create it only when the plan explicitly requires a new file; otherwise choose the closest existing file from the target list.
- Do not run npm install, npm run build, npm run dev, or other shell commands. The evaluator will run verification commands after editing.
