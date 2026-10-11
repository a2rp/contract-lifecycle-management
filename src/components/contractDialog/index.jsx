import { useEffect, useRef, useState } from "react";
import { FiFilePlus, FiUploadCloud, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const blankContract = {
  name: "", counterparty: "", type: "Software subscription", owner: "Olivia Chen",
  value: "", startDate: "2026-10-15", endDate: "2027-10-14", renewalDate: "2027-08-15",
  clause: "", documentName: "",
};

function ContractDialog({ mode, contract, playbook, formType = "contract", onClose, onSave }) {
  const source = formType === "playbook" ? playbook : contract;
  const [values, setValues] = useState({ ...blankContract, ...(source || {}) });
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState(source?.documentName || "");
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => dialogRef.current?.querySelector("button, input:not([type='file']), select, textarea")?.focus());
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const controls = [...dialogRef.current.querySelectorAll("button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]")].filter((element) => element.getClientRects().length);
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [onClose]);

  const set = (key, value) => setValues((current) => ({ ...current, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    if (formType === "review") {
      const note = values.note?.trim() || "";
      if (mode === "changes" && note.length < 8) { setError("Add a clear note so the owner knows what to revise."); return; }
      onSave({ note });
      return;
    }
    if (formType === "playbook") {
      if (!values.name?.trim() || !values.category?.trim() || !values.description?.trim()) { setError("Complete each field before saving this playbook."); return; }
      onSave({ name: values.name.trim(), category: values.category.trim(), description: values.description.trim() });
      return;
    }
    if (!values.name?.trim() || !values.counterparty?.trim()) { setError("Add an agreement name and counterparty."); return; }
    if (!values.startDate || !values.endDate || new Date(values.endDate) <= new Date(values.startDate)) { setError("The end date must come after the start date."); return; }
    if (values.renewalDate && values.endDate && new Date(values.renewalDate) > new Date(values.endDate)) { setError("Set the renewal notice date on or before the agreement end date."); return; }
    const amount = Number(values.value);
    if (!Number.isFinite(amount) || amount < 0) { setError("Enter a valid annual value of zero or more."); return; }
    onSave({ ...values, name: values.name.trim(), counterparty: values.counterparty.trim(), owner: values.owner.trim(), value: amount, documentName: fileName });
  };

  const title = formType === "review"
    ? mode === "approve" ? "Approve this review" : "Request revisions"
    : formType === "playbook"
      ? mode === "edit-playbook" ? "Edit playbook" : "New playbook"
      : mode === "edit" ? "Edit agreement" : "Create agreement";
  const intro = formType === "review"
    ? "Add a note for the agreement record before saving your decision."
    : formType === "playbook"
      ? "Give this clause set a clear name your team can find again."
      : "Set the key dates and ownership so the next step is clear.";

  return (
    <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section aria-labelledby="contract-dialog-title" aria-modal="true" className={styles.dialog} ref={dialogRef} role="dialog">
        <header className={styles.dialogHeader}>
          <div className={styles.dialogIcon}><FiFilePlus aria-hidden="true" /></div>
          <div><span className={styles.eyebrow}>{formType === "review" ? "REVIEW DECISION" : formType === "playbook" ? "CLAUSE LIBRARY" : "AGREEMENT DETAILS"}</span><h2 id="contract-dialog-title">{title}</h2><p>{intro}</p></div>
          <button aria-label="Close dialog" className={styles.closeButton} onClick={onClose} type="button"><FiX /></button>
        </header>
        <form className={styles.form} onSubmit={submit}>
          {formType === "review" ? (
            <label className={styles.fullField}>Reviewer note <textarea autoComplete="off" maxLength={500} onChange={(event) => set("note", event.target.value)} placeholder={mode === "approve" ? "Optional note for the contract record" : "Describe the clause or detail that needs revision"} rows="5" value={values.note || ""} /></label>
          ) : formType === "playbook" ? (
            <>
              <label className={styles.fullField}>Playbook name <input maxLength={70} onChange={(event) => set("name", event.target.value)} placeholder="e.g. Partner services agreement" value={values.name || ""} /></label>
              <label className={styles.fullField}>Category <input maxLength={50} onChange={(event) => set("category", event.target.value)} placeholder="e.g. Commercial" value={values.category || ""} /></label>
              <label className={styles.fullField}>Purpose and coverage <textarea maxLength={280} onChange={(event) => set("description", event.target.value)} placeholder="What agreement should this playbook guide?" rows="4" value={values.description || ""} /></label>
            </>
          ) : (
            <>
              <div className={styles.fullField}><label htmlFor="contract-name">Agreement name</label><input id="contract-name" autoComplete="off" maxLength={90} onChange={(event) => set("name", event.target.value)} placeholder="e.g. Annual software subscription" value={values.name || ""} /></div>
              <div className={styles.field}><label htmlFor="contract-counterparty">Counterparty</label><input id="contract-counterparty" autoComplete="organization" maxLength={80} onChange={(event) => set("counterparty", event.target.value)} placeholder="Company or person" value={values.counterparty || ""} /></div>
              <div className={styles.field}><label htmlFor="contract-type">Agreement type</label><select id="contract-type" onChange={(event) => set("type", event.target.value)} value={values.type || "Software subscription"}><option>Software subscription</option><option>Professional services</option><option>Service agreement</option><option>Mutual NDA</option><option>Data processing</option><option>Lease</option><option>License</option><option>Other</option></select></div>
              <div className={styles.field}><label htmlFor="contract-owner">Internal owner</label><select id="contract-owner" onChange={(event) => set("owner", event.target.value)} value={values.owner || "Olivia Chen"}><option>Olivia Chen</option><option>Marcus Lee</option><option>Avery Brooks</option><option>Sam Rivera</option></select></div>
              <div className={styles.field}><label htmlFor="contract-value">Annual value (USD)</label><input id="contract-value" min="0" onChange={(event) => set("value", event.target.value)} placeholder="0" step="100" type="number" value={values.value ?? ""} /></div>
              <div className={styles.field}><label htmlFor="contract-start">Effective date</label><input id="contract-start" onChange={(event) => set("startDate", event.target.value)} type="date" value={values.startDate || ""} /></div>
              <div className={styles.field}><label htmlFor="contract-end">End date</label><input id="contract-end" onChange={(event) => set("endDate", event.target.value)} type="date" value={values.endDate || ""} /></div>
              <div className={styles.field}><label htmlFor="contract-renewal">Renewal notice date</label><input id="contract-renewal" onChange={(event) => set("renewalDate", event.target.value)} type="date" value={values.renewalDate || ""} /></div>
              <label className={styles.fullField}>Key clause or reminder <textarea maxLength={300} onChange={(event) => set("clause", event.target.value)} placeholder="Add a useful obligation or renewal note" rows="3" value={values.clause || ""} /></label>
              <div className={styles.fullField}>
                <label className={styles.uploadLabel} htmlFor="agreement-file"><FiUploadCloud aria-hidden="true" /> Attach a reference file <span>PDF or DOCX</span></label>
                <input accept=".pdf,.doc,.docx,application/pdf" className={styles.fileInput} id="agreement-file" onChange={(event) => setFileName(event.target.files?.[0]?.name || "")} type="file" />
                <small>{fileName ? `${fileName} selected. Only the filename stays in this frontend preview.` : "Demo only: this preview records the filename, not an upload."}</small>
              </div>
            </>
          )}
          {error && <p className={styles.error} role="alert">{error}</p>}
          <div className={styles.actions}>
            <button className={styles.cancelButton} onClick={onClose} type="button">Cancel</button>
            <button className={styles.saveButton} type="submit">{formType === "review" ? mode === "approve" ? "Approve review" : "Request changes" : formType === "playbook" ? "Save playbook" : mode === "edit" ? "Save changes" : "Create draft"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ContractDialog;
