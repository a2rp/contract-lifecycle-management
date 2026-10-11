import { Link } from "react-router-dom";
import { FiArrowLeft, FiFileText } from "react-icons/fi";
import styles from "./styles.module.css";

function NotFoundPage() {
  return (
    <main className={styles.page}>
      <div className={styles.document}><FiFileText /><span>404</span><i /></div>
      <span className={styles.eyebrow}>RECORD NOT FOUND</span>
      <h1>This page is outside<br />the agreement file.</h1>
      <p>The address may have moved, or the link may have been entered incorrectly.</p>
      <Link className={styles.homeLink} to="/"><FiArrowLeft /> Back to workspace</Link>
    </main>
  );
}

export default NotFoundPage;
