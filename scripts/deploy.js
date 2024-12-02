const hre = require("hardhat");

async function main() {
  const Dbank = await hre.ethers.getContractFactory("Dbank");
  const dbank = await Dbank.deploy();
  await dbank.waitForDeployment();
  const dbankAddress = await dbank.getAddress();
  console.log("Dbank deployed to:", dbankAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});