export function parseEthersError(err: unknown): string {
  if (err === null || typeof err !== "object") return "An unknown error occurred.";

  const e = err as Record<string, unknown>;

  // User rejected in MetaMask
  if (e["code"] === 4001 || e["code"] === "ACTION_REJECTED") {
    return "Transaction rejected in MetaMask.";
  }

  // Contract revert with a reason string
  if (typeof e["reason"] === "string" && e["reason"]) {
    return `Transaction failed: ${e["reason"]}`;
  }

  // ethers v6 short message
  if (typeof e["shortMessage"] === "string" && e["shortMessage"]) {
    return e["shortMessage"];
  }

  // Generic fallback
  if (typeof e["message"] === "string" && e["message"]) {
    return e["message"];
  }

  return "An unknown error occurred.";
}
