import { transactionValidator } from 'interface/validate/txValidator.v'
import { saveMempool } from 'nexchain/storage/mempool/saveMemPool'
import { loadMempool } from 'nexchain/storage/mempool/loadMempool'
import { saveTxHistory } from 'nexchain/transaction/saveTxHistory'
import { loadWallet } from 'nexchain/account/utils/loadWallet'
import { TxInterface } from 'interface/structTx'

export class MemPool {
	constructor() {
		console.log('MemPool called')
	}

	/**
	 * Adds a transaction to the memory pool.
	 * @param transaction - The transaction to be added.
	 * @returns True if the transaction was added successfully, otherwise false.
	 */
	public async addTransaction(
		transaction: TxInterface,
	): Promise<boolean | TxInterface> {
		// Validate the transaction
		const { publicKey } = loadWallet()!
		const isValidTx = await transactionValidator(transaction, publicKey)
		if (!isValidTx) return false
		// Save the transaction
		await saveMempool(transaction)
		await saveTxHistory(transaction.txHash!, transaction)
		return transaction
	}

	/**
	 * Gets all valid transactions in the memory pool.
	 * @returns An array of transactions.
	 */
	public async getValidTransactions(): Promise<TxInterface[]> {
		const data = await loadMempool()
		return data as TxInterface[]
	}
}
