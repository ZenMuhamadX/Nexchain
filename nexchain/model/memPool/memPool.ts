import { transactionValidator } from 'interface/validate/txValidator.v'
import { saveMempool } from 'nexchain/storage/mempool/saveMemPool'
import { loadMempool } from 'nexchain/storage/mempool/loadMempool'
import { saveTxHistory } from 'nexchain/transaction/saveTxHistory'
import { TxInterface } from 'interface/structTx'
import { getBalance } from 'nexchain/account/balance/getBalance'
import { getPendingBalance } from 'nexchain/transaction/getPendingBalance'
import { setPendingBalance } from 'nexchain/transaction/setPendingBalancet'

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
		const isValidTx = await transactionValidator(transaction)
		if (!isValidTx) {
			console.log('Transaction validation failed')
			return false
		}

		// Ambil saldo utama dan pending balance
		const balance = await getBalance(transaction.sender)
		const pendingBalance = await getPendingBalance(transaction.sender) // Ambil pending balance

		if (!balance) {
			console.log('Insufficient balance')
			return false
		}

		// Hitung available balance
		const availableBalance = balance.balance - pendingBalance.pendingAmount

		// Cek apakah available balance cukup untuk amount + fee
		if (availableBalance < transaction.amount + (transaction.fee || 0)) {
			console.log('Insufficient available balance for the transaction')
			return false
		}

		// Update pending balance dengan menambahkan amount transaksi
		const newPendingAmount =
			(pendingBalance.pendingAmount || 0) +
			transaction.amount +
			(transaction.fee || 0)
		await setPendingBalance({
			address: transaction.sender,
			pendingAmount: newPendingAmount,
		})

		// Simpan transaksi ke mempool dan riwayat transaksi
		await saveMempool(transaction)
		await saveTxHistory(transaction.txHash!, transaction)
		console.log(`TxnHash: ${transaction.txHash}`)
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
