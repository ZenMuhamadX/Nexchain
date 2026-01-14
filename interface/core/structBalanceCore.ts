export interface structBalanceCore {
	address: string // Alamat akun Ethereum
	balance: bigint // Saldo dalam nexu (unit terkecil NXC)
	transactionCount: number // Jumlah transaksi
	lastTransactionDate: number | null // Tanggal transaksi terakhir
	nonce: number // Nonce untuk menghindari replay attack
	isContract: boolean // Menandakan apakah alamat adalah kontrak pintar
}
