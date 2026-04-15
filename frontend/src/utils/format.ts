import { formatEther } from "ethers";

export function shortAddress(addr: string): string {
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function formatEth(wei: bigint): string {
  return `${parseFloat(formatEther(wei)).toFixed(4)} ETH`;
}
