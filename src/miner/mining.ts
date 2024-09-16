/** @format */

import { BlockChains } from '../blockChains'
import { memPool } from '../model/memPool/memPool'
import { generateTimestampz } from '../lib/timestamp/generateTimestampz'
import { loggingErr } from '../logging/errorLog'
import { mineLog } from '../logging/mineLog'
import { createWalletAddress } from '../lib/wallet/createWallet'

const chain = new BlockChains()
const pool = new memPool()

export const miningBlock = (addres: string) => {
	const transaction = pool.getTransaction()
	try {
		if (!transaction.length) {
			loggingErr({
				error: 'No pending block to mine',
				time: generateTimestampz(),
				warning: null,
				stack: new Error().stack,
			})
			return
		}
		const succesMine = chain.addBlockToChain(pool, createWalletAddress())
		if (succesMine) {
			mineLog({
				difficulty: 5,
				hash: chain.getLatestBlock()?.blk.header.hash,
				mined_at: generateTimestampz(),
				nonce: chain.getLatestBlock()?.blk.header.nonce,
				miner: addres,
			})
		}
	} catch (error) {
		loggingErr({
			error: error,
			time: generateTimestampz(),
			stack: new Error().stack,
		})
	}
}
