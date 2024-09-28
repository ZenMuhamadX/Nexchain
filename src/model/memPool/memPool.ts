import { createSignature } from 'src/lib/block/createSignature'
import { createTxHash } from '../../lib/hash/createTxHash'
import { generateTimestampz } from '../../lib/timestamp/generateTimestampz'
import { loadConfig } from '../../storage/loadConfig'
import { MemPoolInterface } from '../interface/memPool.inf'
import { transactionValidator } from 'src/validator/transactValidator/txValidator.v'
import { loggingInfo } from 'src/logging/infoLog'
import { hasSufficientBalance } from 'src/wallet/balance/utils/hasSufficientBalance'
import { handleDoubleSpend } from 'src/wallet/balance/utils/doubleSpend'

export class MemPool {
	private MemPool: MemPoolInterface[]

	constructor() {
		this.MemPool = []
	}

	/**
	 * Adds a transaction to the memory pool.
	 * @param transaction - The transaction to be added.
	 * @returns True if the transaction was added successfully, otherwise false.
	 */

	public addTransaction(transaction: MemPoolInterface): boolean | undefined {
		if (this.isFull()) {
			loggingInfo({
				message: 'Mempool is full',
				time: generateTimestampz(),
				context: 'MemPool',
			})
			return false
		}
		transaction.txHash = createTxHash(transaction)
		transaction.timestamp = generateTimestampz()
		transaction.status = 'pending'
		transaction.signature = createSignature(transaction).signature
		transaction.fee = transaction.amount * 0.0001
		const isValidTx = transactionValidator(transaction)
		if (!isValidTx) return false
		handleDoubleSpend(transaction.txHash).then((status) => {
			if (status.doubleSpend === true) {
				loggingInfo({
					message: 'Double spend',
					metadata: {
						txHash: status.txHash,
					},
					time: generateTimestampz(),
					context: 'MemPool',
				})
				return false // Kembalikan false jika ada double spend
			}
			return hasSufficientBalance(
				transaction.from,
				transaction.amount,
				transaction.fee!,
			).then((balanceStatus) => {
				if (balanceStatus) {
					this.MemPool.push(transaction) // Hanya tambahkan jika saldo cukup
					return true // Kembalikan true jika transaksi valid
				}
				return false // Kembalikan false jika saldo tidak cukup
			})
		})
		return
	}

	/**
	 * Gets all valid transactions in the memory pool.
	 * @returns An array of transactions.
	 */

	public getValidTransactions(): MemPoolInterface[] {
		return this.MemPool
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
