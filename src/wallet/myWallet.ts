import { createWalletAddress } from './createWallet'

export const myWallet = (): string => {
	const wallet = createWalletAddress()
	return wallet
}
