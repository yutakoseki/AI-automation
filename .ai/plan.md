# Implementation Plan — タスク追加・編集モーダルのデザイン統一＆ダーク化

## Context

The app uses Tailwind with `darkMode: 'media'` (see `tailwind.config.js`).
`styles/globals.css` and `pages/index.tsx` already use `dark:` variants (e.g. `bg-white dark:bg-gray-900`, `text-gray-900 dark:text-gray-100`, `bg-gray-100 dark:bg-gray-800`).

The two modal components, however, are hardcoded to light styles only:

- `components/AddTodoModal.tsx`
- `components/EditTodoModal.tsx`

Both use:
- container: `bg-white` (no dark variant)
- heading: `text-gray-900` only
- inputs/textarea/date: `border rounded text-gray-900 placeholder-gray-500` (no dark bg/border)
- overlay: `bg-gray-600 bg-opacity-50` (acceptable, but can be tuned for dark)

This produces the bright/white modal background the issue describes, visually inconsistent with the surrounding dark UI.

## Goal

Make both modals visually consistent with the rest of the app in both light and dark color schemes (`prefers-color-scheme: dark`), without changing component APIs or behavior. Also apply small responsive & accessibility tweaks.

## Approach (smallest safe slice)

Update Tailwind classes in the two modal components to add `dark:` variants matching the gray-800/gray-900/gray-700/gray-100 tones already used in `pages/index.tsx`. Light-mode classes remain so non-dark users are unaffected.

### Concrete class changes (apply to BOTH AddTodoModal and EditTodoModal)

1. **Overlay**
   - From: `fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full`
   - To:   `fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-black dark:bg-opacity-60 overflow-y-auto h-full w-full`

2. **Modal panel (card)**
   - From: `relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white`
   - To:   `relative top-20 mx-auto p-5 border border-gray-200 dark:border-gray-700 w-full max-w-md mx-4 shadow-lg rounded-md bg-white dark:bg-gray-900`
   - Add attributes: `role="dialog"` and `aria-modal="true"`.

3. **Heading**
   - From: `text-lg font-bold mb-4 text-gray-900`
   - To:   `text-lg font-bold mb-4 text-gray-900 dark:text-gray-100`

4. **Inputs / textarea / date (all three)**
   - From: `w-full mb-2 p-2 border rounded text-gray-900 placeholder-gray-500`
   - To:   `w-full mb-2 p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`

5. **Buttons** — existing blue/gray buttons work in both modes; add focus ring for accessibility:
   - Append `focus:outline-none focus:ring-2 focus:ring-blue-400` to both primary and secondary buttons.

### What does NOT change

- Component props, exports, state, validation logic, button text, or the order of fields.
- `pages/index.tsx`, `TodoItem.tsx`, `tailwind.config.js`, `styles/globals.css`.

## Out of scope

- Extracting a shared `<Modal />` component.
- Focus trap / Esc-to-close / click-outside-to-close behavior.
- Switching `darkMode` from `media` to `class`, or adding a manual theme toggle.
- Restyling other components (`TodoItem`, `Home`, etc.).
- Automated visual / e2e tests.

## Risks

- `darkMode: 'media'` means reviewers without OS-level dark mode will not see the dark variant without toggling system theme. Mitigation: call this out in the PR description.
- Native `<input type="date">` calendar picker chrome is browser-controlled and may still appear light on some browsers; styling is best-effort.
- Tailwind purge already scans `components/**`, so newly added `dark:` classes are picked up automatically — no config change required.

## Verification

- `npm install`
- `npm run build` (Next.js build + type-check) must pass.
- Manual smoke: open Add and Edit modals under `prefers-color-scheme: dark`; backgrounds, borders, text, and placeholders should be dark and readable. Under light mode, behavior matches today.

## Generator constraints
- Implement the plan autonomously without asking for human clarification.
- If the plan is broad or uncertain, implement the smallest safe slice described by the plan.
- Do not perform unrelated refactors or large rewrites.
- Prefer a useful, reviewable pull request over attempting to solve every out-of-scope item.
- If a requested file is missing, create it only when the plan explicitly requires a new file; otherwise choose the closest existing file from the target list.
- Do not run npm install, npm run build, npm run dev, or other shell commands. The evaluator will run verification commands after editing.
