import { useState, useEffect, useMemo } from "react";
import { Contract, JsonRpcProvider } from "ethers";
import type { BrowserProvider, Signer } from "ethers";
import TipPostABI from "../abi/TipPost.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";

/**
 * readContract  — backed by a public JSON-RPC provider, no wallet needed.
 * writeContract — backed by the MetaMask signer; null until wallet is connected.
 */
export function useContract(provider: BrowserProvider | null) {
  const [signer, setSigner] = useState<Signer | null>(null);

  // Resolve signer asynchronously whenever provider changes
  useEffect(() => {
    if (!provider) {
      setSigner(null);
      return;
    }
    provider.getSigner().then(setSigner).catch(() => setSigner(null));
  }, [provider]);

  const readContract = useMemo(() => {
    const readProvider = new JsonRpcProvider(RPC_URL);
    return new Contract(CONTRACT_ADDRESS, TipPostABI.abi, readProvider);
  }, []);

  const writeContract = useMemo(() => {
    if (!signer) return null;
    return new Contract(CONTRACT_ADDRESS, TipPostABI.abi, signer);
  }, [signer]);

  return { readContract, writeContract };
}
