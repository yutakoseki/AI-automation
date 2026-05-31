import { useState } from "react";
import type { Todo } from "@/types/todo";

type TodoItemProps = {
  todo: Todo;
  /** 完了状態を切り替える */
  onToggle: (id: string) => void;
  /** 削除する */
  onDelete: (id: string) => void;
  /** 編集を保存する */
  onEdit: (id: string, title: string, details: string, deadline: string) => void;
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
    <li className={`flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow ${todo.completed ? 'opacity-50' : ''}`}>
      <label className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        <div className="flex flex-col">
          <strong className="text-lg font-semibold text-gray-900 dark:text-gray-100">{todo.title}</strong>
          <p className="text-sm text-gray-600 dark:text-gray-400">{todo.details}</p>
          <small className="text-xs text-gray-500 dark:text-gray-400">Deadline: {todo.deadline}</small>
        </div>
      </label>
      {isEditing ? (
        <div className="flex space-x-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="タイトルを編集..."
          />
          <textarea
            value={editDetails}
            onChange={(e) => setEditDetails(e.target.value)}
            className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="詳細を編集..."
          />
          <input
            type="date"
            value={editDeadline}
            onChange={(e) => setEditDeadline(e.target.value)}
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      ) : null}
      <div className="flex space-x-2">
        {isEditing ? (
          <button
            type="button"
            onClick={handleEditSave}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
            aria-label={`「${todo.title}」を保存`}
          >
            保存
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
            aria-label={`「${todo.title}」を編集`}
          >
            編集
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          aria-label={`「${todo.title}」を削除`}
        >
          削除
        </button>
      </div>
    </li>
  );
}
