import { verifyMnemonic } from './helpers/verifyMnemonic'
import { generateSeedFromMnemonic } from '../mnemonic/createSeedFromMnemonic'
import { getBalance } from 'nexchain/account/balance/getBalance'
import { saveMainWallet } from 'nexchain/account/utils/saveWallet'

interface recoveryWalletData {
	walletAddress: string
	privateKey: string
}

export const importWalletFromMnemonicPhrase = async (
	mnemonicPhrase: string,
): Promise<void> => {
	const seed = generateSeedFromMnemonic(mnemonicPhrase).seed
	const verifyPhrase = verifyMnemonic(mnemonicPhrase, seed)
	if (!verifyPhrase.isValid) {
		console.log('Invalid mnemonic phrase')
		process.exit()
	}
	const walletData = await getBalance(verifyPhrase.walletAddress)
	if (!walletData) {
		console.log('Wallet data not found')
		process.exit()
	}
	const recoveryWalletData: recoveryWalletData = {
		walletAddress: verifyPhrase.walletAddress,
		privateKey: verifyPhrase.privateKey,
	}
	console.log('Wallet data recovered successfully')
	saveMainWallet(
		recoveryWalletData.walletAddress,
		recoveryWalletData.privateKey,
	)
}
