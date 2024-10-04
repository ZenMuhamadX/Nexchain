import { decode } from 'msgpack-lite'
import { getAllBlock } from './block/query/direct/getAllBlock'
import { leveldb } from './leveldb/init'
import { getBalance } from './wallet/balance/getBalance'
import { myWalletAddress } from './wallet/myWalletAddress'

getBalance(myWalletAddress()).then((balance) => {
	console.log('balance', balance)
})
