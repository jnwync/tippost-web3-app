import { useState, useEffect, useCallback } from "react";
import { Contract } from "ethers";
import type { Post } from "../types/post";

interface RawPost {
  id: bigint;
  creator: string;
  imageUrl: string;
  caption: string;
  likes: bigint;
  totalEarned: bigint;
  timestamp: bigint;
}

function normalize(raw: RawPost): Post {
  return {
    id: raw.id,
    creator: raw.creator,
    imageUrl: raw.imageUrl,
    caption: raw.caption,
    likes: raw.likes,
    totalEarned: raw.totalEarned,
    timestamp: raw.timestamp,
  };
}

export function usePosts(readContract: Contract | null) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!readContract) return;
    setLoading(true);
    setError(null);
    try {
      const raw = await readContract.getAllPosts() as RawPost[];
      setPosts([...raw].reverse().map(normalize));
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("Failed to load posts. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [readContract]);

  // Initial load
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Real-time event listeners
  useEffect(() => {
    if (!readContract) return;
    const onPostCreated = () => fetchPosts();
    const onPostLiked = (_id: bigint, _liker: string, _creator: string) => fetchPosts();

    readContract.on("PostCreated", onPostCreated);
    readContract.on("PostLiked", onPostLiked);

    return () => {
      readContract.off("PostCreated", onPostCreated);
      readContract.off("PostLiked", onPostLiked);
    };
  }, [readContract, fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
}
