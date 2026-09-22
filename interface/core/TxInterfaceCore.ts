import { HexString } from 'interface/common/hexString'
import { comTxInterfaceCore } from './structComTxCore'
/**
 * Represents a transaction in the memory pool.
 */

export interface TxInterfaceCore extends comTxInterfaceCore {
	format: 'nexu'
	sender: string // Pengirim transaksi
	receiver: string // Penerima transaksi
	amount: bigint // Jumlah cryptocurrency yang ditransfer
	timestamp: number // Waktu transaksi dibuat
	txHash?: string // Hash transaksi (opsional)
	extraMessage: string // Pesan opsional yang disertakan dalam transaksi
	fee: bigint // Biaya terkait transaksi (opsional)
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
