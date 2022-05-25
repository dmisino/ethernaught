require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");
const { ethers, waffle} = require("hardhat");

describe("E10_Reentrance", async function () {
  var owner, provider, challenge, hack;
  const challengeStartBal = 0.125;
  const hackDepositAmount = 0.01;
  
  before(async function() {
    [ owner ] = await ethers.getSigners();
    provider = waffle.provider;

    factory = await ethers.getContractFactory("Reentrance");
    challenge = await factory.deploy();
    await challenge.deployed();

    factory = await ethers.getContractFactory("Reentrance_Hack");
    hack = await factory.deploy(challenge.address);
    await hack.deployed(); 

    // Send some ETH to hack contract (represents other peoples deposits)
    const params = { to: challenge.address, value: ethers.utils.parseEther(challengeStartBal.toString())};
    await owner.sendTransaction(params);        
  });
  it(`Deployment of challenge contract starts with a balance of ${challengeStartBal} ETH`, async () => {
    let challengeBal = ethers.BigNumber.from(await provider.getBalance(challenge.address));
    expect(challengeBal).eq(ethers.utils.parseEther(challengeStartBal.toString()));
  });
  it(`After deposit to challenge contract, balance is ${challengeStartBal + hackDepositAmount} ETH`, async () => {
     // Deposit to Reentrance contract
    const params = { value: ethers.utils.parseEther(hackDepositAmount.toString())};
    await hack.deposit(params);
    let challengeBal = ethers.BigNumber.from(await provider.getBalance(challenge.address));
    let challengeBalAfterDeposit = challengeStartBal + hackDepositAmount;
    expect(challengeBal).eq(ethers.utils.parseEther(challengeBalAfterDeposit.toString()));
  });
  it("After hack, challenge contract balance is 0", async () => {
    await hack.drainContract();
    let challengeBal = ethers.BigNumber.from(await provider.getBalance(challenge.address));
    expect(challengeBal).eq(0);
  });
});