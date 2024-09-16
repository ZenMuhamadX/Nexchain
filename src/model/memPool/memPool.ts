import { createTxHash } from '../../lib/hash/createTxHash'
import { generateTimestampz } from '../../lib/timestamp/generateTimestampz'
import { loggingErr } from '../../logging/errorLog'
import { memPoolInterfaceVlaidator } from '../../validator/infValidator/mempool.v'
import { memPoolInterface } from '../interface/memPool.inf'

export class memPool {
	private memPool: memPoolInterface[]

	constructor() {
		this.memPool = []
	}

	/**
	 * Adds a transaction to the memory pool.
	 * @param transaction - The transaction to be added.
	 * @returns True if the transaction was added successfully.
	 */
	public addTransaction(transaction: memPoolInterface): boolean {
		transaction.txHash = createTxHash(transaction)
		const isValidTx = memPoolInterfaceVlaidator.validate(transaction)
		if (isValidTx) {
			this.memPool.push(transaction)
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
	public getTransaction(): memPoolInterface[] {
		return this.memPool
	}

	/**
	 * Removes a specific transaction from the memory pool.
	 * @param transaction - The transaction to be removed.
	 * @returns True if the transaction was removed, false if it was not found.
	 */
	public removeTransaction(txHash: string): boolean {
		this.memPool.find((transaction) => {
			if (transaction.txHash === txHash) {
				this.memPool.splice(this.memPool.indexOf(transaction), 1)
				return true
			}
			return false
		})
		return false
	}

	/**
	 * Returns the number of transactions in the memory pool.
	 * @returns The number of transactions.
	 */
	public size(): number {
		return this.memPool.length
	}

	/**
	 * Clears all transactions from the memory pool.
	 */
	public clear(): void {
		this.memPool = []
	}

	/**
	 * Checks if the memory pool is full.
	 * @param limit - Optional parameter specifying the maximum number of transactions.
	 * @returns True if the memory pool is full, false otherwise.
	 */
	public isFull(limit: number = Infinity): boolean {
		return this.memPool.length >= limit
	}
}
