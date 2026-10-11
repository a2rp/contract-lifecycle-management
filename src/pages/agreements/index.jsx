import { useMemo, useState } from "react";
import { FiArchive, FiArrowDown, FiArrowUpRight, FiCheck, FiDownload, FiEdit2, FiFileText, FiPlus, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const statuses = ["All agreements", "In review", "Needs changes", "Awaiting signature", "Active", "Draft", "Archived"];
const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
const dateLabel = (value) => value ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`)) : "Not set";

const AgreementsPage = ({ contracts, createContract, editContract, deleteContract, archiveContract, updateContract, notify }) => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All agreements");
  const [sort, setSort] = useState("recent");
  const [selectedId, setSelectedId] = useState(contracts[0]?.id || "");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return contracts.filter((item) => (status === "All agreements" || item.status === status) && (!normalized || `${item.name} ${item.counterparty} ${item.id} ${item.owner} ${item.type}`.toLowerCase().includes(normalized))).sort((a, b) => {
      if (sort === "value") return Number(b.value) - Number(a.value);
      if (sort === "name") return a.name.localeCompare(b.name);
      return b.id.localeCompare(a.id);
    });
  }, [contracts, query, sort, status]);
  const selected = filtered.find((item) => item.id === selectedId) || filtered[0] || contracts.find((item) => item.id === selectedId);

  const exportCsv = () => {
    const rows = [["ID", "Agreement", "Counterparty", "Type", "Status", "Owner", "Annual value", "Effective date", "End date", "Renewal notice"], ...filtered.map((item) => [item.id, item.name, item.counterparty, item.type, item.status, item.owner, item.value, item.startDate, item.endDate, item.renewalDate])];
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "pactline-agreements.csv"; link.click(); URL.revokeObjectURL(url);
    notify(`${filtered.length} agreement${filtered.length === 1 ? "" : "s"} exported to CSV.`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div><span className={styles.eyebrow}>AGREEMENT REGISTER</span><h1>Agreements</h1><p>A working index for every term, owner, and next step.</p></div>
        <button className={styles.newButton} onClick={createContract} type="button"><FiPlus /> New agreement</button>
      </div>
      <div className={styles.filterTray}>
        <label className={styles.search}><FiSearch aria-hidden="true" /><span className={styles.srOnly}>Search agreements</span><input onChange={(event) => setQuery(event.target.value)} placeholder="Search name, company, owner..." type="search" value={query} />{query && <button aria-label="Clear search" onClick={() => setQuery("")} type="button"><FiX /></button>}</label>
        <label className={styles.sortLabel}><span>Sort</span><select onChange={(event) => setSort(event.target.value)} value={sort}><option value="recent">Recently updated</option><option value="name">Name A-Z</option><option value="value">Highest value</option></select></label>
        <button className={styles.exportButton} onClick={exportCsv} type="button"><FiDownload /> Export CSV</button>
      </div>
      <div aria-label="Filter agreements by status" className={styles.statusFilters} role="tablist">
        {statuses.map((item) => <button aria-selected={status === item} className={status === item ? styles.activeFilter : styles.filter} key={item} onClick={() => setStatus(item)} role="tab" type="button">{item}<span>{item === "All agreements" ? contracts.length : contracts.filter((contract) => contract.status === item).length}</span></button>)}
      </div>
      <section aria-label="Agreements and details" className={styles.registerLayout}>
        <div className={styles.tablePanel}>
          <div className={styles.tableHeading}><span>{filtered.length} {filtered.length === 1 ? "agreement" : "agreements"}</span><span>FY 2026 <FiArrowDown /></span></div>
          <div className={styles.tableScroll}>
            <table>
              <thead><tr><th>Agreement</th><th>Status</th><th>Owner</th><th>Renewal notice</th><th aria-label="Actions" /></tr></thead>
              <tbody>
                {filtered.map((item) => <tr className={selected?.id === item.id ? styles.selectedRow : ""} key={item.id} onClick={() => setSelectedId(item.id)}>
                  <td><button aria-label={`View ${item.name}`} className={styles.nameButton} onClick={() => setSelectedId(item.id)} type="button"><span className={styles.contractIcon}><FiFileText /></span><span><strong>{item.name}</strong><small>{item.counterparty} · {item.id}</small></span></button></td>
                  <td><span className={styles.status} data-status={item.status}>{item.status}</span></td>
                  <td><span className={styles.owner}><i>{item.owner.split(" ").map((part) => part[0]).join("")}</i>{item.owner}</span></td>
                  <td><span className={styles.renewalDate}>{dateLabel(item.renewalDate)}</span></td>
                  <td><div className={styles.rowActions}><button aria-label={`Edit ${item.name}`} onClick={(event) => { event.stopPropagation(); editContract(item); }} type="button"><FiEdit2 /></button><button aria-label={`Archive ${item.name}`} onClick={(event) => { event.stopPropagation(); archiveContract(item); }} type="button"><FiArchive /></button><button aria-label={`Remove ${item.name}`} onClick={(event) => { event.stopPropagation(); deleteContract(item); }} type="button"><FiTrash2 /></button></div></td>
                </tr>)}
              </tbody>
            </table>
            {!filtered.length && <div className={styles.empty}><FiSearch /><strong>No agreements match</strong><span>Try another keyword or clear the status filter.</span><button onClick={() => { setQuery(""); setStatus("All agreements"); }} type="button">Clear filters</button></div>}
          </div>
          <div className={styles.tableFoot}><span>Showing {filtered.length} of {contracts.length} agreements</span><button onClick={exportCsv} type="button"><FiDownload /> Download register</button></div>
        </div>

        <aside aria-label={selected ? `${selected.name} details` : "Agreement details"} className={styles.detailPanel}>
          {selected ? <>
            <div className={styles.detailTop}><span className={styles.detailOverline}>AGREEMENT RECORD <i /> {selected.id}</span><button aria-label="Clear selected agreement" className={styles.detailClose} onClick={() => setSelectedId("")} type="button"><FiX /></button></div>
            <div className={styles.detailTitle}><span className={styles.bigFile}><FiFileText /></span><div><span className={styles.status} data-status={selected.status}>{selected.status}</span><h2>{selected.name}</h2><p>{selected.counterparty}</p></div></div>
            <div className={styles.detailValue}><span>ANNUAL COMMITMENT</span><strong>{money(selected.value)}</strong><small>{selected.type}</small></div>
            <div className={styles.metadata}><div><span>Agreement owner</span><strong>{selected.owner}</strong></div><div><span>Effective date</span><strong>{dateLabel(selected.startDate)}</strong></div><div><span>Term ends</span><strong>{dateLabel(selected.endDate)}</strong></div><div><span>Notice due</span><strong>{dateLabel(selected.renewalDate)}</strong></div></div>
            {selected.clause && <div className={styles.clause}><span>KEY TERM TO WATCH</span><p>{selected.clause}</p></div>}
            <div className={styles.notes}><span>REVIEW NOTES <i>{selected.notes?.length || 0}</i></span>{selected.notes?.length ? selected.notes.map((note, index) => <p key={`${note}-${index}`}>{note}</p>) : <p>No reviewer notes on this record.</p>}</div>
            <div className={styles.detailActions}><button className={styles.editButton} onClick={() => editContract(selected)} type="button"><FiEdit2 /> Edit record</button>{selected.status === "Awaiting signature" ? <button className={styles.signButton} onClick={() => { updateContract(selected.id, { status: "Active" }); notify("Agreement marked active in this demo workspace."); }} type="button"><FiCheck /> Mark signed</button> : <Link className={styles.reviewLink} to="/reviews">Open review room <FiArrowUpRight /></Link>}</div>
          </> : <div className={styles.detailEmpty}><FiFileText /><strong>Select an agreement</strong><span>Choose a row to inspect its terms, dates, and review notes.</span></div>}
        </aside>
      </section>
    </div>
  );
}

export default AgreementsPage;
