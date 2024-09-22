import { miningBlock } from './src/miner/mining'
import { BlockChains } from './src/blockChains'
import { MemPool } from './src/model/memPool/memPool'
import { myWallet } from './src/wallet/myWallet'
const tx = new MemPool()
const block = new BlockChains()

tx.addTransaction({
	amount: 10,
	from: '0x1',
	to: '0x2',
})
tx.addTransaction({
	amount: 100,
	from: '0x2',
	to: '0x1',
})
tx.addTransaction({
	amount: 1000,
	from: '0x1',
	to: '0x2',
})
tx.addTransaction({
	amount: 10,
	from: '0x1',
	to: '0x2',
})
tx.addTransaction({
	amount: 10,
	from: '0x1',
	to: '0x2',
})
// miningBlock(myWallet())
// console.log(block.verify())
// console.log(block.getChains())
// console.log(tx.size())
// console.log(tx.isFull())
// console.log(block.verify())
console.log(tx.getValidTransactions());