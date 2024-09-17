import { createTxHash } from '../../lib/hash/createTxHash'
import { generateTimestampz } from '../../lib/timestamp/generateTimestampz'
import { loggingErr } from '../../logging/errorLog'
import { memPoolInterfaceValidator } from '../../validator/mempool.v'
import { memPoolInterface } from '../interface/memPool.inf'

export class MemPool {
	private transactions: memPoolInterface[]

	constructor() {
		this.transactions = []
	}

	/**
	 * Adds a transaction to the memory pool.
	 * @param transaction - The transaction to be added.
	 * @returns True if the transaction was added successfully, otherwise false.
	 */
	public addTransaction(transaction: memPoolInterface): boolean {
		transaction.txHash = createTxHash(transaction)
		const isValidTx = memPoolInterfaceValidator.validate(transaction)
		if (isValidTx) {
			this.transactions.push(transaction)
			return true
		}
		loggingErr({
			error: new Error('Invalid transaction data'),
			stack: new Error().stack,
			time: generateTimestampz(),
		})
		return false
	}

	/**
	 * Gets all transactions in the memory pool.
	 * @returns An array of transactions.
	 */
	public getTransactions(): memPoolInterface[] {
		return this.transactions
	}

	/**
	 * Removes a specific transaction from the memory pool.
	 * @param txHash - The hash of the transaction to be removed.
	 * @returns True if the transaction was removed, otherwise false.
	 */
	public removeTransaction(txHash: string): boolean {
		const index = this.transactions.findIndex(
			(transaction) => transaction.txHash === txHash,
		)
		if (index !== -1) {
			this.transactions.splice(index, 1)
			return true
		}
		return false
	}

	/**
	 * Returns the number of transactions in the memory pool.
	 * @returns The number of transactions.
	 */
	public size(): number {
		return this.transactions.length
	}

	/**
	 * Clears all transactions from the memory pool.
	 */
	public clear(): void {
		this.transactions = []
	}

	/**
	 * Checks if the memory pool has reached its limit.
	 * @param limit - Optional parameter specifying the maximum number of transactions.
	 * @returns True if the memory pool has reached the limit, otherwise false.
	 */
	public isFull(limit: number = Infinity): boolean {
		return this.transactions.length >= limit
	}
}
