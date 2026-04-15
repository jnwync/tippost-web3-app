import { useState, useEffect } from "react";
import type { Contract } from "ethers";
import { TrendingUp } from "lucide-react";
import { formatEth } from "../utils/format";

interface Props {
  readContract: Contract;
  address: string;
  refreshKey: number;
}

export function EarningsBadge({ readContract, address, refreshKey }: Props) {
  const [earned, setEarned] = useState<bigint>(0n);

  useEffect(() => {
    readContract
      .totalEarnedByUser(address)
      .then((v: bigint) => setEarned(v))
      .catch(() => setEarned(0n));
  }, [readContract, address, refreshKey]);

  return (
    <span className="earnings-badge" title="Your total ETH earned from tips">
      <TrendingUp size={14} />
      {formatEth(earned)} ETH earned
    </span>
  );
}
