const { ethers } = require("hardhat");

async function main() {
  const FarmProductTracking = await ethers.getContractFactory("FarmProductTracking");
  const farmProductTracking = await FarmProductTracking.deploy();
  console.log("Contract deployed to:", farmProductTracking.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });