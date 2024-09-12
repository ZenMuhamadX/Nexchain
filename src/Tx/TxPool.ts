/** @format */

import { generateTimestampz } from '../lib/timestamp/generateTimestampz' // Mengimpor fungsi untuk menghasilkan timestamp
import { TxInterface } from '../model/blocks/TxBlock' // Mengimpor interface untuk objek transaksi
import { TxBlock } from '../model/blocks/TxBlock' // Mengimpor class untuk blok yang tertunda
import { createTxHash } from '../lib/hash/createTxHash'
import { validatorIntercafeTx } from '../txValidator/interfaceTxValidator'
import { loggingErr } from '../logging/errorLog'

interface RawTransaction {
	from: string
	to: string
	amount: number
	message?: string
}
export class TransactionPool {
	private pendingTransactions: TxInterface[] // Array untuk menyimpan transaksi yang tertunda
	private pendingBlocks: any // Array untuk menyimpan blok yang tertunda
	private timestamp: string

	constructor() {
		this.pendingTransactions = [] // Inisialisasi array transaksi yang tertunda sebagai array kosong
		this.pendingBlocks = [] // Inisialisasi array blok yang tertunda sebagai array kosong
		this.timestamp = generateTimestampz() // Menghasilkan timestamp saat inisialisasi
	}

	public addTransactionToPool(transactionData: RawTransaction): void {
		// Fungsi untuk menambahkan transaksi ke array transaksi yang tertunda
		const { error, value, warning } =
			validatorIntercafeTx.validate(transactionData)
		if (error) {
			loggingErr({
				error: error.message,
				time: this.timestamp,
				warning: warning,
				hint: 'Invalid transaction data',
				stack: new Error().stack,
			})
		}
		const transaction: TxInterface = this.convertToTxInterface(value)
		transaction.txHash = createTxHash(transaction, 1).hash
		this.pendingTransactions.push(transaction)
		if (this.pendingTransactions.length > 10) {
			// Jumlah transaksi yang tertunda melebihi 10
			this.createBlockFromPendingTransactions() // Membuat blok baru dari transaksi yang tertunda
		}
	}

	private convertToTxInterface(rawTransaction: RawTransaction): TxInterface {
		// Fungsi untuk mengonversi RawTransaction ke TxInterface
		return {
			...rawTransaction,
			txHash: '', // Inisialisasi txHash dengan nilai default
		}
	}

	private createBlockFromPendingTransactions(): void {
		let indexBlock = 0
		if (this.pendingBlocks.length > 0) {
			indexBlock = this.pendingBlocks.length + 1
		}
		// Fungsi untuk membuat blok baru dari transaksi yang tertunda
		const transactionsForBlock = this.pendingTransactions.splice(0, 10) // Mengambil dan menghapus 10 transaksi pertama
		const timestamp = generateTimestampz() // Menghasilkan timestamp
		const newBlock = new TxBlock(indexBlock, transactionsForBlock, timestamp) // Membuat blok baru dengan 10 transaksi dan timestamp
		this.pendingBlocks.push(newBlock) // Menambahkan blok baru ke array blok yang tertunda
	}

	public getPendingBlocks() {
		// Fungsi untuk mendapatkan array blok yang tertunda
		return this.pendingBlocks // Mengembalikan array blok yang dibekukan
	}
}
