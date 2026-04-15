import { useWallet } from "./hooks/useWallet";
import { useNetworkGuard } from "./hooks/useNetworkGuard";
import { useContract } from "./hooks/useContract";
import { usePosts } from "./hooks/usePosts";
import { ConnectButton } from "./components/ConnectButton";
import { NetworkBanner } from "./components/NetworkBanner";

function App() {
  const { address, chainId, provider, connect } = useWallet();
  const { isCorrectNetwork, switchNetwork } = useNetworkGuard(chainId);
  const { readContract } = useContract(provider);
  const { posts, loading, error } = usePosts(readContract);

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
        {loading && <p className="hint">Loading posts...</p>}
        {error && <p className="hint error">{error}</p>}
        {address && isCorrectNetwork && !loading && posts.length === 0 && (
          <p className="hint">No posts yet. Be the first to post!</p>
        )}
        {/* Feed, CreateForm, EarningsBadge added in Phase 8–9 */}
        {posts.map((p) => (
          <div key={p.id.toString()} className="post-stub">
            <strong>{p.caption}</strong> — {p.creator.slice(0, 8)}...
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
