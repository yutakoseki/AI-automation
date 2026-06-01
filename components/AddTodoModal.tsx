import { useState } from "react";

type AddTodoModalProps = {
  onAdd: (title: string, details: string, deadline: string, tags: string[]) => void;
  onClose: () => void;
};

export default function AddTodoModal({ onAdd, onClose }: AddTodoModalProps) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [deadline, setDeadline] = useState("");

  const [tags, setTags] = useState("");

  const handleAdd = () => {
    const tagArray = Array.from(new Set(tags.split(',').map(tag => tag.trim()).filter(tag => tag)));
    const trimmedTitle = title.trim();
    const trimmedDetails = details.trim();
    const trimmedDeadline = deadline.trim();
    if (!trimmedTitle || !trimmedDetails || !trimmedDeadline) return;

    onAdd(trimmedTitle, trimmedDetails, trimmedDeadline, tagArray);
    setTitle("");
    setDetails("");
    setDeadline("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full dark:bg-black dark:bg-opacity-60" role="dialog" aria-modal="true" aria-labelledby="add-todo-modal-title">
      <div className="relative top-20 mx-auto p-5 border border-gray-200 dark:border-gray-700 w-11/12 max-w-md shadow-lg rounded-md bg-white dark:bg-gray-900">
        <h2 id="add-todo-modal-title" className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Add New TODO</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title..."
          className="w-full mb-2 p-2 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Enter details..."
          className="w-full mb-2 p-2 border rounded text-gray-900 placeholder-gray-500"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full mb-2 p-2 border rounded text-gray-900 placeholder-gray-500"
        />
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags (comma separated)</label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Enter tags..."
          className="w-full mb-2 p-2 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          aria-describedby="tags-help"
        />
        <p id="tags-help" className="text-xs text-gray-500 dark:text-gray-400">Separate tags with commas.</p>
        <button onClick={handleAdd} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
          追加
        </button>
        <button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400">
          キャンセル
        </button>
      </div>
    </div>
  );
}
