import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

// Validate required env vars when targeting Sepolia
if (process.env.npm_lifecycle_event?.includes("sepolia")) {
  if (!process.env.SEPOLIA_RPC_URL) throw new Error("Missing SEPOLIA_RPC_URL in .env");
  if (!process.env.PRIVATE_KEY) throw new Error("Missing PRIVATE_KEY in .env");
}

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
};

export default config;
