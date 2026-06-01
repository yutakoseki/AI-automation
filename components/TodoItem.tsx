import { useState } from "react";
import EditTodoModal from "@/components/EditTodoModal";
import { Todo } from "@/types/todo";

type TodoItemProps = {
  todo: Todo;
  /** 完了状態を切り替える */
  onToggle: (id: string) => void;
  /** 削除する */
  onDelete: (id: string) => void;
  /** 編集を保存する */
  onEdit: (id: string, title: string, details: string, deadline: string, tags: string[]) => void;
};

/**
 * 1件の TODO を表示し、完了・削除操作を提供するコンポーネント。
 * 親（pages/index.tsx）から状態とハンドラを受け取る presentational 構成。
 */
export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <div className="flex flex-wrap space-x-1 mt-2">
          {(todo.tags ?? []).map((tag, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full px-2 py-0.5 text-xs">
              {tag}
            </span>
          ))}
        </div>
      </label>
      {isModalOpen && (
        <EditTodoModal
          todo={todo}
          onSave={(title, details, deadline, tags) => {
            onEdit(todo.id, title, details, deadline, tags);
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
          aria-label={`「${todo.title}」を編集`}
        >
          編集
        </button>
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
