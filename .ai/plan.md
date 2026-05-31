# 実装計画: タスク編集画面のモーダル化と可読性改善

## Issue 概要
タスク編集が現状 `components/TodoItem.tsx` 内のインライン編集で実装されているが:
- フォーム入力に `text-*` が指定されておらず、白背景に白文字となり可読性がない
- `flex` 内に input/textarea/date を並べているためレイアウトが崩れる
- 追加 (`AddTodoModal`) はモーダル化済みなのに編集だけインライン

要件:
- 編集もモーダル化する (インライン編集を廃止)
- テキスト色・プレースホルダ色を背景とコントラストのあるものにする
- レイアウト崩れを直す
- ボタン/フォームを追加時 (`AddTodoModal`) と同等の UI 指針に揃える

## アプローチ
最小・安全な変更で `AddTodoModal` のパターンをそのまま編集にも適用する。

### 1. 新規ファイル `components/EditTodoModal.tsx` を作成
`AddTodoModal.tsx` を雛形に、初期値として既存 todo の `title`/`details`/`deadline` を受け取り編集可能にする。

- Props: `{ todo: Todo; onSave: (title: string, details: string, deadline: string) => void; onClose: () => void }`
- 入力フィールドは追加モーダルと同一スタイル (`text-gray-900 placeholder-gray-500`)
- 見出し: 「TODO を編集」
- ボタン: 「保存」(blue) / 「キャンセル」(gray)
- 日本語ラベル/プレースホルダ (タイトル/詳細/期限) を追加モーダルと統一
- オーバーレイ構造 (`fixed inset-0 bg-gray-600 bg-opacity-50 ...`) も AddTodoModal と同一

### 2. `components/TodoItem.tsx` をモーダル方式に変更
- インライン編集の input/textarea/date ブロック (44–66 行付近) を削除
- 「保存」ボタンの分岐を削除し、「編集」ボタンを常時表示
- 「編集」ボタン押下で `EditTodoModal` を開くよう state を管理
- 不要になった `editTitle` / `editDetails` / `editDeadline` のローカル state を削除 (モーダル側で保持)
- 削除ボタンの挙動・aria-label は現状維持

### 3. (変更なし) `pages/index.tsx`
`handleEdit(id, title, details, deadline)` のシグネチャは変えないので `pages/index.tsx` の変更は不要。

## 受け入れ条件
- 「編集」を押すと追加時と同じ見た目のモーダルが開く
- 既存の `title` / `details` / `deadline` がフォームに初期表示される
- 「保存」で値が反映され、モーダルが閉じる
- 「キャンセル」で変更を破棄してモーダルが閉じる
- フォームのテキストとプレースホルダが背景とコントラストある色で表示される
- TodoItem の行レイアウトが崩れない (チェックボックス + 内容 + 編集/削除ボタン)

## スコープ外
- 入力バリデーション強化やエラーメッセージ表示
- ESC キー / 外側クリックでのモーダル閉鎖
- `AddTodoModal` と `EditTodoModal` の共通化リファクタ
- ダークモード配色の全面的見直し

## リスク
- 既存テストが TodoItem のインライン編集 DOM 構造に依存していれば失敗する可能性 (現時点で `__tests__` は未確認)
- `AddTodoModal` は外側クリック非対応のため `EditTodoModal` も同様だが、後続で UX 指摘が来る可能性

## 生成側へのガイド
- 自律的に実装し、人間の確認を待たない
- 計画が広い場合は本ドキュメントの最小スライスを実装する
- 関係ない箇所のリファクタや大規模書き換えは行わない

## Generator constraints
- Implement the plan autonomously without asking for human clarification.
- If the plan is broad or uncertain, implement the smallest safe slice described by the plan.
- Do not perform unrelated refactors or large rewrites.
- Prefer a useful, reviewable pull request over attempting to solve every out-of-scope item.
- If a requested file is missing, create it only when the plan explicitly requires a new file; otherwise choose the closest existing file from the target list.
- Do not run npm install, npm run build, npm run dev, or other shell commands. The evaluator will run verification commands after editing.
