const { ethers } = require("ethers");
const {
  abi: UniswapV3Factory,
} = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json");
require("dotenv").config();
const mumbaiApi = process.env.mumbaiApi;

const address0 = "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa";
const address1 = "0x634063e87476fcf8ae78f04225329043daf2b015";
const factoryAddress = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(mumbaiApi as string);

  const factoryContract = new ethers.Contract(
    factoryAddress,
    UniswapV3Factory,
    provider
  );

  const poolAddress = await factoryContract.getPool(address0, address1, 500);
  console.log("poolAddress", poolAddress);
}

main();
