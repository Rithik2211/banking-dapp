const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying the contracts with the account:",
        await deployer.getAddress()
    );
    const Dbank = await hre.ethers.getContractFactory("Dbank");
    const dbank = await Dbank.deploy();
    await dbank.deployed();
    console.log("Dbank deployed to:", dbank.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});