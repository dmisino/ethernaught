require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");
const { ethers, waffle} = require("hardhat");

describe("E13_GatekeeperOne", async function () {
  var gatekeeperOne, hack, owner, user;
  before(async function() {
    [ owner, user ] = await ethers.getSigners();
    provider = waffle.provider;

    factory = await ethers.getContractFactory("GatekeeperOne");
    gatekeeperOne = await factory.deploy();
    await gatekeeperOne.deployed();
    
    factory = await ethers.getContractFactory("GatekeeperOne_Hack", user);
    hack = await factory.deploy(gatekeeperOne.address);
    await hack.deployed();
  });  
  it(`GatekeeperOne contract deployed with entrant not equal to user address`, async () => {
    expect(await gatekeeperOne.entrant()).does.not.eq(user.address);
  });  
  it(`Successfull hack now has GatekeeperOne contract entrant = user address`, async () => {
    await hack.setGateKey();
    const baseGas = 819100;
    for(let i = 240; i < 400; i++) {
      await hack.registerAsEntrant(baseGas + i);
    }
    expect(await gatekeeperOne.entrant()).eq(user.address);
  });
});