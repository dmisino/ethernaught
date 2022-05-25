require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");
const { ethers, waffle} = require("hardhat");

describe("E11_Elevator", async function () {
  var owner, provider, challenge, hack;

  before(async function() {
    [ owner ] = await ethers.getSigners();
    provider = waffle.provider;

    factory = await ethers.getContractFactory("Elevator");
    challenge = await factory.deploy();
    await challenge.deployed();

    factory = await ethers.getContractFactory("Elevator_Hack");
    hack = await factory.deploy(challenge.address);
    await hack.deployed();      
  });
  it(`Deployment of challenge contract has 'top' variable equal to false`, async () => {
    expect(await challenge.top()).is.equal(false);
  });  
  it(`Successful hack sets challenge contract 'top' variable equal to true`, async () => {
    await hack.useElevator(15); // Floor we choose doesnt matter. Hack contract will indicate it is the top floor regardless.
    expect(await challenge.top()).is.equal(true);
  });
});