require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");
const { ethers, waffle} = require("hardhat");

describe("E12_Privacy", async function () {
  var provider, challenge, hack;

  before(async function() {
    provider = waffle.provider;

    factory = await ethers.getContractFactory("Privacy");
    // Create sample bytes32[3] data containing password    
    const data1 = ethers.utils.formatBytes32String ('super_secure_data_1');
    const data2 = ethers.utils.formatBytes32String ('super_secure_data_2');
    const data3 = ethers.utils.formatBytes32String ('super_secure_data_3');
    challenge = await factory.deploy([data1,data2,data3]);
    await challenge.deployed();
    
    factory = await ethers.getContractFactory("Privacy_Hack");
    hack = await factory.deploy(challenge.address);
    await hack.deployed();      
  });
  it(`Deployment of challenge contract has 'locked' variable equal to true`, async () => {
    expect(await challenge.locked()).is.equal(true);
  });  
  it(`Successful hack sets challenge contract 'locked' variable equal to false`, async () => {
    await hack.unlock(ethers.provider.getStorageAt(challenge.address, 5));
    expect(await challenge.locked()).is.equal(false);
  });
});