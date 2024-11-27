/** @format */

import { MemPool } from '../model/memPool/memPool'
import { generateTimestampz } from '../lib/generateTimestampz'
import { loggingErr } from '../../logging/errorLog'
import { mineLog } from '../../logging/mineLog'
import { chains } from 'nexchain/block/initBlock'
import { TxInterface } from 'interface/structTx'
import _ from 'lodash'
import { isChainsValid } from 'nexchain/block/isChainValid'
import { getBlockByHeight } from 'nexchain/block/query/onChain/block/getBlockByHeight'
import { contract } from 'interface/structContract'
import { logToConsole } from 'logging/logging'

// Function to mine a block and add it to the blockchain
export const mineBlock = async (address: string): Promise<void> => {
	const isGenesisBlock = await getBlockByHeight(0, 'json').catch(() => null)
	if (!isGenesisBlock) {
		console.error('Genesis block not found')
		return
	}
	// Initialize blockchain and memory pool instances
	const pool = new MemPool()
	const transactions: TxInterface[] = await pool.getValidTransactions()
	const contractPool: contract[] = await pool.getContractPool()

	try {
		// Jika tidak ada transaksi yang pending, info dan lanjutkan proses
		if (transactions.length === 0) {
			logToConsole('Block mined with 0 transactions')
		} else {
			// Loop hanya jika ada transaksi
			_.forEach(transactions, (tx) => {
				tx.isValid = true
				tx.isPending = false
				tx.status = 'confirmed'
			})
		}

		const isAllBlockValid = await isChainsValid()
		if (!isAllBlockValid) {
			loggingErr({
				message: 'Block is not valid',
				context: 'miningBlock',
				level: 'error',
				priority: 'high',
				timestamp: generateTimestampz(),
				stack: new Error().stack!,
			})
			return
		}

		// Attempt to add a new block to the blockchain
		const successMine = await chains.addBlockToChain(
			transactions,
			contractPool,
			address,
		)
		if (successMine.status) {
			mineLog(successMine.block!)
		} else {
			loggingErr({
				message: 'Failed to mine block',
				context: 'miningBlock',
				hint: 'Block was not added to the chain',
				timestamp: generateTimestampz(),
				level: 'error',
				priority: 'high',
				stack: new Error().stack!,
			})
		}
	} catch (error) {
		// Log error details if an exception is thrown
		loggingErr({
			message: error instanceof Error ? error.message : 'Unknown error',
			context: 'miningBlock',
			hint: 'Error mining block',
			level: 'error',
			priority: 'high',
			timestamp: generateTimestampz(),
			stack: new Error().stack!,
		})
	}
}
