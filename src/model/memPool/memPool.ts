import { createSignature } from 'src/lib/block/createSignature'
import { createTxHash } from '../../lib/hash/createTxHash'
import { generateTimestampz } from '../../lib/timestamp/generateTimestampz'
import { loadConfig } from '../../lib/utils/loadConfig'
import { MemPoolInterface } from '../interface/memPool.inf'
import { loadMempool } from './loadMempool'
import { saveMempool } from './saveMempool'
import { transactionValidator } from 'src/validator/transactValidator/txValidator.v'
import { loggingInfo } from 'src/logging/infoLog'
import { loggingErr } from 'src/logging/errorLog'

export class MemPool {
	private MemPool: MemPoolInterface[]

	constructor() {
		this.MemPool = this.loadStorage()
	}

	/**
	 * Adds a transaction to the memory pool.
	 * @param transaction - The transaction to be added.
	 * @returns True if the transaction was added successfully, otherwise false.
	 */

	public addTransaction(transaction: MemPoolInterface): boolean {
		if (this.isFull()) {
			loggingInfo({
				message: 'Mempool is full',
				time: generateTimestampz(),
				context: 'MemPool',
			})
			return false
		}
		transaction.signature = createSignature(transaction).signature
		transaction.txHash = createTxHash(transaction)
		transaction.timestamp = generateTimestampz()
		transaction.status = 'pending'
		const isValidTx = transactionValidator(transaction)
		if (!isValidTx) return false
		this.MemPool.push(transaction)
		this.autoSave()
		return true
	}

	private autoSave() {
		if (this.isFull()) {
			saveMempool(this.MemPool)
			loggingInfo({
				message: 'Mempool saved to storage',
				time: generateTimestampz(),
				context: 'MemPool',
			})
		}
	}

	private loadStorage(): MemPoolInterface[] {
		try {
			const savedMempool = loadMempool()
			if (savedMempool) {
				loggingInfo({
					message: 'Mempool loaded from storage',
					time: generateTimestampz(),
					context: 'MemPool',
				})
				return savedMempool
			} else {
				loggingInfo({
					message: 'No mempool found in storage',
					time: generateTimestampz(),
					context: 'MemPool',
				})
				return []
			}
		} catch (error) {
			loggingErr({
				error: error,
				stack: new Error().stack,
				hint: 'Error loading mempool from storage',
				time: generateTimestampz(),
				context: 'MemPool',
			})
			return []
		}
	}

	/**
	 * Gets all valid transactions in the memory pool.
	 * @returns An array of transactions.
	 */

	public getValidTransactions(): MemPoolInterface[] {
		return loadMempool()
	}

	/**
	 * Removes a specific transaction from the memory pool.
	 * @param txHash - The hash of the transaction to be removed.
	 * @returns True if the transaction was removed, otherwise false.
	 */
	// public removeProcessedTransaction(transaction: MemPoolInterface[]): boolean {
	// 	this.
	// }

	/**
	 * Returns the number of transactions in the memory pool.
	 * @returns The number of transactions.
	 */
	public size(): number {
		return this.MemPool.length
	}

	/**
	 * Clears all transactions from the memory pool.
	 */
	// private clear(): void {
	// 	this.transactions = []
	// }

	/**
	 * Checks if the memory pool has reached its limit. if transaction limit will be clear and
	 * @returns True if the memory pool has reached limit, otherwise false.
	 */
	public isFull(): boolean {
		const maxTransactions = loadConfig()?.memPool.maxMempoolSize as number
		return this.MemPool.length >= maxTransactions
	}
}
