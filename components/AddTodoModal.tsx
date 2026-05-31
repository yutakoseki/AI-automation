import { useState } from "react";

type AddTodoModalProps = {
  onAdd: (title: string, details: string, deadline: string) => void;
  onClose: () => void;
};

export default function AddTodoModal({ onAdd, onClose }: AddTodoModalProps) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleAdd = () => {
    const trimmedTitle = title.trim();
    const trimmedDetails = details.trim();
    const trimmedDeadline = deadline.trim();
    if (!trimmedTitle || !trimmedDetails || !trimmedDeadline) return;

    onAdd(trimmedTitle, trimmedDetails, trimmedDeadline);
    setTitle("");
    setDetails("");
    setDeadline("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h2 className="text-lg font-bold mb-4 text-gray-900">Add New TODO</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title..."
          className="w-full mb-2 p-2 border rounded text-gray-900 placeholder-gray-500"
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
        <div className="flex justify-end space-x-2">
          <button onClick={handleAdd} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
            追加
          </button>
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded">
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
