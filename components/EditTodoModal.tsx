import { useState } from "react";
import type { Todo } from "@/types/todo";

type EditTodoModalProps = {
  todo: Todo;
  onSave: (title: string, details: string, deadline: string) => void;
  onClose: () => void;
};

export default function EditTodoModal({ todo, onSave, onClose }: EditTodoModalProps) {
  const [title, setTitle] = useState(todo.title);
  const [details, setDetails] = useState(todo.details);
  const [deadline, setDeadline] = useState(todo.deadline);

  const handleSave = () => {
    const trimmedTitle = title.trim();
    const trimmedDetails = details.trim();
    const trimmedDeadline = deadline.trim();
    if (!trimmedTitle || !trimmedDetails || !trimmedDeadline) return;

    onSave(trimmedTitle, trimmedDetails, trimmedDeadline);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full dark:bg-black dark:bg-opacity-60" role="dialog" aria-modal="true" aria-labelledby="edit-todo-modal-title">
      <div className="relative top-20 mx-auto p-5 border border-gray-200 dark:border-gray-700 w-11/12 max-w-md shadow-lg rounded-md bg-white dark:bg-gray-900">
        <h2 id="edit-todo-modal-title" className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">TODO を編集</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトルを編集..."
          className="w-full mb-2 p-2 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="詳細を編集..."
          className="w-full mb-2 p-2 border rounded text-gray-900 placeholder-gray-500"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full mb-2 p-2 border rounded text-gray-900 placeholder-gray-500"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
            保存
          </button>
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400">
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
