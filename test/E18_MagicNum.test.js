require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");
const { ethers, waffle} = require("hardhat");

describe("E18_MagicNum", async function () {
  var magicNum, hack, owner, user;
  before(async function() {
    [ owner ] = await ethers.getSigners();
  });
  it(`Solver contract returns correct answer`, async () => {
    const bytecode =  "600a80600e600039806000f350fe602a60005260206000f3";
    const interface = ["function whatIsTheMeaningOfLife() returns (uint)"];
    const solverFactory = new ethers.ContractFactory(interface, bytecode, owner);
    const solver = await solverFactory.deploy();
    await solver.deployed();
    expect(await solver.callStatic.whatIsTheMeaningOfLife()).to.equal(42);    
  });
});