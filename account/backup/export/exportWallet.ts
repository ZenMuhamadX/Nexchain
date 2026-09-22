import fs from 'fs'
import path from 'path'

const dirPath = path.join(__dirname, '../../../MyBackup')
const filePath = path.join(dirPath, 'phrase.txt')

export const exportWallet = (mnemonic: string) => {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath)
	}
	console.log('Exporting wallet...')
	fs.writeFileSync(filePath, mnemonic)
	console.log(`Your Mnemonic phrase has been exported to ${filePath}`)
}
