import { FormEvent, useState } from "react";
import Head from "next/head";
import TodoItem from "@/components/TodoItem";
import type { Todo } from "@/types/todo";
import styles from "@/styles/Home.module.css";

/** 簡易 ID 生成（テスト用。本番では uuid 等を推奨） */
function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * TODO リストのメインページ。
 * useState でリスト全体を管理し、追加・表示・完了・削除を行う。
 */
export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [deadline, setDeadline] = useState("");

  /** 新規 TODO を追加 */
  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedDetails = details.trim();
    const trimmedDeadline = deadline.trim();
    if (!trimmedTitle || !trimmedDetails || !trimmedDeadline) return;

    setTodos((prev) => [
      ...prev,
      { id: createId(), title: trimmedTitle, details: trimmedDetails, deadline: trimmedDeadline, completed: false },
    ]);
    setTitle("");
    setDetails("");
    setDeadline("");
  };

  /** 完了状態をトグル */
  const handleToggle = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  /** 指定 ID の TODO を編集 */
  const handleEdit = (id: string, newText: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };
  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const remainingCount = todos.filter((t) => !t.completed).length;

  return (
    <>
      <Head>
        <title>TODO App</title>
        <meta name="description" content="シンプルな TODO アプリ（テスト用）" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>TODO App</h1>
          <p className={styles.subtitle}>テスト・実験用の最小構成サンプル</p>

          {/* 追加フォーム */}
          <form onSubmit={handleAdd} className={styles.form}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タイトルを入力..."
              className={styles.input}
              aria-label="新しい TODO タイトル"
            />
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="詳細内容を入力..."
              className={styles.textarea}
              aria-label="新しい TODO 詳細"
            />
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={styles.input}
              aria-label="新しい TODO 期日"
            />
            <button type="submit" className={styles.addButton}>
              追加
            </button>
          </form>

          {/* 件数サマリー */}
          <p className={styles.summary}>
            未完了: {remainingCount} / 全 {todos.length} 件
          </p>

          {/* TODO 一覧 */}
          {todos.length === 0 ? (
            <p className={styles.empty}>TODO がありません。上から追加してください。</p>
          ) : (
            <ul className={styles.list}>
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
