import type { Contract } from "ethers";
import type { Post } from "../types/post";
import { PostCard } from "./PostCard";

interface Props {
  posts: Post[];
  connectedAddress: string | null;
  readContract: Contract;
  writeContract: Contract | null;
  onLikeSuccess: () => void;
}

export function PostFeed({ posts, connectedAddress, readContract, writeContract, onLikeSuccess }: Props) {
  return (
    <div className="post-feed">
      {posts.map((post) => (
        <PostCard
          key={post.id.toString()}
          post={post}
          connectedAddress={connectedAddress}
          readContract={readContract}
          writeContract={writeContract}
          onLikeSuccess={onLikeSuccess}
        />
      ))}
    </div>
  );
}
