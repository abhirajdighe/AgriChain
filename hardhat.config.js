require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  settings:{
    optimizer:{
      enables:true,
      runs:200
    }
  },
  networks:{
    hardhat:{
      chainId:1337
    },
    sepolia:{
      url:`https://eth-sepolia.g.alchemy.com/v2/XOUVIjG_NhT3dKchluoo1XtlXA_f14ql`,
      accounts:["4e594aedcf2b38c0c17f2044e5f2c2ba92f5a063dfdf2c16bcd884b33bb4ad07"],
      chainId: 11155111,
    },
    goerli:{
      url:"https://goerli.infura.io/v3/57711f78905f4832b19e85c4470c973d",
      accounts:["4e594aedcf2b38c0c17f2044e5f2c2ba92f5a063dfdf2c16bcd884b33bb4ad07"],
      chainId: 5,
      gasPrice: 1000000000000,
    },
  }
};
