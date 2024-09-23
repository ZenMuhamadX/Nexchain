import path from 'path'
import fs from 'node:fs'
import { BSON } from 'bson'
import { decrypt } from '../secure/decrypt/decrypt'
import { structWalletToSave } from 'src/model/interface/walletStructinf'
import { loadConfig } from 'src/lib/utils/loadConfig'

export const loadWallet = (): structWalletToSave | undefined => {
	const dirPath = path.join(__dirname, '../../../myWallet')
	const filePath = loadConfig()?.wallet.path as string

	try {
		// Check if the file exists
		if (!fs.existsSync(filePath) || !fs.existsSync(dirPath)) {
			console.error('File MainWallet.bin not found.')
			return undefined
		}

		// Read file if it exists
		const fileData = fs.readFileSync(filePath)
		const walletData = BSON.deserialize(fileData)

		// Check if wallet data is valid
		if (!walletData || !walletData.data || !walletData.data.encryptPrivateKey) {
			console.error('Invalid wallet data.')
			return undefined
		}

		const rawPrivateKey = walletData.data.encryptPrivateKey
		const walletPassword = process.env.WALLET_PASSWORD

		if (!walletPassword) {
			console.error('Environment variable WALLET_PASSWORD is not available.')
			return undefined
		}

		// Decrypt the private key
		const decryptedPrivateKey = decrypt(rawPrivateKey, walletPassword)
		walletData.data.decryptPrivateKey = decryptedPrivateKey

		return walletData as structWalletToSave
	} catch (error) {
		console.error('Error loading wallet:', error)
		return undefined
	}
}
