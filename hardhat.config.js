require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      blockGasLimit: 30000000, // 30000000 is default
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.5.0"
      },
      {
        version: "0.6.0"
      },
      {
        version: "0.6.12"
      },      
      {
        version: "0.7.3"
      },
      {
        version: "0.8.3"
      }
    ]
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    tests: "./test",
  }
};
