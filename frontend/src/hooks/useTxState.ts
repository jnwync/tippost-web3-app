import { useState, useCallback } from "react";

export type TxStatus = "idle" | "pending" | "success" | "error";

export interface TxState {
  status: TxStatus;
  message: string;
  txHash?: string;
}

export interface AppTx {
  setPending: () => void;
  setSuccess: (msg?: string, hash?: string) => void;
  setError: (msg: string) => void;
}

export function useTxState() {
  const [tx, setTx] = useState<TxState>({ status: "idle", message: "" });

  const setPending = useCallback(() =>
    setTx({ status: "pending", message: "Waiting for confirmation..." }), []);

  const setSuccess = useCallback((msg = "Transaction confirmed!", txHash?: string) =>
    setTx({ status: "success", message: msg, txHash }), []);

  const setError = useCallback((msg: string) =>
    setTx({ status: "error", message: msg }), []);

  const reset = useCallback(() =>
    setTx({ status: "idle", message: "" }), []);

  return { tx, setPending, setSuccess, setError, reset };
}
