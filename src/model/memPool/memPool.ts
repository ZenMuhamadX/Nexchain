import { createSignature } from 'src/lib/block/createSignature'
import { createTxnHash } from '../../lib/hash/createTxHash'
import { generateTimestampz } from '../../lib/timestamp/generateTimestampz'
import { loadConfig } from '../../storage/loadConfig'
import { MemPoolInterface } from '../interface/memPool.inf'
import { transactionValidator } from 'src/validator/transactValidator/txValidator.v'
import { loggingInfo } from 'src/logging/infoLog'
import { saveMempool } from 'src/storage/saveMemPool'
import { loadMempool } from 'src/storage/loadMempool'

export class MemPool {
	private memPool: MemPoolInterface[] = []

	constructor() {
		this.initializePool()
	}

	private async initializePool(): Promise<void> {
		this.memPool = await this.recoveryPool()
	}

	private async recoveryPool(): Promise<MemPoolInterface[]> {
		const recovery = await loadMempool()
		return recovery as MemPoolInterface[]
	}

	/**
	 * Adds a transaction to the memory pool.
	 * @param transaction - The transaction to be added.
	 * @returns True if the transaction was added successfully, otherwise false.
	 */
	public async addTransaction(
		transaction: MemPoolInterface,
	): Promise<boolean | MemPoolInterface> {
		if (this.isFull()) {
			loggingInfo({
				message: 'Mempool is full',
				time: generateTimestampz(),
				context: 'MemPool',
			})
			return false
		}

		// Prepare the transaction
		transaction.txHash = createTxnHash(transaction)
		transaction.status = 'pending'
		transaction.signature = createSignature(transaction).signature
		transaction.fee = ((transaction.amount / 10000) * 2) / 1000
		if (transaction.amount < 25) transaction.fee = 0.000001

		// Validate the transaction
		const isValidTx = await transactionValidator(transaction)
		if (!isValidTx) return false

		// Save the transaction
		await saveMempool(transaction)
		this.memPool.push(transaction)
		return transaction
	}

	/**
	 * Gets all valid transactions in the memory pool.
	 * @returns An array of transactions.
	 */
	public async getValidTransactions(): Promise<MemPoolInterface[]> {
		const data = await this.recoveryPool()
		return data as MemPoolInterface[]
	}
	/**
	 * Returns the number of transactions in the memory pool.
	 * @returns The number of transactions.
	 */
	public size(): number {
		return this.memPool.length
	}

	/**
	 * Checks if the memory pool has reached its limit.
	 * @returns True if the memory pool has reached limit, otherwise false.
	 */
	public isFull(): boolean {
		const maxTransactions = loadConfig()?.memPool.maxMempoolSize as number
		return this.memPool.length >= maxTransactions
	}
}
