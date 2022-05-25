require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");
const { ethers, waffle} = require("hardhat");

describe("E21_Shop", async function () {
  var shop, hack
  before(async function() {
    [ owner ] = await ethers.getSigners();
    provider = waffle.provider;

    factory = await ethers.getContractFactory("Shop");
    shop = await factory.deploy();
    await shop.deployed();

    factory = await ethers.getContractFactory("Shop_Hack");
    hack = await factory.deploy(shop.address);
    await hack.deployed();      
  });  
  it(`Shop contract deployed with isSold = false and price = 100`, async () => {
    expect(await shop.isSold()).eq(false);
    expect(await shop.price()).eq(100);
  });
  it(`Successful hack has shop contract with isSold = true and price < 100`, async () => {
    await hack.buy();
    expect(await shop.isSold()).eq(true);
    expect(await shop.price()).lt(100);
  });  
});