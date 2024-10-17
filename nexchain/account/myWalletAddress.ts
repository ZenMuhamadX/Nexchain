import { createWalletAddress } from './createWallet'
import { loadWallet } from './utils/loadWallet'

export const myWalletAddress = (): string => {
	const wallet = loadWallet()?.data.address!
	if (!wallet) {
		createWalletAddress()
	}
	return wallet
}
