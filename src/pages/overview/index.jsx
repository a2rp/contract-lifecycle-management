import { Link } from "react-router-dom";
import { FiArrowDownRight, FiArrowUpRight, FiClock, FiFileText, FiPlus, FiShield, FiUsers } from "react-icons/fi";
import styles from "./styles.module.css";

const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
const dateLabel = (value) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00`));
const daysUntil = (value) => Math.ceil((new Date(`${value}T00:00:00`).getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000);

const OverviewPage = ({ contracts, createContract }) => {
  const today = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date()).toUpperCase();
  const active = contracts.filter((item) => item.status !== "Archived");
  const inReview = active.filter((item) => ["In review", "Needs changes"].includes(item.status));
  const renewalWindow = active.filter((item) => item.renewalDate && daysUntil(item.renewalDate) >= 0 && daysUntil(item.renewalDate) <= 90).sort((a, b) => a.renewalDate.localeCompare(b.renewalDate));
  const activeValue = active.filter((item) => item.status === "Active").reduce((sum, item) => sum + Number(item.value || 0), 0);
  const recent = [...active].sort((a, b) => (a.updated === "Today" ? -1 : b.updated === "Today" ? 1 : a.updated.localeCompare(b.updated))).slice(0, 4);

  return (
    <div className={styles.page}>
      <section className={styles.welcome}>
        <div>
          <span className={styles.overline}>{today} <span>·</span> NORTHSTAR STUDIO</span>
          <h1>Keep every agreement<br /><em>moving forward.</em></h1>
          <p>A clear view of decisions, obligations, and the dates that deserve your attention.</p>
          <div className={styles.welcomeActions}>
            <button className={styles.primaryButton} onClick={createContract} type="button"><FiPlus aria-hidden="true" /> Create agreement</button>
            <Link className={styles.textLink} to="/agreements">Open agreement register <FiArrowUpRight aria-hidden="true" /></Link>
          </div>
        </div>
        <figure className={styles.heroImage}>
          <img alt="Business partners reviewing a printed agreement at a table" fetchPriority="high" src={`${import.meta.env.BASE_URL}agreement-review.jpg`} />
          <figcaption><span>THE AGREEMENT DESK</span><strong>One calm place to move work along.</strong></figcaption>
        </figure>
      </section>

      <section aria-label="Portfolio summary" className={styles.metrics}>
        <article className={styles.metric}><span className={styles.metricIcon}><FiFileText /></span><div><span>Open agreements</span><strong>{active.filter((item) => item.status !== "Draft").length}</strong></div><small>Across {new Set(active.map((item) => item.counterparty)).size} counterparties</small></article>
        <article className={styles.metric}><span className={styles.metricIcon} data-tone="copper"><FiClock /></span><div><span>Review attention</span><strong>{inReview.length}</strong></div><small>{inReview.length ? "Decisions ready for your team" : "Nothing is waiting on review"}</small></article>
        <article className={styles.metric}><span className={styles.metricIcon} data-tone="olive"><FiArrowDownRight /></span><div><span>Renewal windows</span><strong>{renewalWindow.length}</strong></div><small>Notice dates in the next 90 days</small></article>
        <article className={styles.metric}><span className={styles.metricIcon} data-tone="ink"><FiShield /></span><div><span>Active commitment</span><strong>{money(activeValue)}</strong></div><small>Annual value across active terms</small></article>
      </section>

      <section className={styles.workspaceGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}><div><span className={styles.sectionLabel}>DECISIONS TO MOVE</span><h2>Review room</h2></div><Link className={styles.panelLink} to="/reviews">All reviews <FiArrowUpRight /></Link></div>
          {inReview.length ? <div className={styles.reviewList}>{inReview.slice(0, 4).map((item) => (
            <Link className={styles.reviewRow} key={item.id} to="/reviews">
              <span className={styles.docIcon}><FiFileText /></span>
              <span className={styles.reviewMain}><strong>{item.name}</strong><small>{item.counterparty} <span>·</span> {item.reviewer}</small></span>
              <span className={styles.statusPill} data-status={item.status}>{item.status}</span>
              <FiArrowUpRight className={styles.rowArrow} />
            </Link>
          ))}</div> : <div className={styles.emptyState}><FiShield /><strong>Reviews are clear</strong><span>New decisions will appear here.</span></div>}
        </article>
        <article className={styles.panel}>
          <div className={styles.panelHeading}><div><span className={styles.sectionLabel}>NOTICE DATES</span><h2>Renewals on the horizon</h2></div><Link className={styles.panelLink} to="/renewals">Renewal calendar <FiArrowUpRight /></Link></div>
          {renewalWindow.length ? <div className={styles.renewalList}>{renewalWindow.slice(0, 4).map((item) => {
            const days = daysUntil(item.renewalDate);
            return <Link className={styles.renewalRow} key={item.id} to="/renewals"><span className={styles.dateBlock}><strong>{dateLabel(item.renewalDate).split(" ")[1]}</strong><small>{dateLabel(item.renewalDate).split(" ")[0]}</small></span><span className={styles.renewalText}><strong>{item.name}</strong><small>{item.counterparty} <span>·</span> {days === 0 ? "Today" : `In ${days} days`}</small></span><FiArrowUpRight className={styles.rowArrow} /></Link>;
          })}</div> : <div className={styles.emptyState}><FiClock /><strong>No upcoming notice dates</strong><span>Renewal reminders will show when they enter the 90-day window.</span></div>}
        </article>
        <article className={`${styles.panel} ${styles.lifecyclePanel}`}>
          <div className={styles.panelHeading}><div><span className={styles.sectionLabel}>LIFECYCLE SNAPSHOT</span><h2>Where work stands</h2></div><Link className={styles.panelLink} to="/agreements">View register <FiArrowUpRight /></Link></div>
          <div className={styles.lifecycleBars}>{["Draft", "In review", "Needs changes", "Awaiting signature", "Active"].map((status) => {
            const count = active.filter((item) => item.status === status).length;
            const width = active.length ? Math.max(count / active.length * 100, count ? 8 : 0) : 0;
            return <div className={styles.lifecycleRow} key={status}><span>{status}</span><div className={styles.track}><i data-stage={status} style={{ width: `${width}%` }} /></div><strong>{count}</strong></div>;
          })}</div>
          <div className={styles.lifecycleFoot}><span><i /> {active.length} agreements in view</span><span>{money(active.reduce((sum, item) => sum + Number(item.value || 0), 0))} total tracked value</span></div>
        </article>
        <article className={`${styles.panel} ${styles.activityPanel}`}>
          <div className={styles.panelHeading}><div><span className={styles.sectionLabel}>RECENTLY TOUCHED</span><h2>Latest movement</h2></div><span className={styles.liveMark}><i /> Live</span></div>
          <div className={styles.activityList}>{recent.map((item, index) => <div className={styles.activityRow} key={item.id}><span className={styles.avatar} data-index={index}>{item.owner.split(" ").map((part) => part[0]).join("")}</span><span><strong>{item.name}</strong><small>{item.status} · {item.owner}</small></span><time>{item.updated}</time></div>)}</div>
          <div className={styles.counterparties}><FiUsers aria-hidden="true" /><span>Managed by <strong>Olivia Chen</strong> and 3 teammates</span></div>
        </article>
      </section>
    </div>
  );
}

export default OverviewPage;
