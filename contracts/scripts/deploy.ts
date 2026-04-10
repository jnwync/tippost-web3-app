import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const TipPost = await hre.ethers.getContractFactory("TipPost");
  const contract = await TipPost.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("TipPost deployed to:", address);
  console.log("Network:", hre.network.name);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
