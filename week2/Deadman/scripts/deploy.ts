// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

const main = async () => {
  const deadmanFactory = ethers.getContractFactory("Switch");
  const deadmanContract = (await deadmanFactory).deploy(
    "0x6b531D03dEF4d25e3fc300b88c032a1f620D22B0"
  );
  console.log(`Contract deployed to: ${(await deadmanContract).address}`);
};
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
