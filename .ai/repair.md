# Repair request

The implementation generated from .ai/plan.md failed npm run build.
Fix only the build/type errors below. Do not add unrelated features or refactors.
Do not browse the web. Do not run shell commands. Only edit files.

## Build log
```

> ai-automation-todo@0.1.0 build
> next build

This information is used to shape Next.js' roadmap and prioritize features.
You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:

  ▲ Next.js 14.2.35

   Linting and checking validity of types ...
Failed to compile.

./components/TodoItem.tsx:5:9
Type error: Cannot find name 'Todo'.

[0m [90m 3 |[39m[0m
[0m [90m 4 |[39m type [33mTodoItemProps[39m [33m=[39m {[0m
[0m[31m[1m>[22m[39m[90m 5 |[39m   todo[33m:[39m [33mTodo[39m[33m;[39m[0m
[0m [90m   |[39m         [31m[1m^[22m[39m[0m
[0m [90m 6 |[39m   [90m/** 完了状態を切り替える */[39m[0m
[0m [90m 7 |[39m   onToggle[33m:[39m (id[33m:[39m string) [33m=>[39m [36mvoid[39m[33m;[39m[0m
[0m [90m 8 |[39m   [90m/** 削除する */[39m[0m
Next.js build worker exited with code: 1 and signal: null
```
