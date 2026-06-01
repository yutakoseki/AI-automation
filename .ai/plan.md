# 実装計画: TODO追加時のバリデーション/アラート表示

## Issue 概要
`components/AddTodoModal.tsx` の `handleAdd` は、いずれかの入力 (title / details / deadline) が空のとき何のフィードバックも出さず黙って `return` している。ユーザーは「追加」を押しても何も起きないように見え、何が未入力なのかも分からない。各項目ごとに日本語のバリデーションメッセージを画面上に表示し、エラー時は追加処理を行わずにリトライ可能とする。

## 最小の安全なスライス
- `components/AddTodoModal.tsx` のみを変更する。
- フィールドエラー state を持ち、`handleAdd` 内でフィールド単位の検証を行い、エラーがあれば `onAdd` を呼ばずモーダルも閉じない。
- 各入力の直下に `role="alert"` 付きの日本語エラーメッセージを描画。
- 入力 (`onChange`) で該当フィールドのエラーをクリア。
- アクセシビリティ属性 (`aria-invalid`, `aria-describedby`) を追加し、各 input には対応する `<label htmlFor>` を関連付ける。
- 既存の Tailwind スタイルとダーク配色はそのまま踏襲する。

## 対象ファイル
- `components/AddTodoModal.tsx`

## 必要な変更 (components/AddTodoModal.tsx)

1. **state 追加**
   - `const [errors, setErrors] = useState<{ title?: string; details?: string; deadline?: string }>({})`

2. **`handleAdd` の改修**
   - 既存の `if (!trimmedTitle || !trimmedDetails || !trimmedDeadline) return;` を削除。
   - 各フィールドを個別に検査し、未入力なら以下の文言を `nextErrors` に格納:
     - `title`: 「タイトルを入力してください」
     - `details`: 「詳細を入力してください」
     - `deadline`: 「期限を入力してください」
   - `Object.keys(nextErrors).length > 0` の場合は `setErrors(nextErrors)` してリターン。
   - 成功時は `setErrors({})` してから `onAdd(...)` / state クリア / `onClose()`。

3. **各入力に `<label>`、エラー描画を追加**
   - title: `<label htmlFor="add-todo-title">タイトル</label>`、`<input id="add-todo-title" aria-invalid={!!errors.title} aria-describedby={errors.title ? "add-todo-title-error" : undefined} />`、エラーは `<p id="add-todo-title-error" role="alert" className="text-sm text-red-600 dark:text-red-400">{errors.title}</p>` を `errors.title` がある時のみ表示。
   - details / deadline も同様の id 規約 (`add-todo-details`, `add-todo-deadline`) で同パターンを適用。

4. **`onChange` でエラー解除**
   - 各 input の `onChange` で値設定後、`setErrors((prev) => ({ ...prev, <field>: undefined }))` を呼ぶ。

5. **既存スタイル**
   - 現状の Tailwind クラスとダーク対応はそのまま維持。エラー時のリングや枠線色は追加しない (スコープを限定)。

## 受け入れ条件
- 3項目すべて空で「追加」を押すと、各入力の下に対応する日本語メッセージが表示される。
- 1項目だけ空のときは、その項目のメッセージだけが表示される。
- エラー表示中は `onAdd` が呼ばれず、モーダルが閉じない。
- いずれかの入力に値を入れると、そのフィールドのエラーが消える。
- `role="alert"` のメッセージにスクリーンリーダーがアクセスできる (`aria-describedby` で紐付け済み)。
- 既存 props (`onAdd`, `onClose`) のシグネチャは変更されていない。
- `npm run build` が成功する。

## 実行コマンド
- `npm run build`

## リスク
- `placeholder` のダーク対応など既存スタイルの抜けがあるが、本Issueの主目的ではないため変更しない (スコープ外)。
- `aria-describedby` の id は他のモーダルと衝突しないよう `add-todo-*` プレフィックスを用いる。

## スコープ外
- `components/EditTodoModal.tsx` への同様のバリデーション (別Issue推奨)。
- 文字数上限・過去日付禁止などの高度なバリデーション。
- AlertダイアログUIの新規導入 (インラインエラーで要件は満たす)。
- i18n フレームワーク導入。
- 共通 Form/Field コンポーネントへの抽出。

## Generator constraints
- 自律的に実装し、人間の確認を待たない。
- 計画外のファイルは変更しない。
- 関係ない箇所のリファクタや大規模書き換えは行わない。

## Generator constraints
- Implement the plan autonomously without asking for human clarification.
- If the plan is broad or uncertain, implement the smallest safe slice described by the plan.
- Do not perform unrelated refactors or large rewrites.
- Prefer a useful, reviewable pull request over attempting to solve every out-of-scope item.
- If a requested file is missing, create it only when the plan explicitly requires a new file; otherwise choose the closest existing file from the target list.
- Do not run npm install, npm run build, npm run dev, or other shell commands. The evaluator will run verification commands after editing.
