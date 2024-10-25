import { TxInterface } from 'interface/structTx'

// Fungsi untuk mengonversi transaksi menjadi string untuk hashing
export const txToString = (tx: TxInterface): string => {
	// Gabungkan properti transaksi yang relevan menjadi string
	return `${tx.sender}:${tx.receiver}:${tx.amount}:${tx.timestamp}:${tx.extraData}:${tx.fee || 0}:${tx.status}:${tx.isValid}:${tx.isPending}`
}
