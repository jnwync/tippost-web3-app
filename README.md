# TipPost — Web3 dApp

A pay-to-like social platform on Ethereum (Sepolia testnet). Post images with captions; tip creators 0.0001 ETH per like.

## Stack
- **Contract**: Solidity ^0.8.20, Hardhat + TypeScript
- **Frontend**: React + Vite + TypeScript, ethers.js v6
- **Wallet**: MetaMask
- **Network**: Sepolia testnet (chainId 11155111)
- **Hosting**: Vercel

## Deployed Links
- **Live URL**: _coming soon_
- **Sepolia Contract**: _coming soon_
- **Etherscan**: _coming soon_

## Local Setup

### Prerequisites
- Node.js 18+
- MetaMask browser extension
- Sepolia ETH (free from faucets below)

### Contracts
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env       # fill in VITE_CONTRACT_ADDRESS and VITE_CHAIN_ID
npm run dev                # http://localhost:5173
```

## Environment Variables

**`contracts/.env`** (never commit):
```
SEPOLIA_RPC_URL=
PRIVATE_KEY=
ETHERSCAN_API_KEY=
```

**`frontend/.env`** (never commit):
```
VITE_CONTRACT_ADDRESS=
VITE_CHAIN_ID=11155111
```

## Sepolia ETH Faucets
- https://cloud.google.com/application/web3/faucet/ethereum/sepolia
- https://faucet.quicknode.com/ethereum/sepolia
- https://www.infura.io/faucet/sepolia

## Security
- Never commit `.env` files or private keys
- Use a dedicated dev wallet — never your main wallet
- `.env` files are listed in `.gitignore`
