import { useMemo, useState } from "react";
import { FiArrowUpRight, FiBell, FiCalendar, FiCheck, FiClock, FiRefreshCw, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
const dateLabel = (value) => new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
const daysUntil = (value) => Math.ceil((new Date(`${value}T00:00:00`).getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000);

function RenewalsPage({ contracts, updateContract, markNotRenewing, notify }) {
  const [windowDays, setWindowDays] = useState(180);
  const [query, setQuery] = useState("");
  const renewalContracts = useMemo(() => contracts.filter((item) => item.status !== "Archived" && item.renewalDate && daysUntil(item.renewalDate) >= -14 && daysUntil(item.renewalDate) <= windowDays).sort((a, b) => a.renewalDate.localeCompare(b.renewalDate)), [contracts, windowDays]);
  const filtered = renewalContracts.filter((item) => `${item.name} ${item.counterparty} ${item.owner}`.toLowerCase().includes(query.trim().toLowerCase()));
  const next30 = renewalContracts.filter((item) => daysUntil(item.renewalDate) >= 0 && daysUntil(item.renewalDate) <= 30);
  const inProgress = renewalContracts.filter((item) => item.renewalState === "Renewal in progress");
  const trackedValue = renewalContracts.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const monthGroups = filtered.reduce((groups, item) => {
    const key = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(`${item.renewalDate}T00:00:00`));
    groups.set(key, [...(groups.get(key) || []), item]);
    return groups;
  }, new Map());

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div><span className={styles.eyebrow}>OBLIGATION WATCH</span><h1>Give renewals room.</h1><p>Plan early enough to renegotiate, replace, or renew with confidence.</p></div>
        <div className={styles.periodControl}><FiCalendar /><label htmlFor="renewal-window">View horizon</label><select id="renewal-window" onChange={(event) => setWindowDays(Number(event.target.value))} value={windowDays}><option value="30">Next 30 days</option><option value="90">Next 90 days</option><option value="180">Next 6 months</option><option value="365">Next 12 months</option></select></div>
      </div>
      <section aria-label="Renewal summary" className={styles.summary}>
        <article><span className={styles.summaryIcon}><FiBell /></span><div><span>Notice dates in 30 days</span><strong>{next30.length}</strong></div><small>Prioritize the near-term window</small></article>
        <article><span className={styles.summaryIcon} data-tone="copper"><FiRefreshCw /></span><div><span>Renewals in motion</span><strong>{inProgress.length}</strong></div><small>Started by your workspace</small></article>
        <article><span className={styles.summaryIcon} data-tone="blue"><FiClock /></span><div><span>Dates in this horizon</span><strong>{renewalContracts.length}</strong></div><small>Across the selected period</small></article>
        <article><span className={styles.summaryIcon} data-tone="olive"><FiCalendar /></span><div><span>Value under notice</span><strong>{money(trackedValue)}</strong></div><small>Annual value associated with these records</small></article>
      </section>
      <section className={styles.noticeCard}>
        <div className={styles.noticeMark}><FiBell /></div>
        <div><span className={styles.sectionLabel}>NOTICE WINDOW</span><h2>Start the conversation before the deadline.</h2><p>Notice dates in this workspace are planning reminders. Confirm the final obligation against each signed agreement before acting.</p></div>
        <div className={styles.noticeScale}><span>EARLIER</span><div><i /><i /><i /><i /><i /></div><span>DEADLINE</span></div>
      </section>
      <div className={styles.timelineToolbar}>
        <div><span className={styles.sectionLabel}>RENEWAL TIMELINE</span><strong>{filtered.length} dates</strong></div>
        <label className={styles.search}><FiSearch /><span className={styles.srOnly}>Search renewals</span><input onChange={(event) => setQuery(event.target.value)} placeholder="Search agreement or company" type="search" value={query} /></label>
      </div>
      <section aria-label="Upcoming renewal dates" className={styles.monthList}>
        {[...monthGroups.entries()].map(([month, items]) => <div className={styles.monthGroup} key={month}>
          <div className={styles.monthLabel}><span>{month}</span><i /> <small>{items.length} {items.length === 1 ? "notice" : "notices"}</small></div>
          {items.map((item) => {
            const days = daysUntil(item.renewalDate);
            const state = item.renewalState || "Planning needed";
            return <article className={styles.renewalCard} key={item.id}>
              <div className={styles.dayTile}><strong>{new Date(`${item.renewalDate}T00:00:00`).getDate()}</strong><span>{new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(new Date(`${item.renewalDate}T00:00:00`))}</span></div>
              <div className={styles.cardMain}><div className={styles.cardTitle}><span className={styles.typeLabel}>{item.type}</span><span className={styles.state} data-state={state}>{state}</span></div><h3>{item.name}</h3><p>{item.counterparty} <i>·</i> {money(item.value)} annual value</p><div className={styles.cardMeta}><span><FiCalendar /> Notice by {dateLabel(item.renewalDate)}</span><span>Owner <strong>{item.owner}</strong></span><span>{days < 0 ? `${Math.abs(days)} days past notice` : days === 0 ? "Notice date is today" : `${days} days remaining`}</span></div></div>
              <div className={styles.cardActions}>{item.renewalState === "Not renewing" ? <span className={styles.closedState}><FiCheck /> Follow-up flagged</span> : item.renewalState === "Renewal in progress" ? <button className={styles.progressButton} onClick={() => notify(`Renewal planning remains open for ${item.name}.`)} type="button"><FiRefreshCw /> In progress</button> : <button className={styles.startButton} onClick={() => { updateContract(item.id, { renewalState: "Renewal in progress" }); notify(`Renewal planning started for ${item.name}.`); }} type="button"><FiRefreshCw /> Start renewal</button>}
                {item.renewalState !== "Not renewing" && <button className={styles.closeButton} onClick={() => markNotRenewing(item)} type="button">Not renewing</button>}
                <Link className={styles.recordLink} to="/agreements">Agreement record <FiArrowUpRight /></Link>
              </div>
            </article>;
          })}
        </div>)}
        {!filtered.length && <div className={styles.empty}><FiCalendar /><strong>No renewal dates in this view</strong><span>Change the horizon or add a notice date to an agreement.</span><Link to="/agreements">Open agreements <FiArrowUpRight /></Link></div>}
      </section>
    </div>
  );
}

export default RenewalsPage;
