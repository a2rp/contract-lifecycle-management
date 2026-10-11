import { useEffect } from "react";
import { FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const Toast = ({ toast, version, onClose }) => {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(onClose, 3800);
    return () => window.clearTimeout(timer);
  }, [toast, version, onClose]);

  if (!toast) return null;
  return (
    <div aria-live={toast.type === "error" ? "assertive" : "polite"} className={styles.toast} data-tone={toast.type || "success"} role="status">
      {toast.type === "error" ? <FiAlertCircle aria-hidden="true" /> : <FiCheckCircle aria-hidden="true" />}
      <span>{toast.message}</span>
      <button aria-label="Dismiss notification" onClick={onClose} type="button"><FiX aria-hidden="true" /></button>
    </div>
  );
}

export default Toast;
