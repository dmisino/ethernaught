require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");
const { ethers, waffle} = require("hardhat");

describe("E15_NaughtCoin", async function () {
  var challenge, owner, user;

  before(async function() {
    [ owner, user ] = await ethers.getSigners();

    factory = await ethers.getContractFactory("NaughtCoin");
    challenge = await factory.deploy(owner.address);
    await challenge.deployed();
  });
  it(`Deployment of challenge contract has owner coin balance > 0`, async () => {
    expect(await challenge.balanceOf(owner.address)).gt(0);
  });  
  it(`Successful hack has owner coin balance = 0`, async () => {
    await challenge.approve(owner.address, await challenge.balanceOf(owner.address));
    await challenge.transferFrom(owner.address, user.address, challenge.balanceOf(owner.address));
    expect(await challenge.balanceOf(owner.address)).eq(0);
  });
});