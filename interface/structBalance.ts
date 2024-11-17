export interface structBalance {
	address: string // Alamat akun Ethereum
	balance: number // Saldo dalam wei (unit terkecil ETH)
	timesTransaction: number // Jumlah transaksi
	lastTransactionDate: number | null // Tanggal transaksi terakhir
	nonce: number // Nonce untuk menghindari replay attack
	isContract: boolean // Menandakan apakah alamat adalah kontrak pintar
	decimal: 18
	symbol: 'nexu'
	notes: '1^18 nexu = 1 NXC' | any
}
