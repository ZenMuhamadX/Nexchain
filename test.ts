import { getBalance } from './src/wallet/balance/getBalance';
import { miningBlock } from './src/miner/mining'
import { BlockChains } from './src/blockChains'
import { MemPool } from './src/model/memPool/memPool'
import { myWalletAddress } from './src/wallet/myWalletAddress';
const tx = new MemPool()
const block = new BlockChains()
// miningBlock(myWallet())
// console.log(block.verify())
// console.log(block.getChains())
console.log(block.getLatestBlockJSON());
// console.log(tx.size())
// console.log(tx.isFull())
// console.log(block.verify())
// console.log(tx.getValidTransactions());
getBalance(myWalletAddress()).then(res => {
    console.log(res)
})