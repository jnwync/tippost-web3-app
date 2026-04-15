import type { Post } from "../types/post";
import { PostCard } from "./PostCard";

interface Props {
  posts: Post[];
  connectedAddress: string | null;
}

export function PostFeed({ posts, connectedAddress }: Props) {
  return (
    <div className="post-feed">
      {posts.map((post) => (
        <PostCard
          key={post.id.toString()}
          post={post}
          connectedAddress={connectedAddress}
        />
      ))}
    </div>
  );
}
