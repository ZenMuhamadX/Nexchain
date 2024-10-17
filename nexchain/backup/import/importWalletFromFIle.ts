import path from 'path'
import fs from 'fs'
import { verifyMnemonic } from './helpers/verifyMnemonic'
import { generateSeedFromMnemonic } from '../mnemonic/createSeedFromMnemonic'
import { getBalance } from 'nexchain/account/balance/getBalance'
import { saveMainWallet } from 'nexchain/account/utils/saveWallet'

const dirPath = path.join(__dirname, '../../../MyBackup')
const filePath = path.join(dirPath, 'walletBackup.json')

interface recoveryWalletData {
	walletAddress: string
	pubKey: string
	privateKey: string
	balance: number
	timeTransaction: number
}

export const importWalletFromFile = async (): Promise<string | undefined> => {
	if (!fs.existsSync(filePath)) {
		console.log('Backup file does not exist')
		return
	}
	const data = fs.readFileSync(filePath, 'utf-8')
	const mnemonicPhrase = JSON.parse(data).mnemonic
	const seed = generateSeedFromMnemonic(mnemonicPhrase).seed
	const verifyPhrase = verifyMnemonic(mnemonicPhrase, seed)
	if (!verifyPhrase.isValid) {
		console.log('Invalid mnemonic phrase')
		return
	}
	const walletData = await getBalance(verifyPhrase.walletAddress)
	if (!walletData) {
		console.log('Wallet data not found')
		return
	}
	const recoveryWalletData: recoveryWalletData = {
		walletAddress: verifyPhrase.walletAddress,
		pubKey: verifyPhrase.pubKey,
		balance: walletData.balance,
		privateKey: verifyPhrase.privateKey,
		timeTransaction: walletData.timesTransaction,
	}
	console.log('Wallet data recovered successfully')
	saveMainWallet(
		recoveryWalletData.walletAddress,
		recoveryWalletData.privateKey,
	)
	return JSON.stringify(recoveryWalletData, null, 2)
}
