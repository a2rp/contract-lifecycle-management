import styles from "./styles.module.css";

function Loading() {
  return <div aria-label="Loading" className={styles.loading} role="status"><span className={styles.spinner} /></div>;
}

export default Loading;
