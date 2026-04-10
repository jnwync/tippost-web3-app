import fs from "fs";
import path from "path";

const src = path.resolve(
  __dirname,
  "../artifacts/contracts/TipPost.sol/TipPost.json"
);
const destDir = path.resolve(__dirname, "../../frontend/src/abi");
const dest = path.join(destDir, "TipPost.json");

if (!fs.existsSync(src)) {
  console.error("Artifact not found. Run: npx hardhat compile");
  process.exit(1);
}

fs.mkdirSync(destDir, { recursive: true });

const artifact = JSON.parse(fs.readFileSync(src, "utf8"));

if (!Array.isArray(artifact.abi) || artifact.abi.length === 0) {
  console.error("Artifact ABI is missing or empty. Re-run: npx hardhat compile");
  process.exit(1);
}

// Only commit the ABI array, not bytecode or other compiler output
fs.writeFileSync(dest, JSON.stringify({ abi: artifact.abi }, null, 2));

console.log("ABI copied to", dest);
