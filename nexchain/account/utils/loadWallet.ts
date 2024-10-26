import path from 'path'
import fs from 'fs'
import { structWalletToSave } from 'interface/structWalletToSave'
import { loadWalletConfig } from '../loadWalletConf'

// Fungsi untuk memuat kunci dari file atau menghasilkan kunci baru jika belum ada
export const loadWallet = (): structWalletToSave | undefined => {
	const walletName = loadWalletConfig()?.primaryWalletName
	// Tentukan path file kunci
	const walletPath = path.join(__dirname, `../../../wallet/${walletName}.json`)
	if (!fs.existsSync(walletPath)) {
		console.info(
			'Wallet not found please configure your primary wallet in config/wallet.conf.json',
		)
		console.info('if you have no wallet please create')
		return
	}
	// Membaca kunci dari file
	const walletData = fs.readFileSync(walletPath, 'utf8')
	const data: structWalletToSave = JSON.parse(walletData)
	return {
		mnemonic: data.mnemonic,
		privateKey: data.privateKey.slice(2),
		publicKey: data.publicKey.slice(2),
		walletAddress: data.walletAddress,
	}
}
