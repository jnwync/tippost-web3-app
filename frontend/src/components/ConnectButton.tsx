interface Props {
  address: string | null;
  onConnect: () => void;
}

export function ConnectButton({ address, onConnect }: Props) {
  const short = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  return (
    <button className="connect-btn" onClick={onConnect} disabled={!!address}>
      {short ?? "Connect Wallet"}
    </button>
  );
}
