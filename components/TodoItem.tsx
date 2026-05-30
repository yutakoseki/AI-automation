import type { Todo } from "@/types/todo";
import styles from "@/styles/TodoItem.module.css";

type TodoItemProps = {
  todo: Todo;
  /** 完了状態を切り替える */
  onToggle: (id: string) => void;
  /** 削除する */
  onDelete: (id: string) => void;
};

/**
 * 1件の TODO を表示し、完了・削除操作を提供するコンポーネント。
 * 親（pages/index.tsx）から状態とハンドラを受け取る presentational 構成。
 */
export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className={`${styles.item} ${todo.completed ? styles.completed : ""}`}>
      <label className={styles.label}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className={styles.checkbox}
        />
        <span className={styles.text}>{todo.text}</span>
      </label>
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        className={styles.deleteButton}
        aria-label={`「${todo.text}」を削除`}
      >
        削除
      </button>
    </li>
  );
}
