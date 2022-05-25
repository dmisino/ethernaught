require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");
const { ethers, waffle} = require("hardhat");

describe("E14_GatekeeperTwo", async function () {
  var gatekeeperTwo, hack, owner, user;
  before(async function() {
    [ owner, user ] = await ethers.getSigners();
    provider = waffle.provider;

    factory = await ethers.getContractFactory("GatekeeperTwo", user);
    gatekeeperTwo = await factory.deploy();
    await gatekeeperTwo.deployed();
    
    factory = await ethers.getContractFactory("GatekeeperTwo_Hack", user);
    hack = await factory.deploy(gatekeeperTwo.address);
    await hack.deployed();
  });
  it(`GatekeeperTwo hacked from hack contract constructor, entrant will = user address`, async () => {
    expect(await gatekeeperTwo.entrant()).eq(user.address);
  }); 
});