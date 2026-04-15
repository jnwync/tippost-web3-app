import { useState, useEffect } from "react";
import type { Contract } from "ethers";
import { parseEther } from "ethers";
import type { Post } from "../types/post";
import { shortAddress, formatEth } from "../utils/format";
import { parseEthersError } from "../utils/errors";
import { useTxState } from "../hooks/useTxState";
import type { AppTx } from "../hooks/useTxState";

interface Props {
  post: Post;
  connectedAddress: string | null;
  readContract: Contract;
  writeContract: Contract | null;
  onLikeSuccess: () => void;
  appTx: AppTx;
}

export function PostCard({ post, connectedAddress, readContract, writeContract, onLikeSuccess, appTx }: Props) {
  const isOwn =
    !!connectedAddress &&
    connectedAddress.toLowerCase() === post.creator.toLowerCase();

  const [liked, setLiked] = useState(false);
  const { tx, setPending, setSuccess, setError, reset } = useTxState();

  // Check if connected address has already liked this post
  useEffect(() => {
    if (!connectedAddress) return;
    readContract
      .checkLiked(post.id, connectedAddress)
      .then((v: boolean) => setLiked(v))
      .catch(() => setLiked(false));
  }, [readContract, post.id, connectedAddress]);

  const handleLike = async () => {
    if (!writeContract || isOwn || liked) return;
    reset();
    setPending();
    appTx.setPending();
    try {
      const txResponse = await writeContract.likePost(post.id, {
        value: parseEther("0.0001"),
      });
      await txResponse.wait();
      setLiked(true);
      setSuccess("Tip sent!", txResponse.hash);
      appTx.setSuccess("Tip sent!", txResponse.hash);
      setTimeout(onLikeSuccess, 1500);
    } catch (err) {
      const msg = parseEthersError(err);
      setError(msg);
      appTx.setError(msg);
    }
  };

  const likeDisabled =
    !writeContract || isOwn || liked || tx.status === "pending";

  const likeLabel = () => {
    if (isOwn) return "Your post";
    if (liked) return "❤️ Liked";
    if (tx.status === "pending") return "Sending...";
    return "🤍 Like (0.0001 ETH)";
  };

  return (
    <div className="post-card">
      <img
        src={post.imageUrl}
        alt={post.caption}
        className="post-img"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            "https://placehold.co/600x400/1a1a1a/888?text=Image+not+found";
        }}
      />
      <div className="post-body">
        <p className="post-caption">{post.caption}</p>
        <div className="post-meta">
          <span className="post-creator" title={post.creator}>
            {shortAddress(post.creator)}
            {isOwn && <span className="you-badge"> (you)</span>}
          </span>
          <span className="post-stats">
            ❤️ {post.likes.toString()} · {formatEth(post.totalEarned)} earned
          </span>
        </div>

        <div className="post-actions">
          <button
            className={`like-btn ${liked ? "liked" : ""} ${isOwn ? "own" : ""}`}
            onClick={handleLike}
            disabled={likeDisabled}
          >
            {likeLabel()}
          </button>

          {tx.status === "success" && (
            <span className="tx-inline success">
              ✅ {tx.message}{" "}
              {tx.txHash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="tx-link"
                >
                  Etherscan ↗
                </a>
              )}
            </span>
          )}
          {tx.status === "error" && (
            <span className="tx-inline error">❌ {tx.message}</span>
          )}
        </div>
      </div>
    </div>
  );
}
