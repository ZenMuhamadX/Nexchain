import { verifyMnemonic } from './helpers/verifyMnemonic'
import { generateSeedFromMnemonic } from '../mnemonic/createSeedFromMnemonic'
import { getBalance } from 'src/wallet/balance/getBalance'
import { saveMainWallet } from 'src/wallet/utils/saveWallet'

interface recoveryWalletData {
	walletAddress: string
	pubKey: string
	privateKey: string
	balance: number
	timeTransaction: number
}

export const importWalletFromMnemonicPhrase = async (
	mnemonicPhrase: string,
): Promise<string | undefined> => {
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
