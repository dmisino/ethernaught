require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");
const { ethers, waffle} = require("hardhat");

describe("E07_Force", async function () {
  var owner, provider, factory, challenge, hack;
  before(async function() {
    [ owner ] = await ethers.getSigners();
    provider = waffle.provider;

    factory = await ethers.getContractFactory("Force");
    challenge = await factory.deploy();
    await challenge.deployed();

    factory = await ethers.getContractFactory("Force_Hack");
    hack = await factory.deploy(challenge.address);
    await hack.deployed();
    // Send some ETH to hack contract
    const params = { to: hack.address, value: ethers.utils.parseUnits("0.01", "ether")};
    await owner.sendTransaction(params);    
  });
  it("Deployment of challenge contract has zero balance", async () => {
    let challengeBal = ethers.BigNumber.from(await provider.getBalance(challenge.address));
    expect(challengeBal).eq(0);
  });
  it("Deployment of hack contract with balance > 0", async () => {
    let hackBal = ethers.BigNumber.from(await provider.getBalance(hack.address));
    expect(hackBal).gt(0);
  });  
  it("Successfull hack gives challenge contract a balance > 0", async () => {
    await hack.die();
    let challengeBal = ethers.BigNumber.from(await provider.getBalance(challenge.address));
    expect(challengeBal).gt(0);  
  });
});