import { expect, assert } from "chai";
// import { assert } from "console";
import { ethers, network } from "hardhat";

const deploy = async () => {
  const [owner, fallback, usurper, randomFunder] = await ethers.getSigners();
  let ownerFactory = await ethers.getContractFactory("Switch", owner);
  const ownerContract = await ownerFactory.deploy(fallback.address);
  await ownerContract.deployed();

  let usurperFactory = await ethers.getContractFactory("Switch", owner);
  const usurperContract = await usurperFactory.deploy(fallback.address);
  await usurperContract.deployed();

  let fallbackFactory = await ethers.getContractFactory("Switch", owner);
  const fallbackContract = await fallbackFactory.deploy(fallback.address);
  await fallbackContract.deployed();

  return {
    owner,
    fallback,
    usurper,
    ownerContract,
    usurperContract,
    fallbackContract,
    randomFunder,
  };
};

it("Should deploy contract locally", async () => {
  const signers = await ethers.getSigners();
  const contractFactory = await ethers.getContractFactory("Switch");
  const contract = await contractFactory.deploy(signers[0].address);
  await contract.deployed();
});

it("Should fail when usurper calls trigger before 10 blocks since still_alive ", async () => {
  const { ownerContract, usurperContract } = await deploy();
  // const latestBlock = await ethers.provider.getBlock("latest");

  await ownerContract.still_alive();
  // console.log("Block Number: ", latestBlock.number);
  await network.provider.send("hardhat_mine", ["0x5"]);
  await expect(usurperContract.trigger()).to.be.revertedWith(
    "VM Exception while processing transaction: reverted with custom error 'TheGuyIsntDeadYetJeez()'"
  );
  // const response = await usurperContract.trigger();
  // const blockLater = await ethers.provider.getBlock("latest");
  // console.log("Block Number: ", blockLater.number);
});

it("Should transfer funds to fallback after 10 blocks of still_alive not being called", async () => {
  const {
    owner,
    fallback,
    usurper,
    ownerContract,
    usurperContract,
    fallbackContract,
    randomFunder,
  } = await deploy();

  await randomFunder.sendTransaction({
    to: ownerContract.address,
    value: 100,
  });
  const fallBackInitBalance = await ethers.provider.getBalance(
    fallback.address
  );

  expect(await ethers.provider.getBalance(ownerContract.address)).to.equal(100);
  await ownerContract.still_alive();
  await network.provider.send("hardhat_mine", ["0xA"]);
  await ownerContract.trigger();
  expect(await ethers.provider.getBalance(fallback.address)).to.equal(
    fallBackInitBalance.add(100)
  );
});
