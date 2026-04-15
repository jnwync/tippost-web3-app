import { useWallet } from "./hooks/useWallet";
import { useNetworkGuard } from "./hooks/useNetworkGuard";
import { ConnectButton } from "./components/ConnectButton";
import { NetworkBanner } from "./components/NetworkBanner";

function App() {
  const { address, chainId, connect } = useWallet();
  const { isCorrectNetwork, switchNetwork } = useNetworkGuard(chainId);

  return (
    <div className="app">
      <header className="header">
        <h1>TipPost</h1>
        <ConnectButton address={address} onConnect={connect} />
      </header>

      {address && !isCorrectNetwork && (
        <NetworkBanner onSwitch={switchNetwork} />
      )}

      <main className="main">
        {!address && (
          <p className="hint">Connect your wallet to create and like posts.</p>
        )}
        {address && isCorrectNetwork && (
          <p className="hint">Wallet connected. Feed coming soon.</p>
        )}
      </main>
    </div>
  );
}

export default App;
