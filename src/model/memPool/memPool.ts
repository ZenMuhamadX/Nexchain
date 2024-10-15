import { transactionValidator } from 'src/validator/interface/txValidator/txValidator.v'
import { saveMempool } from 'src/storage/mempool/saveMemPool'
import { loadMempool } from 'src/storage/mempool/loadMempool'
import { txInterface } from '../interface/memPool.inf'
import { saveHistory } from 'src/transaction/utils/saveTxHistory'
import { getKeyPair } from 'src/lib/hash/getKeyPair'

export class MemPool {
	constructor() {
		this.initializePool()
	}

	private async initializePool(): Promise<void> {
		await this.recoveryPool()
	}

	private async recoveryPool(): Promise<txInterface[]> {
		const recovery = await loadMempool()
		return recovery as txInterface[]
	}

	/**
	 * Adds a transaction to the memory pool.
	 * @param transaction - The transaction to be added.
	 * @returns True if the transaction was added successfully, otherwise false.
	 */
	public async addTransaction(
		transaction: txInterface,
	): Promise<boolean | txInterface> {
		// Validate the transaction
		const { privateKey, publicKey } = getKeyPair()
		const isValidTx = await transactionValidator(
			transaction,
			publicKey,
			privateKey,
		)
		if (!isValidTx) return false

		// Save the transaction
		await saveMempool(transaction)
		saveHistory(transaction.txHash!, transaction)
		return transaction
	}

	/**
	 * Gets all valid transactions in the memory pool.
	 * @returns An array of transactions.
	 */
	public async getValidTransactions(): Promise<txInterface[]> {
		const data = await this.recoveryPool()
		return data as txInterface[]
	}
}
