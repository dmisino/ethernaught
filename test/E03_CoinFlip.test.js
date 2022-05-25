require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");

describe("E03_CoinFlip", async function () {
  var owner, factory, challenge, hack;

  before(async function() {
    [ owner ] = await ethers.getSigners();

    factory = await ethers.getContractFactory("CoinFlip");
    challenge = await factory.deploy();
    await challenge.deployed();

    factory = await ethers.getContractFactory("CoinFlip_Hack");
    hack = await factory.deploy(challenge.address);
    await hack.deployed();
  });
  it(`Deployment of challenge contract has consecutiveWins equal to 0`, async () => {
    expect(await challenge.consecutiveWins()).to.equal(0);
  });
  it(`Successfull hack has challenge contract consecutiveWins equal to 10`, async () => {
    for(i=0;i<10;i++) {
      await hack.runFlip();
    }
    expect(await challenge.consecutiveWins()).to.equal(10);
  }); 
});