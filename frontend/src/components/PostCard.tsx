import { useState, useEffect, useRef } from "react";
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
  entranceDelay?: number;
  lazyLoad?: boolean;
}

export function PostCard({ post, connectedAddress, readContract, writeContract, onLikeSuccess, appTx, entranceDelay = 0, lazyLoad = false }: Props) {
  const isOwn =
    !!connectedAddress &&
    connectedAddress.toLowerCase() === post.creator.toLowerCase();

  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(false);
  const [imgError, setImgError] = useState(false);
  const burstTimer = useRef<ReturnType<typeof setTimeout>>();

  const { tx, setPending, setSuccess, setError, reset } = useTxState();

  useEffect(() => {
    if (!connectedAddress) return;
    readContract
      .checkLiked(post.id, connectedAddress)
      .then((v: boolean) => setLiked(v))
      .catch(() => setLiked(false));
  }, [readContract, post.id, connectedAddress]);

  useEffect(() => {
    return () => {
      if (burstTimer.current) clearTimeout(burstTimer.current);
    };
  }, []);

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
      setBurst(true);
      burstTimer.current = setTimeout(() => setBurst(false), 400);
      setTimeout(onLikeSuccess, 1500);
    } catch (err) {
      const msg = parseEthersError(err);
      setError(msg);
      appTx.setError(msg);
    }
  };

  const likeDisabled =
    !writeContract || isOwn || liked || tx.status === "pending";

  const cardClasses = [
    "post-card",
    tx.status === "pending" && "post-card--pending",
    burst && "post-card--success",
  ].filter(Boolean).join(" ");

  const tipBtnClasses = [
    "tip-btn",
    liked && "tip-btn--liked",
    isOwn && "tip-btn--own",
    burst && "tip-btn--burst",
  ].filter(Boolean).join(" ");

  const tipLabel = () => {
    if (isOwn) return "Your post";
    if (liked) return "Tipped";
    if (tx.status === "pending") return "Sending...";
    return (
      <>
        Tip<span className="tip-btn__amount"> 0.0001 ETH</span>
      </>
    );
  };

  return (
    <div
      className={cardClasses}
      style={{ animationDelay: `${entranceDelay}ms` }}
    >
      {imgError ? (
        <div className="post-img-placeholder" />
      ) : (
        <img
          src={post.imageUrl}
          alt={post.caption}
          className="post-img"
          onError={() => setImgError(true)}
          loading={lazyLoad ? "lazy" : undefined}
        />
      )}
      <div className="post-body">
        <p className="post-caption">{post.caption}</p>
        <div className="post-meta">
          <span className="post-creator" title={post.creator}>
            {shortAddress(post.creator)}
            {isOwn && <span className="you-badge"> (you)</span>}
          </span>
          <span className="post-stats">
            {post.likes.toString()} {Number(post.likes) === 1 ? "tip" : "tips"} · {formatEth(post.totalEarned)} ETH
          </span>
        </div>

        <div className="post-actions">
          <button
            className={tipBtnClasses}
            onClick={handleLike}
            disabled={likeDisabled}
            aria-disabled={likeDisabled}
            title={
              isOwn
                ? "This is your own post"
                : liked
                  ? "You have already tipped this post"
                  : tx.status === "pending"
                    ? "Transaction pending"
                    : undefined
            }
            aria-label={
              isOwn
                ? "Your own post"
                : liked
                  ? "Already tipped"
                  : `Tip 0.0001 ETH to ${shortAddress(post.creator)}`
            }
          >
            {tx.status === "pending" && (
              <span className="spinner" />
            )}
            {tipLabel()}
          </button>

          {tx.status === "success" && tx.txHash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
              target="_blank"
              rel="noreferrer"
              className="tx-link"
            >
              Etherscan ↗
            </a>
          )}
          {tx.status === "error" && (
            <span className="tx-inline error">{tx.message}</span>
          )}
        </div>
      </div>
    </div>
  );
}
