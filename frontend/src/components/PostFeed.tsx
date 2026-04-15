import type { Contract } from "ethers";
import type { Post } from "../types/post";
import type { AppTx } from "../hooks/useTxState";
import { PostCard } from "./PostCard";
import { Skeleton } from "./Skeleton";

interface Props {
  posts: Post[];
  connectedAddress: string | null;
  readContract: Contract;
  writeContract: Contract | null;
  onLikeSuccess: () => void;
  appTx: AppTx;
  loading?: boolean;
}

export function PostFeed({ posts, connectedAddress, readContract, writeContract, onLikeSuccess, appTx, loading }: Props) {
  return (
    <div className="post-feed">
      {loading && (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      )}
      {!loading && posts.map((post, i) => (
        <PostCard
          key={post.id.toString()}
          post={post}
          connectedAddress={connectedAddress}
          readContract={readContract}
          writeContract={writeContract}
          onLikeSuccess={onLikeSuccess}
          appTx={appTx}
          entranceDelay={i * 50}
        />
      ))}
    </div>
  );
}
