/** @format */

// Mengimpor antarmuka transaksi
// Mengimpor fungsi untuk membuat objek immutable
import immutable from 'deep-freeze'
import { generateBlockHash } from '../../lib/hash/generateHash'
import { memPoolInterface } from '../interface/memPool.inf'

// Kelas untuk blok yang masih menunggu (pending)
export class memPoolBlock {
	// Index
	private index: number
	// Daftar transaksi dalam blok
	private transaction: memPoolInterface[]
	// Timestamp blok
	private timestamp: string
	// Hash dari blok ini
	private hash: string

	// Konstruktor untuk kelas pendingBlock
	constructor(index: number, transaction: memPoolInterface[], timestamp: string) {
		this.index = index
		this.transaction = immutable(transaction) as memPoolInterface[]
		// Membuat timestamp immutable agar tidak bisa diubah
		this.timestamp = immutable(timestamp)
		this.hash = generateBlockHash(index, timestamp, transaction)
	}
	// Mendapatkan daftar transaksi dalam blok
	public getTx(): memPoolInterface[] {
		return immutable(this.transaction) as memPoolInterface[]
	}
}
