/** @format */

import { MemPool } from '../model/memPool/memPool'
import { generateTimestampz } from '../lib/timestamp/generateTimestampz'
import { loggingErr } from '../../logging/errorLog'
import { mineLog } from '../../logging/mineLog'
import { chains } from 'nexchain/block/initBlock'
import { Block } from 'nexchain/model/block/block'
import { TxInterface } from 'interface/structTx'
import { getCurrentBlock } from 'nexchain/block/query/direct/block/getCurrentBlock'
import _ from 'lodash'
import { isChainsValid } from 'nexchain/block/isChainValid'
import { getBlockByHeight } from 'nexchain/block/query/direct/block/getBlockByHeight'

// Function to mine a block and add it to the blockchain
export const miningBlock = async (address: string): Promise<void> => {
	const isGenesisBlock = await getBlockByHeight(0).catch(() => null)
	if (!isGenesisBlock) {
		console.error('Genesis block not found')
		return
	}
	// Initialize blockchain and memory pool instances
	const pool = new MemPool()
	const transactions: TxInterface[] = await pool.getValidTransactions()

	try {
		// Jika tidak ada transaksi yang pending, info dan lanjutkan proses
		if (transactions.length === 0) {
			console.info('Block mined with 0 transactions')
		} else {
			// Loop hanya jika ada transaksi
			transactions.forEach((tx) => {
				tx.isValid = true
				tx.isPending = false
				tx.status = 'confirmed'
			})
		}

		const isAllBlockValid = await isChainsValid()
		if (!isAllBlockValid) {
			loggingErr({
				error: 'Block is not valid',
				context: 'miningBlock',
				hint: '',
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
			const lastBlock: Block = await getCurrentBlock()
			mineLog({
				difficulty: 3, // Consider making this dynamic or configurable
				hash: lastBlock?.block.header.hash || 'N/A',
				mined_at: generateTimestampz(),
				nonce: lastBlock?.block.header.nonce || 'N/A',
				miner: address,
			})
		} else {
			loggingErr({
				error: 'Failed to mine block',
				context: 'miningBlock',
				hint: 'Block was not added to the chain',
				time: generateTimestampz(),
				warning: null,
				stack: new Error().stack,
			})
		}
	} catch (error) {
		// Log error details if an exception is thrown
		loggingErr({
			error: error instanceof Error ? error.message : 'Unknown error',
			context: 'miningBlock',
			hint: 'Error mining block',
			warning: null,
			time: generateTimestampz(),
			stack: new Error().stack,
		})
	}
}
