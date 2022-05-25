require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");
const { ethers, waffle} = require("hardhat");

describe("E19_AlienCodex", async function () {
  var challenge, hack, owner, user;

  before(async function() {
    [ owner, user ] = await ethers.getSigners();

    factory = await ethers.getContractFactory("AlienCodex");
    challenge = await factory.deploy();
    await challenge.deployed();

    factory = await ethers.getContractFactory("AlienCodex_Hack");
    hack = await factory.deploy(challenge.address);
    await hack.deployed();
  });
  it(`Deployment of challenge contract has owner set to deployer address`, async () => {
    expect(await challenge.owner()).is.equal(owner.address);
  });  
  it(`Successful hack has owner updated to user address`, async () => {
    await hack.takeOwnership(user.address);
    expect(await challenge.owner()).is.equal(user.address);
  });
});