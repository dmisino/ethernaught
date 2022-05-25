require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");
const { ethers, waffle} = require("hardhat");

describe("E08_Vault", async function () {
  var owner, provider, challenge;

  before(async function() {
    [ owner ] = await ethers.getSigners();
    provider = waffle.provider;

    let _password = ethers.utils.formatBytes32String ('super_secure_password');
    factory = await ethers.getContractFactory("Vault");
    challenge = await factory.deploy(_password);
    await challenge.deployed();    
  });
  it(`Deployment of challenge contract starts with locked = true`, async () => {
    expect(await challenge.locked()).is.equal(true);
  });
  it(`Successful hack has challenge contract locked = false`, async () => {
    let _password = await ethers.provider.getStorageAt(challenge.address, 1);
    await challenge.unlock(_password);
    expect(await challenge.locked()).is.equal(false);
  });  
});