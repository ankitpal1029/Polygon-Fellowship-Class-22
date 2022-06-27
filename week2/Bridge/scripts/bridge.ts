// main.js
import { POSClient, use } from "@maticnetwork/maticjs";
import { Web3ClientPlugin } from "@maticnetwork/maticjs-web3";
import HDWalletProvider from "@truffle/hdwallet-provider";
import * as dotenv from "dotenv";

use(Web3ClientPlugin);
dotenv.config();

const { seed, mumbai, privateKey } = process.env;

const from = "0x657D3C03e450E4815f3411Aa26713A2A90e9Ad83";
const rootToken = "0x0452C7447925ACEB30c0B888f5B0856D1e206101";
const childToken = "0x634063e87476fcf8ae78f04225329043daf2b015";
const amount = 999 * 10 ** 18;

const parentProvider = new HDWalletProvider({
  mnemonic: {
    phrase: seed as string,
  },
  providerOrUrl: "http://127.0.0.1:8545",
});

const maticProvider = new HDWalletProvider({
  mnemonic: {
    phrase: seed as string,
  },
  providerOrUrl: mumbai,
});

const maticPOSClient = new POSClient();

maticPOSClient.init({
  network: "testnet",
  version: "mumbai",
  parent: {
    provider: parentProvider,
    defaultConfig: {
      from: from,
    },
  },
  child: {
    provider: maticProvider,
    defaultConfig: {
      from: from,
    },
  },
});

const approve = async () => {
  const erc20RootToken = maticPOSClient.erc20(rootToken, true);
  const approveResult = await erc20RootToken.approve(100);
  const txHash = await approveResult.getTransactionHash();
  const txReceipt = await approveResult.getReceipt();

  console.log("========APPROVE FUNCTION=============");
  console.log(approveResult);
  console.log(txHash);
  console.log(txReceipt);
};

const deposit = async () => {
  const erc20RootToken = maticPOSClient.erc20(rootToken, true);

  //deposit 100 to user address
  const result = await erc20RootToken.deposit(10, from);
  const txHash = await result.getTransactionHash();
  const txReceipt = await result.getReceipt();

  console.log("========DEPOSIT FUNCTION=============");
  console.log(result);
  console.log(txHash);
  console.log(txReceipt);
};

const withdraw = async () => {
  const erc20Token = maticPOSClient.erc20(childToken);

  // start withdraw process for 100 amount
  const result = await erc20Token.withdrawStart(100);
  const txHash = await result.getTransactionHash();
  const txReceipt = await result.getReceipt();

  console.log("========WITHDRAW FUNCTION=============");
  console.log(result);
  console.log(txHash);
  console.log(txReceipt);
};

(async () => {
  console.log("waiting for transaction");
  await approve();
  await deposit();
  //   await withdraw();
  console.log("Bridging done");
})();
