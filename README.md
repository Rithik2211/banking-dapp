# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

Use for the Deployments for Contracts : 
# 1. Install dependencies if you haven't
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv

# 2. Compile your contracts
npx hardhat compile

# 3. Run tests if you have them
npx hardhat test

# 4. Deploy
npx hardhat run scripts/deploy.js --network your_network

# 5. Verify contract (for testnets/mainnet)
npx hardhat verify --network your_network YOUR_CONTRACT_ADDRESS
