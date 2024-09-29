import { getAllBlock } from './block/getAllBlock'
// import { getLatestBlock } from './block/getLatestBlock'
// import { miningBlock } from './miner/mining'
import { getBalance } from './wallet/balance/getBalance';
// import { createTransact } from './transaction/createTransact'
import { myWalletAddress } from './wallet/myWalletAddress'
// import { generateTimestampz } from './lib/timestamp/generateTimestampz';

// import { myWalletAddress } from "./wallet/myWalletAddress";

// createTransact({ amount: 100, from: myWalletAddress(), to: 'xxx' })
// createTransact({ amount: 100, from: myWalletAddress(), to: 'xxxx' })
// miningBlock(myWalletAddress())
console.log(getAllBlock(true));

getBalance(myWalletAddress()).then(console.log)