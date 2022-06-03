require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {    
    avax: {
      url: process.env.AVAX_URL || "",
      accounts:
        process.env.RENTEE_PRIVATE_KEY !== undefined ? [process.env.RENTEE_PRIVATE_KEY] : [],
    },
    local: {
      url: process.env.LOCAL_URL || "",
      accounts:
        process.env.LOCAL_PRIVATE_KEY !== undefined ? [process.env.LOCAL_PRIVATE_KEY, process.env.RENTER_PRIVATE_KEY, process.env.RECIPIENT_PRIVATE_KEY] : [],
    },
  }
  
};