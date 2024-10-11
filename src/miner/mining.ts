/** @format */

import { MemPool } from '../model/memPool/memPool'
import { generateTimestampz } from '../lib/timestamp/generateTimestampz'
import { loggingErr } from '../logging/errorLog'
import { mineLog } from '../logging/mineLog'
import { chains } from 'src/block/initBlock'
import { getLatestBlock } from 'src/block/query/direct/getLatestBlock'
import { Block } from 'src/model/blocks/block'

// Function to mine a block and add it to the blockchain
export const miningBlock = async (address: string): Promise<void> => {
	// Initialize blockchain and memory pool instances
	const pool = new MemPool()
	const transactions = await pool.getValidTransactions()

	try {
		// Check if there are pending transactions to mine
		if (!transactions) {
			loggingErr({
				error: 'No pending transactions to mine',
				context: 'miningBlock',
				hint: 'No transactions to mine',
				time: generateTimestampz(),
				warning: null,
				stack: new Error().stack,
			})
			return
		}
		const isBlockValid = chains.verify()
		if (!isBlockValid) {
			loggingErr({
				error: 'Block is not valid',
				context: 'miningBlock',
				hint: 'Prev Block is not valid',
				time: generateTimestampz(),
				warning: null,
				stack: new Error().stack,
			})
			return
		}
		// Attempt to add a new block to the blockchain
		const successMine = await chains.addBlockToChain(transactions, address)
		if (successMine) {
			// Log mining details if successful
			const lastBlock = getLatestBlock(false) as Block
			mineLog({
				difficulty: 1, // Consider making this dynamic or configurable
				hash: lastBlock?.block.header.hash || 'N/A',
				mined_at: generateTimestampz(),
				nonce: lastBlock?.block.header.nonce || 'N/A',
				miner: address,
			})
		}
	} catch (error) {
		// Log error details if an exception is thrown
		loggingErr({
			error: error || 'Unknown error',
			context: 'miningBlock',
			hint: 'Error mining block',
			warning: null,
			time: generateTimestampz(),
			stack: new Error().stack,
		})
	}
}
