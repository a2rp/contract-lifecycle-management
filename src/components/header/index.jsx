import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiFileText, FiMenu, FiPlus, FiX } from "react-icons/fi";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./styles.module.css";

const links = [
  { to: "/", label: "Overview", end: true },
  { to: "/agreements", label: "Agreements" },
  { to: "/reviews", label: "Review room" },
  { to: "/renewals", label: "Renewals" },
  { to: "/playbooks", label: "Playbooks" },
];

function Header({ onCreate, currentTitle }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);
  const headerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (menuOpen || y < 64) setHidden(false);
      else if (y > lastScroll.current + 6) setHidden(true);
      else if (y < lastScroll.current - 4) setHidden(false);
      lastScroll.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onPointerDown = (event) => { if (!headerRef.current?.contains(event.target)) setMenuOpen(false); };
    const onKeyDown = (event) => { if (event.key === "Escape") setMenuOpen(false); };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className={styles.header} data-hidden={hidden} ref={headerRef}>
      <div className={styles.topline}><span><span className={styles.pulse} /> CONTRACT OPERATIONS WORKSPACE</span><span>Northstar Studio <b>·</b> FY26</span></div>
      <div className={styles.inner}>
        <NavLink aria-label="Pactline overview" className={styles.brand} to="/">
          <span aria-hidden="true" className={styles.brandMark}><FiFileText /></span>
          <span>pactline<span className={styles.brandDot}>/</span></span>
        </NavLink>
        <button aria-controls="primary-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} className={styles.menuButton} onClick={() => setMenuOpen((open) => !open)} type="button">
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
        <nav aria-label="Main navigation" className={menuOpen ? styles.navigationOpen : styles.navigation} id="primary-navigation">
          <div className={styles.navLinks}>
            {links.map((link) => <NavLink className={({ isActive }) => isActive ? styles.activeLink : styles.link} end={link.end} key={link.to} to={link.to}>{link.label}</NavLink>)}
          </div>
          <div className={styles.accountArea}>
            <span className={styles.userChip}><span>OC</span> Olivia Chen <FiArrowUpRight aria-hidden="true" /></span>
            <button className={styles.createButton} onClick={onCreate} type="button"><FiPlus aria-hidden="true" /> New agreement</button>
          </div>
        </nav>
      </div>
      <div aria-hidden="true" className={styles.pageStrip}><span>{currentTitle}</span><span>Workspace / {currentTitle}</span></div>
    </header>
  );
}

export default Header;
