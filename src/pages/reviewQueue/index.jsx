import { useMemo, useState } from "react";
import { FiArrowLeft, FiArrowUpRight, FiCheck, FiClock, FiFileText, FiMessageSquare, FiSearch, FiShield, FiUserCheck } from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);

function ReviewQueuePage({ contracts, reviewContract, updateContract, notify }) {
  const [filter, setFilter] = useState("Needs attention");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const queue = useMemo(() => {
    const term = query.trim().toLowerCase();
    return contracts.filter((item) => {
      const visible = ["In review", "Needs changes"].includes(item.status);
      const statusMatches = filter === "Needs attention" ? visible : filter === "In review" ? item.status === filter : item.status === "Needs changes";
      return statusMatches && (!term || `${item.name} ${item.counterparty} ${item.owner} ${item.id}`.toLowerCase().includes(term));
    }).sort((a, b) => (a.status === "Needs changes" ? -1 : 1) - (b.status === "Needs changes" ? -1 : 1));
  }, [contracts, filter, query]);
  const selected = queue.find((item) => item.id === selectedId) || queue[0];

  const assignToMe = () => {
    updateContract(selected.id, { reviewer: "Olivia Chen" });
    notify(`You are now the review owner for ${selected.name}.`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div><span className={styles.eyebrow}>CONTRACT REVIEW ROOM</span><h1>Decisions, with context.</h1><p>Review the language, leave a useful record, and move the next step along.</p></div>
        <div className={styles.queueCount}><FiShield /><span><strong>{queue.length}</strong> open decisions</span></div>
      </div>
      <div className={styles.reviewWorkspace}>
        <aside className={styles.queuePanel}>
          <div className={styles.queueHeader}><div><span className={styles.sectionLabel}>YOUR QUEUE</span><h2>Waiting on a decision</h2></div><span className={styles.countBubble}>{queue.length}</span></div>
          <label className={styles.search}><FiSearch aria-hidden="true" /><span className={styles.srOnly}>Search review queue</span><input onChange={(event) => setQuery(event.target.value)} placeholder="Search this queue" type="search" value={query} /></label>
          <div aria-label="Filter review queue" className={styles.filters} role="tablist">
            {["Needs attention", "In review", "Needs changes"].map((item) => <button aria-selected={filter === item} className={filter === item ? styles.activeFilter : styles.filter} key={item} onClick={() => setFilter(item)} role="tab" type="button">{item}</button>)}
          </div>
          <div className={styles.queueList}>
            {queue.map((item, index) => <button aria-pressed={selected?.id === item.id} className={selected?.id === item.id ? styles.selectedCard : styles.queueCard} key={item.id} onClick={() => setSelectedId(item.id)} type="button">
              <div className={styles.cardTop}><span className={styles.docMark}><FiFileText /></span><span className={styles.status} data-status={item.status}>{item.status}</span></div>
              <strong>{item.name}</strong><span className={styles.counterparty}>{item.counterparty}</span>
              <div className={styles.cardFoot}><span className={styles.assignee}><i data-person={index}>{item.reviewer?.split(" ").map((part) => part[0]).join("") || "OC"}</i>{item.reviewer || "Unassigned"}</span><small>{item.updated}</small></div>
              {item.notes?.length > 0 && <div className={styles.notePreview}><FiMessageSquare />{item.notes[item.notes.length - 1]}</div>}
            </button>)}
            {!queue.length && <div className={styles.queueEmpty}><FiCheck /><strong>Queue is clear</strong><span>There are no contracts in this review filter.</span></div>}
          </div>
          <div className={styles.queueFoot}><span><i /> Updated as decisions are made</span><span>Workspace preview</span></div>
        </aside>

        <section aria-label="Selected contract review" className={styles.reviewDetail}>
          {selected ? <>
            <div className={styles.detailTop}><span><FiFileText /> REVIEW ITEM <i /> {selected.id}</span><Link to="/agreements">Full register <FiArrowUpRight /></Link></div>
            <div className={styles.detailHeading}><span className={styles.detailType}>{selected.type}</span><span className={styles.status} data-status={selected.status}>{selected.status}</span><h2>{selected.name}</h2><p>With <strong>{selected.counterparty}</strong> <i>·</i> {money(selected.value)} annual value</p></div>
            <div className={styles.reviewMeta}>
              <div><span>Agreement owner</span><strong>{selected.owner}</strong></div><div><span>Review assigned to</span><strong>{selected.reviewer || "Not assigned"}</strong></div><div><span>Last updated</span><strong>{selected.updated}</strong></div>
            </div>
            <div className={styles.documentPreview}>
              <div className={styles.documentBar}><span><FiFileText /> TERMS TO REVIEW</span><span>Version 03 <i /> {selected.id}</span></div>
              <div className={styles.documentBody}>
                <span className={styles.docKicker}>AGREEMENT SUMMARY</span>
                <h3>{selected.name}</h3>
                <p>This summary highlights the current terms recorded for <strong>{selected.counterparty}</strong>. Confirm that scope, ownership, and key dates reflect the intended commercial arrangement.</p>
                <div className={styles.clauseBlock}><span>KEY TERM TO WATCH</span><p>{selected.clause || "No key term has been added. Confirm the renewal and termination language before approval."}</p></div>
                <div className={styles.termGrid}><div><span>Effective date</span><strong>{selected.startDate || "To confirm"}</strong></div><div><span>End date</span><strong>{selected.endDate || "To confirm"}</strong></div><div><span>Notice date</span><strong>{selected.renewalDate || "To confirm"}</strong></div><div><span>Annual value</span><strong>{money(selected.value)}</strong></div></div>
                <div className={styles.signatureLine}><span>Prepared for review</span><i /></div>
              </div>
            </div>
            {selected.notes?.length > 0 && <div className={styles.comments}><span><FiMessageSquare /> EXISTING REVIEW NOTES</span>{selected.notes.map((note, index) => <p key={`${note}-${index}`}>{note}</p>)}</div>}
            <div className={styles.detailActions}><button className={styles.assignButton} onClick={assignToMe} type="button"><FiUserCheck /> Assign to me</button><div><button className={styles.changesButton} onClick={() => reviewContract(selected, "changes")} type="button">Request revisions</button><button className={styles.approveButton} onClick={() => reviewContract(selected, "approve")} type="button"><FiCheck /> Approve for signature</button></div></div>
          </> : <div className={styles.detailEmpty}><FiArrowLeft /><strong>Select a review item</strong><span>Choose an agreement from your queue to see its key terms and leave a decision.</span></div>}
        </section>
      </div>
    </div>
  );
}

export default ReviewQueuePage;
