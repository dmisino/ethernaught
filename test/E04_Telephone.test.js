require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");

describe("E04_Telephone", async function () {
  var owner, factory, challenge, hack;

  before(async function() {
    [ owner, user ] = await ethers.getSigners();

    factory = await ethers.getContractFactory("Telephone");
    challenge = await factory.deploy();
    await challenge.deployed();

    factory = await ethers.getContractFactory("Telephone_Hack", user);
    hack = await factory.deploy(challenge.address);
    await hack.deployed();
  });
  it(`Deployment of challenge contract has owner equal to deployer address`, async () => {
    expect(await challenge.owner()).to.equal(owner.address);
  });
  it(`Successfull hack changes challenge contract owner to new address`, async () => {
    await hack.changeOwner();
    expect(await challenge.owner()).to.be.equal(user.address);
  });
});