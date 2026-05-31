# Implementation Plan: タスク追加モーダルのテキスト色・ボタン文言の修正

## Summary
The Add TODO modal (`components/AddTodoModal.tsx`) renders on a white background, but
inputs, placeholders, and the heading rely on inherited/default colors that can render
white-on-white. The fix adds explicit Tailwind text-color utilities so the heading,
input text, and placeholders are readable, and translates the two action buttons to
Japanese ("追加" / "キャンセル"). All changes are confined to a single component.

## Target file
- `components/AddTodoModal.tsx` — the only file containing the modal markup.

## Required changes
1. **Heading color** — `<h2>` (line 29): keep `text-lg font-bold mb-4` and add
   `text-gray-900` so the title remains readable against the white modal background.
2. **Form control text + placeholder color** — for each of the three controls (title
   `<input type="text">` at line 30, details `<textarea>` at line 37, deadline
   `<input type="date">` at line 43): keep `w-full mb-2 p-2 border rounded` and add
   `text-gray-900 placeholder-gray-500` so typed text is dark and placeholders are
   visible gray, not white.
3. **Button labels** — change visible text of the first button (line 50–52) from `Add`
   to `追加` and the second button (line 53–55) from `Close` to `キャンセル`. Do not
   touch onClick handlers, className values, or layout.

## Out of scope
- Translating the modal heading "Add New TODO" (issue does not request this).
- Refactoring validation, layout, accessibility, or modal a11y attributes.
- Edits to `styles/globals.css`, `tailwind.config.js`, or any other component/page.

## Verification
- `npm install && npm run build` succeeds.
- Manual: open the Add TODO modal, type into each field, and confirm:
  - The heading and typed text are dark/readable on white.
  - Placeholders are visible gray.
  - The action buttons read `追加` and `キャンセル` and still work.

## Risks
- Low. Pure className/text changes in one file; no logic, types, or props change.

## Generator constraints
- Implement the plan autonomously without asking for human clarification.
- If the plan is broad or uncertain, implement the smallest safe slice described by the plan.
- Do not perform unrelated refactors or large rewrites.
- Prefer a useful, reviewable pull request over attempting to solve every out-of-scope item.
- If a requested file is missing, create it only when the plan explicitly requires a new file; otherwise choose the closest existing file from the target list.
