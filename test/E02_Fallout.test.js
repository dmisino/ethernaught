require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");

describe("E02_Fallout", async function () {
  var owner, factory, challenge, hack;
  const challengeStartBal = 0.001;

  before(async function() {
    [ owner ] = await ethers.getSigners();
    provider = waffle.provider;

    factory = await ethers.getContractFactory("Fallout");
    challenge = await factory.deploy();
    await challenge.deployed();

    factory = await ethers.getContractFactory("Fallout_Hack");
    hack = await factory.deploy(challenge.address);
    await hack.deployed();

    // Send some ETH to challenge contract (represents other peoples deposits)
    const params = { value: ethers.utils.parseEther(challengeStartBal.toString())};
    // We need to use the misnamed payable constructor to send money to the challenge contract
    challenge.Fal1out(params);
  });
  it(`Deployment of challenge contract has owner equal to deployer address`, async () => {
    expect(await challenge.owner()).to.equal(owner.address);
  });
  it(`Deployment of challenge contract will have a balance = ${challengeStartBal} ETH`, async () => {
    let challengeBal = await provider.getBalance(challenge.address);
    expect(challengeBal).eq(ethers.utils.parseEther(challengeStartBal.toString()));
  });  
  it(`Successfull hack makes hack contract address the new challenge contract owner`, async () => {
    await hack.takeOwnershipAndCollect();
    expect(await challenge.owner()).to.be.equal(hack.address);
  });
  it(`Successfull hack depletes challenge contract balance to 0`, async () => {
    let challengeBal = ethers.BigNumber.from(await provider.getBalance(challenge.address));
    expect(challengeBal).eq(0);
  });  
});