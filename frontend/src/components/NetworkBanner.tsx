interface Props {
  onSwitch: () => void;
}

export function NetworkBanner({ onSwitch }: Props) {
  return (
    <div className="network-banner">
      <span className="network-banner__icon">
        <span className="status-dot status-dot--error" />
      </span>
      <span className="network-banner__msg">
        Please switch to <strong>Sepolia</strong> network
      </span>
      <button className="network-banner__btn" onClick={onSwitch}>
        Switch Network
      </button>
    </div>
  );
}
