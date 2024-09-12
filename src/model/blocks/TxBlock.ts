/** @format */

// Mengimpor antarmuka transaksi
// Mengimpor fungsi untuk membuat objek immutable
import immutable from 'deep-freeze'
import { generateBlockHash } from '../../lib/hash/generateHash'

export interface TxInterface {
	txHash?: string
	amount: number
	from: string
	to: string
	message?: string
	nonce?: number
}

// Kelas untuk blok yang masih menunggu (pending)
export class TxBlock {
	// Index
	private index: number
	// Daftar transaksi dalam blok
	private transaction: TxInterface[]
	// Timestamp blok
	private timestamp: string
	// Hash dari blok ini
	private hash: string

	// Konstruktor untuk kelas pendingBlock
	constructor(index: number, transaction: TxInterface[], timestamp: string) {
		this.index = index
		this.transaction = immutable(transaction) as TxInterface[]
		// Membuat timestamp immutable agar tidak bisa diubah
		this.timestamp = immutable(timestamp)
		this.hash = generateBlockHash(index, timestamp, transaction)
	}
	// Mendapatkan daftar transaksi dalam blok
	public getTx(): TxInterface[] {
		return immutable(this.transaction) as TxInterface[]
	}
}
