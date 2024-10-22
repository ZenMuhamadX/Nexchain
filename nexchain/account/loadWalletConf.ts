import { existsSync, readFileSync } from 'fs'
import { WalletConfig } from 'interface/walletConfig'
import path from 'path'

export const loadWalletConfig = (): WalletConfig | null => {
	const dirPath = path.join(__dirname, '../../config/')
	const filePath = path.join(dirPath, 'wallet.conf.json')

	// Cek apakah direktori dan file ada
	if (!existsSync(filePath)) {
		console.log('Wallet configuration file does not exist.')
		return null // Jika file tidak ada, kembalikan null
	}

	try {
		// Membaca file dan mengonversi ke objek WalletConfig
		const data = readFileSync(filePath, 'utf-8')
		const config: WalletConfig = JSON.parse(data)

		return config // Mengembalikan objek WalletConfig
	} catch (error) {
		console.error('Error loading wallet configuration:', error)
		return null // Kembalikan null jika terjadi kesalahan
	}
}
