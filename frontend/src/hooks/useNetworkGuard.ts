import { useCallback } from "react";

const parsed = parseInt(import.meta.env.VITE_CHAIN_ID, 10);
const REQUIRED_CHAIN_ID = Number.isFinite(parsed) ? parsed : 11155111;

export function useNetworkGuard(chainId: number | null) {
  const isCorrectNetwork = chainId === REQUIRED_CHAIN_ID;

  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) return;
    const chainHex = `0x${REQUIRED_CHAIN_ID.toString(16)}`;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainHex }],
      });
    } catch (err: unknown) {
      const code = (err as { code?: number }).code;
      // User rejected the switch — do nothing
      if (code === 4001) return;
      // Chain not added to MetaMask yet — add it
      if (code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainHex,
                chainName: "Sepolia",
                nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                rpcUrls: ["https://rpc.sepolia.org"],
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          });
        } catch {
          // User rejected the add-network prompt — do nothing
        }
      }
    }
  }, []);

  return { isCorrectNetwork, switchNetwork };
}
