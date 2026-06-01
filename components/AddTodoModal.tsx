import { useState } from "react";

type AddTodoModalProps = {
  onAdd: (title: string, details: string, deadline: string) => void;
  onClose: () => void;
};

export default function AddTodoModal({ onAdd, onClose }: AddTodoModalProps) {
  const [errors, setErrors] = useState<{ title?: string; details?: string; deadline?: string }>({});
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleAdd = () => {
    const trimmedTitle = title.trim();
    const trimmedDetails = details.trim();
    const trimmedDeadline = deadline.trim();
    const nextErrors: { title?: string; details?: string; deadline?: string } = {};
    if (!trimmedTitle) nextErrors.title = "タイトルを入力してください";
    if (!trimmedDetails) nextErrors.details = "詳細を入力してください";
    if (!trimmedDeadline) nextErrors.deadline = "期限を入力してください";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onAdd(trimmedTitle, trimmedDetails, trimmedDeadline);
    setTitle("");
    setDetails("");
    setDeadline("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full dark:bg-black dark:bg-opacity-60" role="dialog" aria-modal="true" aria-labelledby="add-todo-modal-title">
      <div className="relative top-20 mx-auto p-5 border border-gray-200 dark:border-gray-700 w-11/12 max-w-md shadow-lg rounded-md bg-white dark:bg-gray-900">
        <h2 id="add-todo-modal-title" className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Add New TODO</h2>
        <label htmlFor="add-todo-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">タイトル</label>
        {errors.details && <p id="add-todo-details-error" role="alert" className="text-sm text-red-600 dark:text-red-400">{errors.details}</p>}
        <label htmlFor="add-todo-deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">期限</label>
        <input
          id="add-todo-deadline"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "add-todo-title-error" : undefined}
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setErrors((prev) => ({ ...prev, title: undefined }));
          }}
          placeholder="Enter title..."
          className="w-full mb-2 p-2 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        {errors.title && <p id="add-todo-title-error" role="alert" className="text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
        <label htmlFor="add-todo-details" className="block text-sm font-medium text-gray-700 dark:text-gray-300">詳細</label>
        <textarea
          id="add-todo-details"
          aria-invalid={!!errors.details}
          aria-describedby={errors.details ? "add-todo-details-error" : undefined}
          value={details}
          onChange={(e) => {
            setDetails(e.target.value);
            setErrors((prev) => ({ ...prev, details: undefined }));
          }}
          placeholder="Enter details..."
          className="w-full mb-2 p-2 border rounded text-gray-900 placeholder-gray-500"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => {
            setDeadline(e.target.value);
            setErrors((prev) => ({ ...prev, deadline: undefined }));
          }}
          className="w-full mb-2 p-2 border rounded text-gray-900 placeholder-gray-500"
        />
        {errors.deadline && <p id="add-todo-deadline-error" role="alert" className="text-sm text-red-600 dark:text-red-400">{errors.deadline}</p>}
        <div className="flex justify-end space-x-2">
          <button onClick={handleAdd} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
            追加
          </button>
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400">
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
