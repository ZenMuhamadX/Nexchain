import { HexString } from 'interface/common/hexString'
import { comTxInterface } from './structComTx'

/**
 * Represents a transaction in the memory pool.
 */

export interface TxInterfaceFront extends comTxInterface {
	format: 'nexu'
	sender: string // Pengirim transaksi
	receiver: string // Penerima transaksi
	amount: string // Jumlah cryptocurrency yang ditransfer
	timestamp: number // Waktu transaksi dibuat
	txHash?: string // Hash transaksi (opsional)
	extraMessage: string // Pesan opsional yang disertakan dalam transaksi
	fee: string // Biaya terkait transaksi (opsional)
	status: 'pending' | 'confirmed' | 'rejected' // Status transaksi
	isValid: boolean // Menunjukkan apakah transaksi valid
	isPending: boolean // Menunjukkan apakah transaksi masih pending
	hexInput?: HexString
	isSenderContract: boolean
	isReceiverContract: boolean
	sign: {
		v: number
		r: string
		s: string
	}
}
