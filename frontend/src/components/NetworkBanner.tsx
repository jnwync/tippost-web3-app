interface Props {
  onSwitch: () => void;
}

export function NetworkBanner({ onSwitch }: Props) {
  return (
    <div className="network-banner">
      ⚠️ Please switch to <strong>Sepolia</strong> testnet to use TipPost.
      <button onClick={onSwitch}>Switch Network</button>
    </div>
  );
}
