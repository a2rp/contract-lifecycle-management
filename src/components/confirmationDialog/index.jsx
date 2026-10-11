import { useEffect } from "react";
import { FiAlertTriangle, FiArchive, FiTrash2, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

function ConfirmationDialog({ dialog, onCancel, onConfirm }) {
  const contract = dialog.contract;
  const playbook = dialog.playbook;
  const config = {
    "delete-contract": { title: "Remove this agreement?", body: `“${contract?.name}” will be removed from this workspace. Related notes and review tasks are removed with it.`, action: "Remove agreement", icon: <FiTrash2 /> },
    "archive-contract": { title: "Archive this agreement?", body: `“${contract?.name}” will move to Archived. You can still find it with the status filter.`, action: "Archive agreement", icon: <FiArchive /> },
    "delete-playbook": { title: "Remove this playbook?", body: `“${playbook?.name}” will be removed from the team playbook list. Existing agreements will not be changed.`, action: "Remove playbook", icon: <FiTrash2 /> },
    "not-renewing": { title: "Mark as not renewing?", body: `The renewal reminder for “${contract?.name}” will be marked for closure so your team can follow up before its end date.`, action: "Mark not renewing", icon: <FiAlertTriangle /> },
  }[dialog.kind];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => { if (event.key === "Escape") onCancel(); };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); };
  }, [onCancel]);

  return (
    <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <section aria-labelledby="confirm-title" aria-modal="true" className={styles.dialog} role="alertdialog">
        <button aria-label="Close dialog" className={styles.close} onClick={onCancel} type="button"><FiX /></button>
        <div className={styles.icon} data-danger={dialog.kind.includes("delete")}>
          {config.icon}
        </div>
        <span className={styles.eyebrow}>PLEASE CONFIRM</span>
        <h2 id="confirm-title">{config.title}</h2>
        <p>{config.body}</p>
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel} type="button">Keep it</button>
          <button className={styles.confirm} data-danger={dialog.kind.includes("delete")} onClick={onConfirm} type="button">{config.action}</button>
        </div>
      </section>
    </div>
  );
}

export default ConfirmationDialog;
