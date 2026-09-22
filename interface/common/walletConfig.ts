export interface WalletConfig {
	primaryWalletName: string // Nama wallet
	createdAt: string // Tanggal dan waktu saat wallet dibuat
	network: string // Jaringan (mainnet, testnet, dll.)
	isBackup: boolean // Informasi cadangan
}
