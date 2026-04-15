import type { Post } from "../types/post";
import { shortAddress, formatEth } from "../utils/format";

interface Props {
  post: Post;
  connectedAddress: string | null;
}

export function PostCard({ post, connectedAddress }: Props) {
  const isOwn = connectedAddress?.toLowerCase() === post.creator.toLowerCase();

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
      </div>
    </div>
  );
}
