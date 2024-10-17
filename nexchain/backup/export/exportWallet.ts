import fs from 'fs'
import path from 'path'
import { binaryTostring } from 'nexchain/lib/bin/binaryToString'
import { getKeyPair } from 'nexchain/lib/hash/getKeyPair'

const dirPath = path.join(__dirname, '../../../MyBackup')
const filePath = path.join(dirPath, 'walletBackup.json')

export const exportWallet = () => {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath)
	}
	console.log('Exporting wallet...')
	const { mnemonic } = getKeyPair()
	const stringMnemonic = binaryTostring(mnemonic)
	const walletDataToExport = {
		mnemonic: stringMnemonic,
	}
	fs.writeFileSync(filePath, JSON.stringify(walletDataToExport, null, 2))
	console.log('Wallet exported successfully')
}
