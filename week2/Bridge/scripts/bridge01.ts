require("dotenv").config();
const { POSClient, use } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-ethers");
import { providers, Wallet } from "ethers";

const mumbaiApi = process.env.mumbaiApi;
const goerliApi = process.env.goerliApi;
const privateKey = process.env.privateKey;

use(Web3ClientPlugin);

const from = process.env.from;
const rootToken = process.env.rootToken;
const amount = 100 * 10 ** 18;

const parentProvider = new providers.JsonRpcProvider(goerliApi);
const maticProvider = new providers.JsonRpcProvider(mumbaiApi);

const posClient = new POSClient();

(async () => {
  console.log("started execution?");
  await posClient.init({
    network: "testnet",
    version: "mumbai",
    parent: {
      provider: new Wallet(privateKey as string, parentProvider),
      defaultConfig: {
        from: from,
      },
    },
    child: {
      provider: new Wallet(privateKey as string, maticProvider),
      defaultConfig: {
        from: from,
      },
    },
  });

  const parentERC20Token = posClient.erc20(rootToken, true);

  try {
    console.log("Trying to approve ");
    const approveResult = await parentERC20Token.approve(amount.toString(), {
      from,
    });
    const approveTxHash = await approveResult.getTransactionHash();
    const approveTxReceipt = await approveResult.getReceipt();
    console.log(approveResult);

    const depositResult = await parentERC20Token.deposit(
      amount.toString(),
      from,
      { from }
    );
    const depositTxHash = await depositResult.getTransactionHash();
    const depositTxReceipt = await depositResult.getReceipt();
    console.log(depositResult);
  } catch (err) {
    console.log(err);
  }
})();
