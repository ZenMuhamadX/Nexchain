/** @format */

import { BlockChains } from '../blockChains'
import { MemPool } from '../model/memPool/memPool'
import { generateTimestampz } from '../lib/timestamp/generateTimestampz'
import { loggingErr } from '../logging/errorLog'
import { mineLog } from '../logging/mineLog'

// Function to mine a block and add it to the blockchain
export const miningBlock = (address: string): void => {
	// Initialize blockchain and memory pool instances
	const chain = new BlockChains()
	const pool = new MemPool()
	const transactions = pool.getValidTransactions()
	console.log(transactions)

	try {
		// Check if there are pending transactions to mine
		if (!transactions.length) {
			loggingErr({
				error: 'No pending transactions to mine',
				time: generateTimestampz(),
				warning: null,
				stack: new Error().stack,
			})
			return
		}

		// Attempt to add a new block to the blockchain
		const successMine = chain.addBlockToChain(transactions, address)

		if (successMine) {
			// Log mining details if successful
			mineLog({
				difficulty: 5, // Consider making this dynamic or configurable
				hash: chain.getLatestBlock()?.blk.header.hash || 'N/A',
				mined_at: generateTimestampz(),
				nonce: chain.getLatestBlock()?.blk.header.nonce || 'N/A',
				miner: address,
			})
		}
	} catch (error) {
		// Log error details if an exception is thrown
		loggingErr({
			error: error || 'Unknown error',
			time: generateTimestampz(),
			stack: new Error().stack,
		})
	}
}
