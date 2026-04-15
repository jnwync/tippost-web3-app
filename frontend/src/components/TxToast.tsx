import { useEffect } from "react";
import type { TxState } from "../hooks/useTxState";

interface Props {
  tx: TxState;
  onDismiss: () => void;
}

export function TxToast({ tx, onDismiss }: Props) {
  // Auto-dismiss success after 5 seconds
  useEffect(() => {
    if (tx.status !== "success") return;
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [tx.status, onDismiss]);

  if (tx.status === "idle") return null;

  const icons: Record<string, string> = {
    idle: "",
    pending: "⏳",
    success: "✅",
    error: "❌",
  };

  return (
    <div className={`tx-toast tx-toast--${tx.status}`} role="status">
      <span className="tx-toast__icon">{icons[tx.status]}</span>
      <span className="tx-toast__msg">{tx.message}</span>
      {tx.status === "success" && tx.txHash && (
        <a
          href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
          target="_blank"
          rel="noreferrer"
          className="tx-toast__link"
        >
          Etherscan ↗
        </a>
      )}
      {tx.status !== "pending" && (
        <button className="tx-toast__dismiss" onClick={onDismiss} aria-label="Dismiss">
          ✕
        </button>
      )}
    </div>
  );
}
