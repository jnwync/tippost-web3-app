import { useState, useCallback } from "react";
import { useWallet } from "./hooks/useWallet";
import { useNetworkGuard } from "./hooks/useNetworkGuard";
import { useContract } from "./hooks/useContract";
import { usePosts } from "./hooks/usePosts";
import { useTxState } from "./hooks/useTxState";
import { ConnectButton } from "./components/ConnectButton";
import { NetworkBanner } from "./components/NetworkBanner";
import { CreatePostForm } from "./components/CreatePostForm";
import { PostFeed } from "./components/PostFeed";
import { EarningsBadge } from "./components/EarningsBadge";
import { TxToast } from "./components/TxToast";
import { EmptyState } from "./components/EmptyState";

function App() {
  const { address, chainId, provider, connect } = useWallet();
  const { isCorrectNetwork, switchNetwork } = useNetworkGuard(chainId);
  const { readContract, writeContract } = useContract(provider);
  const { posts, loading, error, refetch } = usePosts(readContract);
  const { tx, setPending, setSuccess, setError, reset } = useTxState();

  const [earningsKey, setEarningsKey] = useState(0);

  const handleTxSuccess = useCallback(() => {
    refetch();
    setEarningsKey((k) => k + 1);
  }, [refetch]);

  const appTx = { setPending, setSuccess, setError };

  const canInteract = !!address && isCorrectNetwork;

  return (
    <div className="app">
      <header className="header">
        <h1>TipPost 🔥</h1>
        <div className="header-right">
          {canInteract && address && (
            <EarningsBadge
              readContract={readContract}
              address={address}
              refreshKey={earningsKey}
            />
          )}
          <ConnectButton address={address} onConnect={connect} />
        </div>
      </header>

      {address && !isCorrectNetwork && (
        <NetworkBanner onSwitch={switchNetwork} />
      )}

      <TxToast tx={tx} onDismiss={reset} />

      <main className="main">
        {!address && (
          <EmptyState
            icon="👛"
            title="Connect your wallet to start tipping"
            action={{ label: "Connect Wallet", onClick: connect }}
          />
        )}

        {canInteract && writeContract && (
          <CreatePostForm
            writeContract={writeContract}
            onSuccess={handleTxSuccess}
            appTx={appTx}
          />
        )}

        {error && (
          <EmptyState
            icon="⚠️"
            title="Failed to load posts"
            subtitle={error}
          />
        )}
        {loading && <p className="hint">Loading posts...</p>}

        {!loading && !error && posts.length === 0 && (
          <EmptyState
            icon="🔥"
            title="No posts yet. Be the first to share!"
            subtitle="Connect your wallet and create a post above"
          />
        )}

        {!loading && posts.length > 0 && (
          <PostFeed
            posts={posts}
            connectedAddress={address}
            readContract={readContract}
            writeContract={writeContract}
            onLikeSuccess={handleTxSuccess}
            appTx={appTx}
          />
        )}
      </main>
    </div>
  );
}

export default App;
