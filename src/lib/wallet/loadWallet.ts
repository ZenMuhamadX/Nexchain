import path from 'path'
import fs from 'node:fs'
import { BSON } from 'bson'
import { createWalletAddress } from './createWallet'
// import { structWalletToSave } from '../../model/interface/walletStructinf.'
// import { decryptPrivateKey } from './secure/decrypt/decrypt'

export const loadWallet = () => {
	const dirPath = path.join(__dirname, '../../../wallet')
	const filePath = path.join(dirPath, `MainWallet.bin`)

	try {
		if (!fs.existsSync(dirPath)) {
			createWalletAddress()
		}

		// Membaca file dalam direktori
		const files = fs.readFileSync(filePath)

		const walletData = BSON.deserialize(files)

		return walletData
	} catch (error) {}
}

console.log(loadWallet());