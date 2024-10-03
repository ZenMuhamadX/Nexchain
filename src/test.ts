import { miningBlock } from './miner/mining'
import { createTransact } from './transaction/createTransact'
import { myWalletAddress } from './wallet/myWalletAddress'

// createTransact({ amount: 10, from: myWalletAddress(), to: 'x' })
miningBlock(myWalletAddress())