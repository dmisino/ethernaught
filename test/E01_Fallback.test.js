require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");

describe("E01_Fallback", async function () {
  var owner, factory, challenge, hack;

  before(async function() {
    [owner] = await ethers.getSigners();

    factory = await ethers.getContractFactory("Fallback");
    challenge = await factory.deploy();
    await challenge.deployed();

    factory = await ethers.getContractFactory("Fallback_Hack");
    hack = await factory.deploy(challenge.address);
    await hack.deployed();
  });
  it(`Deployment of challenge contract has owner equal to deployer address`, async () => {
    expect(await challenge.owner()).to.equal(owner.address);
  });
  it(`Successfull hack makes hack contract address the new challenge contract owner`, async () => {
    const params = { value: ethers.utils.parseEther('0.00001')};
    await hack.contribute(params);
    await hack.takeOwnership(params);
    expect(await challenge.owner()).to.be.equal(hack.address);
  });
});