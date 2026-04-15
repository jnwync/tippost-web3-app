interface Props {
  address: string | null;
  onConnect: () => void;
}

export function ConnectButton({ address, onConnect }: Props) {
  if (address) {
    const short = `${address.slice(0, 6)}...${address.slice(-4)}`;
    return (
      <span className="wallet-pill" title={address}>
        {short}
      </span>
    );
  }

  return (
    <button className="connect-btn" onClick={onConnect}>
      Connect Wallet
    </button>
  );
}
