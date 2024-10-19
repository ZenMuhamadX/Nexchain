import { comTxInterface } from './commonTxInterface'
/**
 * Represents a transaction in the memory pool.
 */

export interface TxInterface extends comTxInterface {
	sender: string // Pengirim transaksi
	receiver: string // Penerima transaksi
	amount: number // Jumlah cryptocurrency yang ditransfer
	timestamp: number // Waktu transaksi dibuat
	txHash?: string // Hash transaksi (opsional)
	signature?: string // Tanda tangan digital transaksi
	message: Buffer // Pesan opsional yang disertakan dalam transaksi
	fee?: number // Biaya terkait transaksi (opsional)
	status: 'pending' | 'confirmed' | 'rejected' // Status transaksi
	isValid: boolean // Menunjukkan apakah transaksi valid
	isPending: boolean // Menunjukkan apakah transaksi masih pending
}
