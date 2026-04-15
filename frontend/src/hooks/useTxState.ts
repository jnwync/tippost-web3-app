import { useState } from "react";

export type TxStatus = "idle" | "pending" | "success" | "error";

export interface TxState {
  status: TxStatus;
  message: string;
  txHash?: string;
}

export function useTxState() {
  const [tx, setTx] = useState<TxState>({ status: "idle", message: "" });

  const setPending = () =>
    setTx({ status: "pending", message: "Waiting for confirmation..." });

  const setSuccess = (msg = "Transaction confirmed!", txHash?: string) =>
    setTx({ status: "success", message: msg, txHash });

  const setError = (msg: string) =>
    setTx({ status: "error", message: msg });

  const reset = () =>
    setTx({ status: "idle", message: "" });

  return { tx, setPending, setSuccess, setError, reset };
}
