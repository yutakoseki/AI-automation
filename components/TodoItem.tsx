import { useState } from "react";
import type { Todo } from "@/types/todo";
import styles from "@/styles/TodoItem.module.css";

type TodoItemProps = {
  todo: Todo;
  /** 完了状態を切り替える */
  onToggle: (id: string) => void;
  /** 削除する */
  onDelete: (id: string) => void;
  /** 編集を保存する */
  onEdit: (id: string, newText: string) => void;
};

/**
 * 1件の TODO を表示し、完了・削除操作を提供するコンポーネント。
 * 親（pages/index.tsx）から状態とハンドラを受け取る presentational 構成。
 */
export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDetails, setEditDetails] = useState(todo.details);
  const [editDeadline, setEditDeadline] = useState(todo.deadline);

  const handleEditSave = () => {
    onEdit(todo.id, editTitle, editDetails, editDeadline);
    setIsEditing(false);
  };

  return (
    <li className={`${styles.item} ${todo.completed ? styles.completed : ""}`}>
      <label className={styles.label}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className={styles.checkbox}
        />
        <strong>{todo.title}</strong>
        <p>{todo.details}</p>
        <small>Deadline: {todo.deadline}</small>
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className={styles.editInput}
            placeholder="タイトルを編集..."
          />
          <textarea
            value={editDetails}
            onChange={(e) => setEditDetails(e.target.value)}
            className={styles.editTextarea}
            placeholder="詳細を編集..."
          />
          <input
            type="date"
            value={editDeadline}
            onChange={(e) => setEditDeadline(e.target.value)}
            className={styles.editInput}
          />
        ) : (
          <span className={styles.text}>{todo.text}</span>
        )}
      </label>
      {isEditing ? (
        <button
          type="button"
          onClick={handleEditSave}
          className={styles.saveButton}
          aria-label={`「${todo.text}」を保存`}
        >
          保存
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className={styles.editButton}
          aria-label={`「${todo.text}」を編集`}
        >
          編集
        </button>
      )}
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
