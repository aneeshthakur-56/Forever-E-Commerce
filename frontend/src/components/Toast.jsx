import { useEffect, useState } from "react";
import "./Toast.css";

let addToast;

export const toast = {
  success: (message) => addToast?.({ type: "success", message }),
  error:   (message) => addToast?.({ type: "error",   message }),
  warning: (message) => addToast?.({ type: "warning", message }),
  info:    (message) => addToast?.({ type: "info",    message }),
};

const ToastItem = ({ id, type, message, onRemove }) => {
  useEffect(() => {
    const t = setTimeout(() => onRemove(id), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`toast toast-${type}`}>
      <p className="toast-msg">{message}</p>
      <button className="toast-close" onClick={() => onRemove(id)}>✕</button>
      <div className="toast-progress" />
    </div>
  );
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  addToast = (t) => setToasts((p) => [...p, { ...t, id: Date.now() }]);
  const remove = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  return (
    <div className="toast-container">
      {toasts.map((t) => <ToastItem key={t.id} {...t} onRemove={remove} />)}
    </div>
  );
};