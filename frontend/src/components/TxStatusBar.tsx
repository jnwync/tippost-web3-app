import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, ExternalLink, X } from "lucide-react";
import type { TxState } from "../hooks/useTxState";

interface Props {
  tx: TxState;
  onDismiss: () => void;
}

export function TxStatusBar({ tx, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (tx.status === "idle") {
      if (visible) {
        setVisible(false);
        const t = setTimeout(() => setRendered(false), 200);
        return () => clearTimeout(t);
      }
      return;
    }

    setRendered(true);
    setVisible(true);
  }, [tx.status]);

  useEffect(() => {
    if (tx.status !== "success") return;
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(), 200);
    }, 5000);
    return () => clearTimeout(timer);
  }, [tx.status, onDismiss]);

  if (!rendered) return null;

  const liveRegion =
    tx.status === "error" ? "assertive" : "polite";

  return (
    <div
      className={`tx-status-bar tx-status-bar--${tx.status} ${visible ? "tx-status-bar--visible" : ""}`}
      role="status"
      aria-live={liveRegion}
    >
      <span className="tx-status-bar__left">
        {tx.status === "pending" && <span className="spinner" />}
        {tx.status === "success" && <CheckCircle size={14} />}
        {tx.status === "error" && <AlertCircle size={14} />}
        <span className="tx-status-bar__msg">
          {tx.status === "pending" && "Sending tip — waiting for confirmation..."}
          {tx.status === "success" && "Tip sent successfully!"}
          {tx.status === "error" && tx.message}
        </span>
      </span>
      <span className="tx-status-bar__right">
        {tx.txHash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
            target="_blank"
            rel="noreferrer"
            className="tx-status-bar__link"
          >
            <ExternalLink size={12} /> Etherscan
          </a>
        )}
        {tx.status !== "pending" && (
          <button
            className="tx-status-bar__dismiss"
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        )}
      </span>
    </div>
  );
}
