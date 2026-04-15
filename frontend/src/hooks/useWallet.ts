import { useState, useEffect, useCallback } from "react";
import { BrowserProvider } from "ethers";

interface WalletState {
  address: string | null;
  chainId: number | null;
  provider: BrowserProvider | null;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    provider: null,
  });

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert("MetaMask not found. Please install it.");
      return;
    }
    const provider = new BrowserProvider(window.ethereum);
    const accounts: string[] = await provider.send("eth_requestAccounts", []);
    const network = await provider.getNetwork();
    setWallet({
      address: accounts[0],
      chainId: Number(network.chainId),
      provider,
    });
  }, []);

  // Sync on account/chain change
  useEffect(() => {
    const eth = window.ethereum;
    if (!eth) return;

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      setWallet((prev) => ({
        ...prev,
        address: accounts[0] ?? null,
      }));
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    eth.on("accountsChanged", handleAccountsChanged);
    eth.on("chainChanged", handleChainChanged);

    return () => {
      eth.removeListener("accountsChanged", handleAccountsChanged);
      eth.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return { ...wallet, connect };
}
