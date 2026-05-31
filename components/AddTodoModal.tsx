import { useState } from "react";
import styles from "@/styles/TodoItem.module.css";

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
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Add New TODO</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title..."
          className={styles.input}
        />
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Enter details..."
          className={styles.textarea}
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleAdd} className={styles.addButton}>
          Add
        </button>
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
}
