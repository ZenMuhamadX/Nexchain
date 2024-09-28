import { getDataTransaction } from './src/leveldb/query/transaction/getData'
import { BlockChains } from './src/blockChains'
import { myWalletAddress } from './src/wallet/myWalletAddress'
import { MemPool } from './src/model/memPool/memPool'
import { getBalance } from './src/wallet/balance/getBalance'
import { putNewWallet } from './src/wallet/balance/putNewWallet'
import { leveldb } from './src/leveldb/init'
const x = new MemPool()
const y = new BlockChains()

// x.addTransaction({ amount: 1000, from: myWalletAddress(), to: 'x' })
// x.addTransaction({ amount: 100, from: myWalletAddress(), to: 'x' })
// x.addTransaction({ amount: 19, from: myWalletAddress(), to: 'x' })
// x.addTransaction({ amount: 18, from: myWalletAddress(), to: 'x' })
// x.addTransaction({ amount: 17, from: myWalletAddress(), to: 'x' })
// x.addTransaction({ amount: 16, from: myWalletAddress(), to: 'x' })
// x.addTransaction({ amount: 1, from: myWalletAddress(), to: 'x' })
// x.addTransaction({ amount: 5, from: myWalletAddress(), to: 'x' })
// x.addTransaction({ amount: 4, from: myWalletAddress(), to: 'x' })
// x.addTransaction({ amount: 3, from: myWalletAddress(), to: 'x' })
// x.addTransaction({ amount: 2, from: myWalletAddress(), to: 'x' })
// y.getLatestBlockJSON()
// putNewWallet(myWalletAddress())
// getBalance(myWalletAddress()).then(console.log)