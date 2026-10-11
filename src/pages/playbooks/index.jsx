import { useMemo, useState } from "react";
import { FiArrowUpRight, FiBookOpen, FiCopy, FiEdit2, FiFileText, FiPlus, FiSearch, FiShield, FiTrash2, FiUsers } from "react-icons/fi";
import styles from "./styles.module.css";

const clauseExamples = {
  "TPL-01": ["Definition of confidential information", "Permitted use and disclosures", "Term, exclusions, and return of information"],
  "TPL-02": ["Statement of work and acceptance", "Fees, expenses, and delivery dates", "Work product, termination, and warranties"],
  "TPL-03": ["Processing purpose and instructions", "Security measures and incident notice", "Subprocessors and data return"],
  "TPL-04": ["Subscription scope and use rights", "Support commitments and service levels", "Renewal, suspension, and termination"],
};

function PlaybooksPage({ playbooks, createPlaybook, editPlaybook, deletePlaybook, createContract, notify }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All playbooks");
  const [expanded, setExpanded] = useState("");
  const categories = ["All playbooks", ...new Set(playbooks.map((item) => item.category))];
  const visible = useMemo(() => playbooks.filter((item) => (category === "All playbooks" || item.category === category) && `${item.name} ${item.category} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase())), [playbooks, category, query]);

  const usePlaybook = (item) => {
    const type = item.name.toLowerCase().includes("nda") ? "Mutual NDA" : item.name.toLowerCase().includes("data") ? "Data processing" : item.name.toLowerCase().includes("subscription") ? "Software subscription" : "Professional services";
    createContract({ name: item.name, type, clause: item.description });
    notify(`${item.name} details added to a new draft.`);
  };

  return (
    <div className={styles.page}>
      <section className={styles.intro}>
        <div><span className={styles.eyebrow}>CLAUSE LIBRARY</span><h1>Start with a stronger first draft.</h1><p>Team playbooks make common terms easier to reuse and review consistently.</p></div>
        <button className={styles.createButton} onClick={createPlaybook} type="button"><FiPlus /> New playbook</button>
      </section>
      <section className={styles.libraryBanner}>
        <div className={styles.bannerIcon}><FiBookOpen /></div><div><span className={styles.bannerLabel}>TEAM GUIDANCE</span><h2>Reusable starting points, built around your agreements.</h2><p>Templates here are working examples for this frontend workspace. Have counsel review any language before use.</p></div><div className={styles.bannerStats}><span><strong>{playbooks.length}</strong> playbooks</span><span><strong>{playbooks.reduce((sum, item) => sum + Number(item.clauses || 0), 0)}</strong> guided clauses</span></div>
      </section>
      <div className={styles.libraryToolbar}>
        <div className={styles.categoryTabs} aria-label="Filter playbooks by category" role="tablist">{categories.map((item) => <button aria-selected={category === item} className={category === item ? styles.activeTab : styles.tab} key={item} onClick={() => setCategory(item)} role="tab" type="button">{item}</button>)}</div>
        <label className={styles.search}><FiSearch /><span className={styles.srOnly}>Search playbooks</span><input onChange={(event) => setQuery(event.target.value)} placeholder="Find a playbook" type="search" value={query} /></label>
      </div>
      <section aria-label="Contract playbooks" className={styles.cards}>
        {visible.map((item, index) => <article className={styles.card} key={item.id}>
          <div className={styles.cardTop}><span className={styles.cardIcon} data-index={index}><FiFileText /></span><span className={styles.templateType}>{item.category}</span><div className={styles.cardTools}><button aria-label={`Edit ${item.name}`} onClick={() => editPlaybook(item)} type="button"><FiEdit2 /></button><button aria-label={`Remove ${item.name}`} onClick={() => deletePlaybook(item)} type="button"><FiTrash2 /></button></div></div>
          <div className={styles.cardTitle}><div><h2>{item.name}</h2><span>{item.id} <i /> Updated {item.updated}</span></div></div>
          <p className={styles.description}>{item.description}</p>
          <div className={styles.clauseCount}><FiShield /><strong>{item.clauses}</strong> guided clause sections <span>·</span><FiUsers /> Team standard</div>
          <div className={styles.cardActions}><button className={styles.useButton} onClick={() => usePlaybook(item)} type="button"><FiCopy /> Use playbook</button><button aria-expanded={expanded === item.id} className={styles.previewButton} onClick={() => setExpanded(expanded === item.id ? "" : item.id)} type="button">{expanded === item.id ? "Hide terms" : "Preview terms"}</button></div>
          {expanded === item.id && <div className={styles.preview}><span>STARTING CLAUSES</span><ul>{(clauseExamples[item.id] || ["Purpose and scope", "Responsibilities and notice", "Review checkpoints and exit terms"]).map((clause) => <li key={clause}>{clause}</li>)}</ul></div>}
        </article>)}
        {!visible.length && <div className={styles.empty}><FiBookOpen /><strong>No matching playbooks</strong><span>Change the category or search another term.</span><button onClick={() => { setCategory("All playbooks"); setQuery(""); }} type="button">Clear filters</button></div>}
      </section>
      <section className={styles.guidance}><FiShield /><p><strong>Keep the legal review close.</strong> These reusable clauses are demo content. They do not replace approved language, jurisdiction checks, or legal advice.</p><span>Preview workspace</span><button onClick={() => notify("Pactline keeps playbook edits in this session only.")} type="button">About playbook data <FiArrowUpRight /></button></section>
    </div>
  );
}

export default PlaybooksPage;
