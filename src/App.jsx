import { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./AppRoutes.jsx";
import Header from "./components/header/index.jsx";
import Footer from "./components/footer/index.jsx";
import Toast from "./components/toast/index.jsx";
import ContractDialog from "./components/contractDialog/index.jsx";
import ConfirmationDialog from "./components/confirmationDialog/index.jsx";
import ScrollToTop from "./components/scrollToTop/index.jsx";
import styles from "./App.module.css";

const initialContracts = [
  { id: "AGR-2408", name: "Cloud platform services", counterparty: "Northstar Systems", type: "SaaS agreement", owner: "Olivia Chen", status: "In review", value: 68400, startDate: "2026-01-15", endDate: "2027-01-14", renewalDate: "2026-11-15", updated: "Today", clause: "Auto-renews for one year unless either party gives 60 days notice.", reviewer: "Mina Patel", notes: ["Security addendum attached for review."] },
  { id: "AGR-2407", name: "Strategic design partnership", counterparty: "Studio Morrow", type: "Professional services", owner: "Marcus Lee", status: "Awaiting signature", value: 42800, startDate: "2026-04-01", endDate: "2027-03-31", renewalDate: "2027-01-30", updated: "Yesterday", clause: "Scope and milestones are defined in exhibit A.", reviewer: "Tessa Morgan", notes: [] },
  { id: "AGR-2406", name: "Office lease - West Wing", counterparty: "Harbor Property Group", type: "Lease", owner: "Avery Brooks", status: "Active", value: 186000, startDate: "2025-08-01", endDate: "2027-07-31", renewalDate: "2027-01-31", updated: "Oct 8", clause: "Renewal option requires written notice six months before expiration.", reviewer: "Jordan Kim", notes: [] },
  { id: "AGR-2405", name: "Customer data processing terms", counterparty: "Clearwater Analytics", type: "Data processing", owner: "Olivia Chen", status: "Needs changes", value: 12000, startDate: "2026-02-01", endDate: "2027-01-31", renewalDate: "2026-11-30", updated: "Oct 7", clause: "Data must be deleted within 30 days after termination.", reviewer: "Mina Patel", notes: ["Clarify subprocessors and breach notice timing."] },
  { id: "AGR-2404", name: "Product photography license", counterparty: "Fieldwork Creative", type: "License", owner: "Sam Rivera", status: "Active", value: 15800, startDate: "2026-05-01", endDate: "2027-04-30", renewalDate: "2027-03-01", updated: "Oct 6", clause: "Usage is limited to owned digital channels and print catalogues.", reviewer: "Tessa Morgan", notes: [] },
  { id: "AGR-2403", name: "Managed IT support", counterparty: "Cornerstone Tech", type: "Service agreement", owner: "Marcus Lee", status: "Active", value: 37200, startDate: "2025-12-01", endDate: "2026-11-30", renewalDate: "2026-10-31", updated: "Oct 3", clause: "Thirty-day termination for convenience after initial term.", reviewer: "Jordan Kim", notes: [] },
  { id: "AGR-2402", name: "Brand usage authorization", counterparty: "Hearth & Pine", type: "License", owner: "Sam Rivera", status: "Draft", value: 9600, startDate: "2026-10-01", endDate: "2027-09-30", renewalDate: "2027-07-30", updated: "Oct 1", clause: "Territory and media schedule are being completed.", reviewer: "Mina Patel", notes: [] },
];

const initialPlaybooks = [
  { id: "TPL-01", name: "Mutual NDA", category: "Confidentiality", description: "A balanced agreement for early conversations and shared project information.", clauses: 8, updated: "Oct 9" },
  { id: "TPL-02", name: "Services agreement", category: "Professional services", description: "Scope, fees, delivery, and ownership terms for external partners.", clauses: 14, updated: "Oct 4" },
  { id: "TPL-03", name: "Data processing addendum", category: "Privacy & data", description: "Baseline processing, security, and incident obligations for vendors.", clauses: 11, updated: "Sep 28" },
  { id: "TPL-04", name: "Software subscription", category: "Technology", description: "Subscription term, usage, support, and renewal checkpoints.", clauses: 12, updated: "Sep 22" },
];

function App() {
  const location = useLocation();
  const [contracts, setContracts] = useState(initialContracts);
  const [playbooks, setPlaybooks] = useState(initialPlaybooks);
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState(null);
  const [toastVersion, setToastVersion] = useState(0);

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type });
    setToastVersion((value) => value + 1);
  }, []);

  const saveContract = (values) => {
    if (dialog?.mode === "edit") {
      setContracts((items) => items.map((item) => item.id === dialog.contract.id ? { ...item, ...values, updated: "Just now" } : item));
      notify("Agreement details updated.");
    } else {
      const sequence = Math.max(2400, ...contracts.map((item) => Number(item.id.slice(4)) || 0)) + 1;
      setContracts((items) => [{ ...values, id: `AGR-${sequence}`, status: "Draft", updated: "Just now", notes: [], reviewer: "Mina Patel" }, ...items]);
      notify("Agreement draft created.");
    }
    setDialog(null);
  };

  const updateContract = (id, patch) => {
    setContracts((items) => items.map((item) => item.id === id ? { ...item, ...patch, updated: "Just now" } : item));
  };

  const confirmAction = () => {
    if (dialog?.kind === "delete-contract") {
      setContracts((items) => items.filter((item) => item.id !== dialog.contract.id));
      notify(`${dialog.contract.name} removed from this workspace.`);
    } else if (dialog?.kind === "archive-contract") {
      updateContract(dialog.contract.id, { status: "Archived" });
      notify("Agreement archived.");
    } else if (dialog?.kind === "delete-playbook") {
      setPlaybooks((items) => items.filter((item) => item.id !== dialog.playbook.id));
      notify("Playbook removed.");
    } else if (dialog?.kind === "not-renewing") {
      updateContract(dialog.contract.id, { renewalState: "Not renewing" });
      notify("Renewal marked for closure.");
    }
    setDialog(null);
  };

  const decideReview = (contract, decision, note) => {
    const status = decision === "approve" ? "Awaiting signature" : "Needs changes";
    setContracts((items) => items.map((item) => item.id === contract.id ? { ...item, status, notes: note ? [...item.notes, note] : item.notes, updated: "Just now" } : item));
    notify(decision === "approve" ? "Review approved. Agreement is ready for signature." : "Revision request added to the agreement.");
    setDialog(null);
  };

  const savePlaybook = (values) => {
    if (dialog?.mode === "edit-playbook") {
      setPlaybooks((items) => items.map((item) => item.id === dialog.playbook.id ? { ...item, ...values, updated: "Just now" } : item));
      notify("Playbook updated.");
    } else {
      const id = `TPL-${String(Date.now()).slice(-4)}`;
      setPlaybooks((items) => [{ ...values, id, clauses: 6, updated: "Just now" }, ...items]);
      notify("Playbook created.");
    }
    setDialog(null);
  };

  const pageProps = {
    contracts, playbooks, notify, updateContract,
    createContract: (prefill = {}) => setDialog({ kind: "contract-form", mode: "create", prefill }),
    editContract: (contract) => setDialog({ kind: "contract-form", mode: "edit", contract }),
    deleteContract: (contract) => setDialog({ kind: "delete-contract", contract }),
    archiveContract: (contract) => setDialog({ kind: "archive-contract", contract }),
    reviewContract: (contract, decision) => setDialog({ kind: "review-note", contract, decision }),
    createPlaybook: () => setDialog({ kind: "playbook-form", mode: "create" }),
    editPlaybook: (playbook) => setDialog({ kind: "playbook-form", mode: "edit-playbook", playbook }),
    deletePlaybook: (playbook) => setDialog({ kind: "delete-playbook", playbook }),
    markNotRenewing: (contract) => setDialog({ kind: "not-renewing", contract }),
  };

  const title = location.pathname.split("/").filter(Boolean)[0] || "Overview";
  const sectionTitle = ({ agreements: "Agreements", reviews: "Review room", renewals: "Renewals", playbooks: "Playbooks" })[title] || "Overview";

  return (
    <div className={styles.app}>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <ScrollToTop />
      <Header onCreate={() => pageProps.createContract()} currentTitle={sectionTitle} />
      <main className={styles.main} id="main-content">
        <AppRoutes pageProps={pageProps} />
      </main>
      <Footer />
      <Toast toast={toast} version={toastVersion} onClose={() => setToast(null)} />
      {dialog?.kind === "contract-form" && <ContractDialog mode={dialog.mode} contract={dialog.contract || dialog.prefill} onClose={() => setDialog(null)} onSave={saveContract} />}
      {dialog?.kind === "playbook-form" && <ContractDialog mode={dialog.mode} playbook={dialog.playbook} formType="playbook" onClose={() => setDialog(null)} onSave={savePlaybook} />}
      {dialog?.kind === "review-note" && <ContractDialog mode={dialog.decision} contract={dialog.contract} formType="review" onClose={() => setDialog(null)} onSave={(values) => decideReview(dialog.contract, dialog.decision, values.note)} />}
      {dialog && ["delete-contract", "archive-contract", "delete-playbook", "not-renewing"].includes(dialog.kind) && (
        <ConfirmationDialog dialog={dialog} onCancel={() => setDialog(null)} onConfirm={confirmAction} />
      )}
    </div>
  );
}

export default App;
