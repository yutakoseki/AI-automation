import { useState } from "react";

type AddTodoModalProps = {
  onAdd: (title: string, details: string, deadline: string) => void;
  onClose: () => void;
};

export default function AddTodoModal({ onAdd, onClose }: AddTodoModalProps) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [deadline, setDeadline] = useState("");

  const [errors, setErrors] = useState<{ title?: string; details?: string; deadline?: string }>({});

  const handleAdd = () => {
    const trimmedTitle = title.trim();
    const trimmedDetails = details.trim();
    const trimmedDeadline = deadline.trim();
    const newErrors: { title?: string; details?: string; deadline?: string } = {};

    if (!trimmedTitle) newErrors.title = "タイトルを入力してください";
    if (!trimmedDetails) newErrors.details = "詳細を入力してください";
    if (!trimmedDeadline) newErrors.deadline = "期限を入力してください";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
        <label htmlFor="todo-title" className="sr-only">タイトル</label>
        {errors.details && <p id="details-error" className="text-red-600 dark:text-red-400 text-sm mb-2">{errors.details}</p>}

        <label htmlFor="todo-deadline" className="sr-only">期限</label>
        <input
          id="todo-title"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setErrors(prev => ({ ...prev, title: undefined }));
          }}
          placeholder="Enter title..."
          className="w-full mb-2 p-2 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        {errors.title && <p id="title-error" className="text-red-600 dark:text-red-400 text-sm mb-2">{errors.title}</p>}

        <label htmlFor="todo-details" className="sr-only">詳細</label>
        <textarea
          id="todo-details"
          aria-invalid={!!errors.details}
          aria-describedby={errors.details ? "details-error" : undefined}
          value={details}
          onChange={(e) => {
            setDetails(e.target.value);
            setErrors(prev => ({ ...prev, details: undefined }));
          }}
          placeholder="Enter details..."
          className="w-full mb-2 p-2 border rounded text-gray-900 placeholder-gray-500"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => {
            setDeadline(e.target.value);
            setErrors(prev => ({ ...prev, deadline: undefined }));
          }}
          className="w-full mb-2 p-2 border rounded text-gray-900 placeholder-gray-500"
        />
        {errors.deadline && <p id="deadline-error" className="text-red-600 dark:text-red-400 text-sm mb-2">{errors.deadline}</p>}

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
