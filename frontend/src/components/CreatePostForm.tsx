import { useState } from "react";
import type { Contract } from "ethers";
import { useTxState } from "../hooks/useTxState";
import type { AppTx } from "../hooks/useTxState";
import { parseEthersError } from "../utils/errors";

interface Props {
  writeContract: Contract;
  onSuccess: () => void;
  appTx: AppTx;
}

export function CreatePostForm({ writeContract, onSuccess, appTx }: Props) {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const { tx, setPending, setSuccess, setError, reset } = useTxState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim() || !caption.trim()) return;

    reset();
    setPending();
    appTx.setPending();
    try {
      const txResponse = await writeContract.createPost(imageUrl.trim(), caption.trim());
      await txResponse.wait();
      setSuccess("Post created!", txResponse.hash);
      appTx.setSuccess("Post created!", txResponse.hash);
      setImageUrl("");
      setCaption("");
      setTimeout(onSuccess, 1500);
    } catch (err) {
      const msg = parseEthersError(err);
      setError(msg);
      appTx.setError(msg);
    }
  };

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Create Post</h2>

      <input
        className="form-input"
        type="url"
        placeholder="Image URL (e.g. https://picsum.photos/600/400)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        disabled={tx.status === "pending"}
        required
      />
      <input
        className="form-input"
        type="text"
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        disabled={tx.status === "pending"}
        required
        maxLength={280}
      />

      <button
        className="submit-btn"
        type="submit"
        disabled={tx.status === "pending" || !imageUrl.trim() || !caption.trim()}
      >
        {tx.status === "pending" ? "Posting..." : "Post"}
      </button>

      {tx.status === "error" && (
        <p className="tx-msg error">
          ❌ {tx.message}{" "}
          <button type="button" className="dismiss-btn" onClick={reset}>
            Dismiss
          </button>
        </p>
      )}
    </form>
  );
}
