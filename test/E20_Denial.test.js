require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");
const { ethers, waffle} = require("hardhat");

describe("E20_Denial", async function () {
  var startingOwnerBalGas, denialGas, hackGas;
  var startingOwnerBalReentrancy, denialReentrancy, hackReentrancy;
  var factory, params;
  before(async function() {
    [ ownerGas, ownerReentrance ] = await ethers.getSigners();
    provider = waffle.provider;

    // Deploy contracts twice to test both attacks

    // Gas **********************************
    factory = await ethers.getContractFactory("Denial", ownerGas);
    denialGas = await factory.deploy();
    await denialGas.deployed();

    // Send some ETH
    params = { to: denialGas.address, value: ethers.utils.parseUnits("100", "ether")};
    await ownerGas.sendTransaction(params); 
    startingOwnerBalGas = ethers.BigNumber.from(await provider.getBalance(ownerGas.address));

    // Hack contract
    factory = await ethers.getContractFactory("Denial_Hack");
    hackGas = await factory.deploy(denialGas.address, false);
    await hackGas.deployed();

    // Reentrancy ***************************
    factory = await ethers.getContractFactory("Denial", ownerReentrance);
    denialReentrancy = await factory.deploy();
    await denialReentrancy.deployed();

    // Send some ETH
    params = { to: denialReentrancy.address, value: ethers.utils.parseUnits("100", "ether")};
    await ownerReentrance.sendTransaction(params); 
    startingOwnerBalReentrancy = ethers.BigNumber.from(await provider.getBalance(ownerReentrance.address));

    // Hack contract
    factory = await ethers.getContractFactory("Denial_Hack");
    hackReentrancy = await factory.deploy(denialReentrancy.address, true);
    await hackReentrancy.deployed();
  });  
  it(`Denial contract instances deployed with 100 ETH`, async () => {
    let denialBalGas = ethers.BigNumber.from(await provider.getBalance(denialGas.address));
    expect(denialBalGas).eq(ethers.utils.parseUnits("100", "ether"));
    let denialBalReentrancy = ethers.BigNumber.from(await provider.getBalance(denialReentrancy.address));
    expect(denialBalReentrancy).eq(ethers.utils.parseUnits("100", "ether"));    
  });
  it(`Successfull gas burn hack prevents owner payment`, async () => {
    //let challengeBal = ethers.BigNumber.from(await provider.getBalance(challenge.address));
    //console.log(`challengeBal = ${challengeBal}`);

    await hackGas.initiatePayout();

    //challengeBal = ethers.BigNumber.from(await provider.getBalance(challenge.address));
    //console.log(`challengeBal = ${challengeBal}`);

    let ownerBal = ethers.BigNumber.from(await provider.getBalance(ownerGas.address));
    expect(ownerBal).eq(startingOwnerBal);
  });
  it(`Successfull reentrancy hack prevents owner payment`, async () => {
    //let challengeBal = ethers.BigNumber.from(await provider.getBalance(challenge.address));
    //console.log(`challengeBal = ${challengeBal}`);

    await hackReentrancy.initiatePayout();

    //challengeBal = ethers.BigNumber.from(await provider.getBalance(challenge.address));
    //console.log(`challengeBal = ${challengeBal}`);

    let ownerBal = ethers.BigNumber.from(await provider.getBalance(ownerReentrance.address));
    expect(ownerBal).eq(startingOwnerBal);
  });  
});