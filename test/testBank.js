const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Dbank", function () {
  let Dbank, dbank, owner, addr1, addr2;
  beforeEach(async function () {
    Dbank = await ethers.getContractFactory("Dbank");
    dbank = await Dbank.deploy();
    await dbank.deployed();
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it("should deposit money", async function () {
    const depositAmount = ethers.utils.parseEther("1");
    await dbank.connect(addr1).DepositMoney("Test Deposit", {
      value: depositAmount,
    });
    const balance = await dbank.connect(addr1).checkBalance();
    expect(balance.toString()).to.equal(depositAmount.toString());
  });

  it("should request withdraw money and claim", async function () {
    const depositAmount = ethers.utils.parseEther("1");
    await dbank.connect(addr1).DepositMoney("Test Deposit", {
      value: depositAmount,
    });
    const withdrawAmount = ethers.utils.parseEther("0.5");
    await dbank.connect(addr1).Reqwithdraw(withdrawAmount);
    const pending = await dbank.pendingPayments(addr1.address);
    expect(pending.isPending).to.equal(true);
  });
  it("should claim the pending withdrwal", async function () {
    const withdrawAmount = ethers.utils.parseEther("0.5");
    const depositAmount = ethers.utils.parseEther("1");
    await dbank.connect(addr1).DepositMoney(" test depoist", {
      value: depositAmount,
    });
    await dbank.connect(addr1).Reqwithdraw(withdrawAmount);

    await ethers.provider.send("evm_increaseTime", [60]);
    await ethers.provider.send("evm_mine", []);
    const balanceBefore = await ethers.provider.getBalance(addr1.address);
    const tx = await dbank.connect(addr1).claimWithdraw();
    const receipt = await tx.wait();

    const balanceAfter = await ethers.provider.getBalance(addr1.address);
    expect(balanceAfter).to.be.gt(
      balanceBefore.sub(receipt.gasUsed.mul(tx.gasPrice))
    ); // After gas
    const pending = await dbank.pendingPayments(addr1.address);
    expect(pending.isPending).to.equal(false);
  });

  it("should transfer and optimize gas", async function () {
    const depositAmount = ethers.utils.parseEther("1");
    const transferAmount = ethers.utils.parseEther("0.5");

    // Deposit money for addr1
    await dbank.connect(addr1).DepositMoney("Test Deposit", {
      value: depositAmount,
    });

    // Get initial balances
    const initialSenderBalance = await dbank.connect(addr1).checkBalance();
    const initialReceiverBalance = await dbank.connect(addr2).checkBalance();

    // Transfer
    const tx = await dbank
      .connect(addr1)
      .TransferMoney(transferAmount, addr2.address);
    const receipt = await tx.wait();

    // Check gas usage
    expect(receipt.gasUsed.toNumber()).to.be.below(150000);

    // Check final balances
    const finalSenderBalance = await dbank.connect(addr1).checkBalance();
    const finalReceiverBalance = await dbank.connect(addr2).checkBalance();

    expect(finalSenderBalance.toString()).to.equal(
      initialSenderBalance.sub(transferAmount).toString()
    );
    expect(finalReceiverBalance.toString()).to.equal(
      initialReceiverBalance.add(transferAmount).toString()
    );
  });
});

/**
 describe("Dbank",function(){

 beforEach(async function(){
  const Dbank= await ethers.getContractFactory("dbank");
  const dbank=Dbank.deploy();
  await dbank.deployed();
 })
 it"shopuld deposit money,async()=>{
 const depositMoney= ethers.utilis.pasrseEther("1");
  await dbank.connect(dadd1).DepositMoney("test deo",{
  value:depositMoney})
  const balance= await dbank.connect(addr1).checkBalance();
  expect (balance.toString()).to.equal(depositMoney.toString());
  })
 
 })
 

 *  */
